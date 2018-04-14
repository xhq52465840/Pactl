'use strict';

var newBill_fn = ['$scope', '$modal', '$rootScope', 'restAPI', 'Notification', 'Auth', '$stateParams', '$state', '$filter', '$timeout',
  function ($scope, $modal, $rootScope, restAPI, Notification, Auth, $stateParams, $state, $filter, $timeout) {
    var vm = $scope;
    var awId = $stateParams.awId || '';
    vm.addNew = addNew;
    // 分单
    vm.subBillObj = {
      type: '1'
    };
    // 主单
    vm.billObj = {};
    vm.countryData = []; //显示国家数据 
    vm.currencyData = [];
    vm.connect = connect;
    vm.history = history;
    vm.pickTemp = pickTemp;
    vm.remove = remove;
    vm.save = save;
    vm.saveUser = saveUser;
    vm.sendFHL = sendFHL;
    vm.searchUser = searchUser;
    vm.saveTemp = saveTemp;
    vm.subErrorData = []; // 正则错的数据
    vm.weightCodeData = [];
    vm.wtValData = [];
    vm.refreshDest = refreshDest;
    vm.selectName = selectName;
    vm.timesFHL = '';
    vm.tagTransform = tagTransform;
    vm.tagTransform2str = tagTransform2str;

    getCountry();

    function tagTransform(tag) {
      try {
        tag = tag.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (tag.length === 3) {
          return {
            code: tag
          };
        } else {
          return;
        }
      } catch (error) {
        return;
      }
    }

    function tagTransform2str(param, srcItem, toItem) {
      var str = "";
      var list = param[srcItem];

      angular.forEach(list, function (v, k) {
        if (str.length > 0) {
          str += ",";
        }
        str += v.code;
      });
      param[toItem] = str;
    }
    /**
     * 新增
     */
    function addNew() {
      var addNewDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '是否保存并新增?'
            };
          }
        }
      });
      addNewDialog.result.then(function () {
        var callback = function () {
          $state.go('agentWaybill.newBill', {
            awId: ''
          }, {
            reload: true
          });
        }
        save(callback);
      }, function () {

      });
    }
    /**
     * 
     * 根据参数查询机场数据
     * 
     * @param {any} param
     */
    function refreshDest(param) {
      var searchObj = {};
      vm.airportDataPart = [];
      if (param) {
        searchObj = {
          airportCode: param
        };
      } else {
        searchObj = {
          airportCode: param,
          isCommon: '1'
        };
      }
      restAPI.airPort.queryList.save({}, searchObj)
        .$promise.then(function (resp) {
          vm.airportDataPart = resp.rows;
        });
    }
    /**
     * 获取国家
     */
    function getCountry() {
      $rootScope.loading = true;
      restAPI.country.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.countryData = resp.data;
          getWeightCode();
        });
    }
    /**
     * kg lb
     */
    function getWeightCode() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480573443228570'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.weightCodeData = resp.rows;
          getWtVal();
        });
    }
    /**
     * wtVal
     */
    function getWtVal() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480573104950987'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.wtValData = resp.rows;
          getNecessarySubData();
        });
    }

    function getNecessarySubData() {
      $rootScope.loading = true;
      restAPI.fieldPactl.fieldList.save({}, {
          sid: '102'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.necessarySubData = [];
          angular.forEach(resp.rows || [], function (v, k) {
            v.fieldMaintain && vm.necessarySubData.push(v.fieldMaintain.field);
          });
          getCurrency();
        });
    }
    /**
     * 比种
     */
    function getCurrency() {
      $rootScope.loading = true;
      restAPI.currency.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.currencyData = resp.data;
          if (awId) {
            search();
          } else {
            //TODO 显示空子单基本数据
            showBlankSubBillDetail();
          }
        });
    }
    /**
     * 根据运单号查数据
     */
    function search() {
      $rootScope.loading = true;
      restAPI.subBill.getMasterBill.save({}, awId)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
              showSubBillDetail(resp.data);
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 显示空的子单数据
     * 
     * @param {any} data
     */
    function showBlankSubBillDetail() {
      restAPI.airData.getDataByCode.save({}, 'PVG')
        .$promise.then(function (resp) {
          var airportData = resp.data;
          if (airportData) {
            vm.subBillObj.dept = airportData;
          }
        });
      angular.forEach(vm.weightCodeData, function (v, k) {
        if (v.id === 'K') {
          vm.subBillObj.weightCode = v;
        }
      });
      vm.subBillObj.carriageValue = 'NVD';
      vm.subBillObj.insuranceValue = 'XXX';
      vm.subBillObj.customsValue = 'NCV';
      angular.forEach(vm.wtValData, function (v, k) {
        if (v.id === 'P') {
          vm.subBillObj.wtVal = v;
        }
        if (v.id === 'P') {
          vm.subBillObj.other = v;
        }
      });
      angular.forEach(vm.currencyData, function (v, k) {
        if (v.currencyCode === 'CNY') {
          vm.subBillObj.currency = v;
        }
      });
    }
    /**
     * 显示子运单的信息
     */
    function showSubBillDetail(data) {
      var baseData = data.pAirWaybillInfo;
      vm.subBillObj.awId = baseData.awId;
      vm.timesFHL = baseData.smgTimes;
      vm.subBillObj.parentNo = baseData.parentNo;
      if (baseData.parentNo) {
        getMasterBillData(baseData.parentNo);
      }
      vm.subBillObj.type = baseData.type;
      vm.subBillObj.waybillNo = baseData.waybillNo;
      if (baseData.dept) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dept = airportData;
            }
          });
      } else {
        vm.subBillObj.dept = baseData.dept;
      }
      if (baseData.dest1) {
        restAPI.airData.getDataByCode.save({}, baseData.dest1)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dest1 = airportData;
            }
          });
      } else {
        vm.subBillObj.dest1 = baseData.dest1;
      }
      vm.subBillObj.spName = baseData.spName;
      vm.subBillObj.spAddress = baseData.spAddress;
      vm.subBillObj.spCity = baseData.spCity;
      vm.subBillObj.spState = baseData.spState;
      vm.subBillObj.spZipcode = baseData.spZipcode;
      vm.subBillObj.spTel = baseData.spTel;
      vm.subBillObj.spFax = baseData.spFax;
      if (baseData.spCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryCode === baseData.spCountry) {
            vm.subBillObj.spCountry = element;
            break;
          }
        }
      } else {
        vm.subBillObj.spCountry = baseData.spCountry;
      }
      if (baseData.csCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryCode === baseData.csCountry) {
            vm.subBillObj.csCountry = element;
            break;
          }
        }
      } else {
        vm.subBillObj.csCountry = baseData.csCountry;
      }
      vm.subBillObj.csName = baseData.csName;
      vm.subBillObj.csAddress = baseData.csAddress;
      vm.subBillObj.csCity = baseData.csCity;
      vm.subBillObj.csState = baseData.csState;
      vm.subBillObj.csZipcode = baseData.csZipcode;
      vm.subBillObj.csTel = baseData.csTel;
      vm.subBillObj.csFax = baseData.csFax;
      vm.subBillObj.goodsDesc = baseData.goodsDesc;
      vm.subBillObj.remark = baseData.remark;
      vm.subBillObj.rcpNo = baseData.rcpNo;
      vm.subBillObj.grossWeight = baseData.grossWeight;
      angular.forEach(vm.weightCodeData, function (v, k) {
        if (baseData.weightCode) {
          if (baseData.weightCode === v.id) {
            vm.subBillObj.weightCode = v;
          }
        } else {
          if (v.id === 'K') {
            vm.subBillObj.weightCode = v;
          }
        }
      });
      vm.subBillObj.slac = baseData.slac;
      if (baseData.carriageValue) {
        vm.subBillObj.carriageValue = baseData.carriageValue;
      } else {
        vm.subBillObj.carriageValue = 'NVD';
      }
      if (baseData.insuranceValue) {
        vm.subBillObj.insuranceValue = baseData.insuranceValue;
      } else {
        vm.subBillObj.insuranceValue = 'XXX';
      }
      if (baseData.customsValue) {
        vm.subBillObj.customsValue = baseData.customsValue;
      } else {
        vm.subBillObj.customsValue = 'NCV';
      }
      angular.forEach(vm.wtValData, function (v, k) {
        if (baseData.wtVal) {
          if (baseData.wtVal === v.id) {
            vm.subBillObj.wtVal = v;
          }
        } else {
          if (v.id === 'P') {
            vm.subBillObj.wtVal = v;
          }
        }
        if (baseData.other) {
          if (baseData.other === v.id) {
            vm.subBillObj.other = v;
          }
        } else {
          if (v.id === 'P') {
            vm.subBillObj.other = v;
          }
        }
      });
      angular.forEach(vm.currencyData, function (v, k) {
        if (baseData.currency) {
          if (baseData.currency === v.currencyCode) {
            vm.subBillObj.currency = v;
          }
        } else {
          if (v.currencyCode === 'CNY') {
            vm.subBillObj.currency = v;
          }
        }
      });
      vm.subBillObj.holdCode = baseData.holdCode;
      vm.subBillObj.holdCodeList = [];
      if (vm.subBillObj.holdCode) {
        var holdCodes = vm.subBillObj.holdCode.split(",");
        for (var index = 0; index < holdCodes.length; index++) {
          var code = holdCodes[index];
          vm.subBillObj.holdCodeList.push({
            code: code
          });
        }
      }
      vm.subBillObj.commodityCodes = baseData.commodityCodes;
    }
    /**
     * 根据awid获取主单的数据
     * 
     * @param {any} id
     */
    function getMasterBillData(id) {
      $rootScope.loading = true;
      restAPI.subBill.getMasterBill.save({}, id)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            showMasterBillData(resp.data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 显示主单数据
     * 
     * @param {any} params
     */
    function showMasterBillData(params) {
      vm.billObj.waybillNo = params.pAirWaybillInfo.waybillNo;
      vm.billObj.dept = params.pAirWaybillInfo.dept;
      vm.billObj.dest1 = $filter('showDest1')(params.pAirWaybillInfo.dest1, params.pAirWaybillInfo);
      vm.billObj.rcpNo = params.pAirWaybillInfo.rcpNo;
      vm.billObj.grossWeight = params.pAirWaybillInfo.grossWeight;
      vm.billObj.subWaybillcount = params.subWaybillcount;
    }
    /**
     * 关联主单号
     */
    function connect() {
      var connectDialog = $modal.open({
        template: require('./connect.html'),
        controller: require('./connect.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '关联主单号',
              obj: {}
            };
          }
        }
      });
      connectDialog.result.then(function (data) {
        saveParent(data.awId);
      }, function (resp) {

      });
    }
    /**
     * 历史记录
     */
    function history(sub) {
      var msgDialog = $modal.open({
        template: require('./showHistroy.html'),
        controller: require('./showHistroy.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '历史记录',
              awId: vm.subBillObj.awId,
              params: sub
            };
          }
        }
      });
      msgDialog.result.then(function () {

      }, function () {

      });
    }
    /**
     * 保存主分关联
     */
    function saveParent(id) {
      $rootScope.loading = true;
      restAPI.preJudice.disConnect.save({}, {
          awId: vm.subBillObj.awId,
          parentNo: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.subBillObj.parentNo = id;
            getMasterBillData(id);
            Notification.success({
              message: '关联主运单成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 保存
     */
    function save(callback) {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getSubBillData();
      if (obj.pAirWaybillInfo.awId) {
        updateBill(obj, callback);
      } else {
        saveBill(obj, callback);
      }
    }
    /**
     * 保存运单
     * 
     * @param {any} param
     */
    function saveBill(param, callback) {
      $rootScope.loading = true;
      restAPI.bill.saveBill.save({}, param)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.subBillObj.awId = resp.data.pAirWaybillInfo.awId;
            Notification.success({
              message: '保存运单成功'
            });
            callback && callback();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 编辑运单
     * 
     * @param {any} param
     */
    function updateBill(param, callback) {
      $rootScope.loading = true;
      restAPI.bill.updateBill.save({}, param)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            callback && callback();
            Notification.success({
              message: '保存运单成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 校验子单
     * 
     */
    function validSubBill() {
      if (vm.subErrorData.length) {
        return false;
      }
      return true;
    }
    /**
     * 获取子单数据
     */
    function getSubBillData() {
      var obj = angular.copy(vm.subBillObj);
      if (obj.dept) {
        obj.dept = obj.dept.airportCode;
      }
      if (obj.dest1) {
        obj.dest1 = obj.dest1.airportCode;
      }
      if (obj.spCountry) {
        obj.spCountry = obj.spCountry.countryCode;
      }
      if (obj.csCountry) {
        obj.csCountry = obj.csCountry.countryCode;
      }
      if (obj.weightCode) {
        obj.weightCode = obj.weightCode.id;
      }
      if (obj.wtVal) {
        obj.wtVal = obj.wtVal.id;
      }
      if (obj.other) {
        obj.other = obj.other.id;
      }
      if (obj.currency) {
        obj.currency = obj.currency.currencyCode;
      }
      obj.agentOprnId = Auth.getUnitId() + '';
      obj.agentSalesId = Auth.getMyUnitId() + '';
      obj.agentOprn = Auth.getUnitCode();
      obj.agentSales = Auth.getMyUnitCode();
      delete obj.holdCodeList;
      return {
        pAirWaybillInfo: obj,
        pWaybillGoodsSizes: [],
        pWaybillRateDetails: [],
        pWaybillSpecialReferences: []
      };
    }

    function remove() {
      var id = vm.subBillObj.awId,
        name = vm.subBillObj.waybillNo;
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除分单：' + name,
              content: '你将要删除分单' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.bill.delBill.save({}, {
            awId: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              Notification.success({
                message: '删除分单成功'
              });
              $state.go('agentWaybill.house');
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 提取模板
     */
    function pickTemp() {
      var pickTempDialog = $modal.open({
        template: require('./pickTemp.html'),
        controller: require('./pickTemp.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '提取模板界面',
              obj: {
                type: '1'
              }
            };
          }
        }
      });
      pickTempDialog.result.then(function (data) {
        setSubTempData(data);
      }, function (resp) {

      });
    }
    /**
     * 根据提取的模板数据来设置数据--分单
     * 
     * @param {any} params
     */
    function setSubTempData(params) {
      var data = {},
        baseData = {};
      try {
        data = JSON.parse(params.modelJson);
        baseData = data.pAirWaybillInfo;
      } catch (error) {
        Notification.error({
          message: '数据出错啦'
        });
        return false;
      }
      vm.subBillObj.type = baseData.type;
      if (baseData.dept) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dept = airportData;
            }
          });
      } else {
        vm.subBillObj.dept = baseData.dept;
      }
      if (baseData.dest1) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dest1 = airportData;
            }
          });
      } else {
        vm.subBillObj.dest1 = baseData.dest1;
      }
      vm.subBillObj.spName = baseData.spName;
      vm.subBillObj.spAddress = baseData.spAddress;
      vm.subBillObj.spCity = baseData.spCity;
      vm.subBillObj.spState = baseData.spState;
      vm.subBillObj.spZipcode = baseData.spZipcode;
      vm.subBillObj.spTel = baseData.spTel;
      vm.subBillObj.spFax = baseData.spFax;
      if (baseData.spCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryCode === baseData.spCountry) {
            vm.subBillObj.spCountry = element;
            break;
          }
        }
      }
      if (baseData.csCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryCode === baseData.csCountry) {
            vm.subBillObj.csCountry = element;
            break;
          }
        }
      }
      vm.subBillObj.csName = baseData.csName;
      vm.subBillObj.csAddress = baseData.csAddress;
      vm.subBillObj.csCity = baseData.csCity;
      vm.subBillObj.csState = baseData.csState;
      vm.subBillObj.csZipcode = baseData.csZipcode;
      vm.subBillObj.csTel = baseData.csTel;
      vm.subBillObj.csFax = baseData.csFax;
      vm.subBillObj.goodsDesc = baseData.goodsDesc;
      vm.subBillObj.remark = baseData.remark;
      vm.subBillObj.rcpNo = baseData.rcpNo;
      vm.subBillObj.grossWeight = baseData.grossWeight;
      angular.forEach(vm.weightCodeData, function (v, k) {
        if (baseData.weightCode) {
          if (baseData.weightCode === v.id) {
            vm.subBillObj.weightCode = v;
          }
        } else {
          if (v.id === 'K') {
            vm.subBillObj.weightCode = v;
          }
        }
      });
      vm.subBillObj.slac = baseData.slac;
      if (baseData.carriageValue) {
        vm.subBillObj.carriageValue = baseData.carriageValue;
      } else {
        vm.subBillObj.carriageValue = 'NVD';
      }
      if (baseData.insuranceValue) {
        vm.subBillObj.insuranceValue = baseData.insuranceValue;
      } else {
        vm.subBillObj.insuranceValue = 'XXX';
      }
      if (baseData.customsValue) {
        vm.subBillObj.customsValue = baseData.customsValue;
      } else {
        vm.subBillObj.customsValue = 'NCV';
      }
      angular.forEach(vm.wtValData, function (v, k) {
        if (baseData.wtVal) {
          if (baseData.wtVal === v.id) {
            vm.subBillObj.wtVal = v;
          }
        } else {
          if (v.id === 'P') {
            vm.subBillObj.wtVal = v;
          }
        }
        if (baseData.other) {
          if (baseData.other === v.id) {
            vm.subBillObj.other = v;
          }
        } else {
          if (v.id === 'P') {
            vm.subBillObj.other = v;
          }
        }
      });
      angular.forEach(vm.currencyData, function (v, k) {
        if (baseData.currency) {
          if (baseData.currency === v.currencyCode) {
            vm.subBillObj.currency = v;
          }
        } else {
          if (v.currencyCode === 'CNY') {
            vm.subBillObj.currency = v;
          }
        }
      });
      vm.subBillObj.holdCode = baseData.holdCode;
      vm.subBillObj.holdCodeList = [];
      if (vm.subBillObj.holdCode) {
        var holdCodes = vm.subBillObj.holdCode.split(",");
        for (var index = 0; index < holdCodes.length; index++) {
          var code = holdCodes[index];
          vm.subBillObj.holdCodeList.push({
            code: code
          });
        }
      }
      vm.subBillObj.commodityCodes = baseData.commodityCodes;
    }
    /**
     * 保存到模板
     */
    function saveTemp() {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var saveTempDialog = $modal.open({
        template: require('./saveTemp.html'),
        controller: require('./saveTemp.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '保存模板界面'
            };
          }
        }
      });
      saveTempDialog.result.then(function (data) {
        var obj = getSaveTempData(data);
        $rootScope.loading = true;
        restAPI.bill.saveBillTemp.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '保存模板成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 发送FHL
     */
    function sendFHL() {
      $rootScope.loading = true;
      restAPI.message.sendFWB.save({}, vm.subBillObj.awId)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '报文发送成功'
            });
            showMsg(resp.data);
            search();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 显示报文信息
     */
    function showMsg(params) {
      var msgDialog = $modal.open({
        template: require('../../../../pactl/agent/waybill/newBill/showMsg.html'),
        controller: require('../../../../pactl/agent/waybill/newBill/showMsg.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '报文信息',
              content: params
            };
          }
        }
      });
      msgDialog.result.then(function () {

      }, function () {

      });
    }
    /**
     * 保存到模板数据
     * 0 是未点击，1 是点击
     */
    function getSaveTempData(data) {
      var subObj = getSubBillData();
      delete subObj.pAirWaybillInfo.awId;
      delete subObj.pAirWaybillInfo.parentNo;
      delete subObj.pAirWaybillInfo.waybillNo;
      var obj = subObj;
      obj.labelName = data.labelName;
      obj.mRemark = data.mRemark;
      obj.agentCode = Auth.getUnitId() + '';
      return obj;
    }
    /**
     * 保存人名
     * 
     * @param {any} type1 收货人0 发货人1 通知人2
     * @param {any} type2 主单0 分单1
     * 
     */
    function saveUser(type1, type2) {
      var obj = getSaveUserData(type1, type2);
      var addPeoplDialog = $modal.open({
        template: require('../../option/people/addPeople.html'),
        controller: require('../../option/people/addPeople.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: obj.title,
              countryData: vm.countryData,
              obj: obj.data
            };
          }
        }
      });
      addPeoplDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.people.savePeople.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: obj.title + '成功'
              });
            } else {
              Notification.error({
                message: obj.title + '失败'
              });
            }
          });
      }, function (resp) {

      });
    }

    /**
     *点击选择，弹出品名列表供用户点击选择
     */
    function selectName(param) {
      var selectNameDialog = $modal.open({
        template: require('./selectNameDialog.html'),
        controller: require('./selectNameDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              obj: {}
            };
          }
        }
      });
      selectNameDialog.result.then(function (data) {
        $rootScope.loading = false;
        if (param === "main") {
          vm.billObj.goodsDesc = data.goodsName;
        } else {
          vm.subBillObj.goodsDesc = data.goodsName;
        }
      }, function () {

      });
    }
    /**
     * 保存需要的信息
     * 
     * @param {any} type1 收货人0 发货人1 通知人2
     * @param {any} type2 主单0 分单1
     * @returns
     */
    function getSaveUserData(type1, type2) {
      var obj = {
        data: {},
        title: ''
      };
      if (type1 === '1' && type2 === '1') {
        obj.data.name = vm.subBillObj.spName;
        obj.data.address = vm.subBillObj.spAddress;
        obj.data.zipcode = vm.subBillObj.spZipcode;
        obj.data.city = vm.subBillObj.spCity;
        obj.data.state = vm.subBillObj.spState;
        obj.data.country = vm.subBillObj.spCountry && vm.subBillObj.spCountry.countryCode;
        obj.data.tel = vm.subBillObj.spTel;
        obj.data.fax = vm.subBillObj.spFax;
        obj.data.awType = type2;
        obj.data.scType = type1;
        obj.title = '添加发货人信息';
      }
      if (type1 === '0' && type2 === '1') {
        obj.data.name = vm.subBillObj.csName;
        obj.data.address = vm.subBillObj.csAddress;
        obj.data.zipcode = vm.subBillObj.csZipcode;
        obj.data.city = vm.subBillObj.csCity;
        obj.data.state = vm.subBillObj.csState;
        obj.data.country = vm.subBillObj.csCountry && vm.subBillObj.csCountry.countryCode;
        obj.data.tel = vm.subBillObj.csTel;
        obj.data.fax = vm.subBillObj.csFax;
        obj.data.awType = type2;
        obj.data.scType = type1;
        obj.title = '添加收货人信息';
      }
      return obj;
    }
    /**
     * 人名搜索
     * 
     * @param {any} type1 类型
     * @param {any} type2 主分单
     */
    function searchUser(type1, type2) {
      var searchUserDialog = $modal.open({
        template: require('../../waybill/newBill/searchName.html'),
        controller: require('../../waybill/newBill/searchName.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '客户数据搜索调用界面',
              type1: type1,
              type2: type2
            };
          }
        }
      });
      searchUserDialog.result.then(function (data) {
        setUser(data, type1, type2);
      }, function (resp) {

      });
    }
    /**
     * 
     * 显示人信息
     * 
     * @param {any} data 人的数据
     * @param {any} type1 收货人0 发货人1 通知人2
     * @param {any} type2 主单0 分单1
     */
    function setUser(data, type1, type2) {
      if (type1 === '0' && type2 === '1') {
        vm.subBillObj.csName = data.name;
        vm.subBillObj.csAddress = data.address;
        vm.subBillObj.csZipcode = data.zipcode;
        vm.subBillObj.csCity = data.city;
        vm.subBillObj.csState = data.state;
        if (data.country) {
          for (var index = 0; index < vm.countryData.length; index++) {
            var element = vm.countryData[index];
            if (element.countryCode === data.country) {
              vm.subBillObj.csCountry = element;
              break;
            }
          }
        }
        vm.subBillObj.csTel = data.tel;
        vm.subBillObj.csFax = data.fax;
        vm.subBillObj.csContractor = data.contacts;
      }
      if (type1 === '1' && type2 === '1') {
        vm.subBillObj.spName = data.name;
        vm.subBillObj.spAddress = data.address;
        vm.subBillObj.spZipcode = data.zipcode;
        vm.subBillObj.spCity = data.city;
        vm.subBillObj.spState = data.state;
        vm.subBillObj.spCountry = data.country;
        if (data.country) {
          for (var index = 0; index < vm.countryData.length; index++) {
            var element = vm.countryData[index];
            if (element.countryCode === data.country) {
              vm.subBillObj.spCountry = element;
              break;
            }
          }
        }
        vm.subBillObj.spTel = data.tel;
        vm.subBillObj.spFax = data.fax;
        vm.subBillObj.spContractor = data.contacts;
      }
    }

    function getCursorPos(inpObj) {
      if (typeof inpObj.selectionStart !== 'number') {
        var range = document.selection.createRange();
        if (range === null) {
          return 0;
        }
        var re = inpObj.createTextRange();
        var rc = re.duplicate();
        re.moveToBookmark(range.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
      } else {
        return inpObj.selectionStart;
      }
    }

    function setCursorPos(inpObj, pos) {
      if (!inpObj.setSelectionRange) {
        var textRange = inpObj.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd('character', pos);
        textRange.moveStart('character', pos);
        textRange.select();
      } else {
        inpObj.setSelectionRange(pos, pos);
      }
    }

    function doText(ele, pos) {
      $timeout(function () {
        setCursorPos(ele, pos)
        ele.focus();
        length = undefined;
        pos = undefined;
      }, 0);
    }

    var errClass = 'error',
      reg1 = /[^0-9]/g,
      reg1_ = /[0-9]/g,
      reg2 = /([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,
      reg2_ = /[^\u4E00-\u9FA5\uFE30-\uFFA0]/g,
      reg3 = /[^a-zA-Z0-9]/g,
      reg3_ = /[a-zA-Z0-9]/g,
      reg4 = /[^0-9\-]/g,
      reg4_ = /[0-9\-]/g,
      reg11 = /[^0-9\.]/g,
      reg5 = /[^a-zA-Z0-9\.]/g,
      reg5_ = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NVD$)/g,
      reg6_ = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NCV$)/g,
      reg9_ = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^XXX$)/g,
      reg10 = /[^a-zA-Z\/\s,]/g,
      reg10_ = /[a-zA-Z\/\s,]/g,
      reg11_ = /^[0-9]{1,5}(([.]{1}[0-9]{1})?|[0-9]{1,2})$/g,
      reg18 = /[^0-9\/]/g,
      reg18_ = /^([0-9]{6,18}\/{1}){0,8}[0-9]{6,18}$/g;
    /**
     * 数据校验
     * 
     * @param {any} text
     * @param {any} val1
     * @param {any} val2
     * @param {any} reg
     * @param {any} reg_
     */
    var pos, length;

    function doChange3(text, val1, val2, reg, reg_) {
      var element = angular.element('[name=s_' + text + ']');
      var ele = element[0];
      if (document.activeElement !== ele) return;
      if (!angular.isDefined(val1) && !angular.isDefined(val2)) {
        return;
      }
      if (angular.isDefined(length) && angular.isDefined(pos)) {
        return;
      }
      if (!angular.isNumber(val1)) {
        try {
          val1 = val1.replace(reg, '').toUpperCase();
        } catch (error) {
          val1 = val2;
          $scope.subBillObj[text] = val2;
          return;
        }
      }
      pos = getCursorPos(ele);
      length = $scope.subBillObj[text].length;
      $scope.subBillObj[text] = val1;
      var length1 = $scope.subBillObj[text].length;
      if (length === length1) {
        doText(ele, pos);
      } else {
        doText(ele, pos - (length - length1));
      }
      ele.blur();
      var index1 = $scope.subErrorData.indexOf(text);
      if (reg_.test(val1)) {
        if (index1 > -1) {
          $scope.subErrorData.splice(index1, 1);
          element.removeClass(errClass);
        }
      } else {
        if ($.trim($scope.subBillObj[text]) !== '') {
          if (index1 < 0) {
            $scope.subErrorData.push(text);
            element.addClass(errClass);
          }
        }
      }
      reg_.lastIndex = 0;
    }
    $scope.$watch('subBillObj.waybillNo', function (newVal, oldVal) {
      doChange3('waybillNo', newVal, oldVal, reg3, reg3_);
    });
    $scope.$watch('subBillObj.spName', function (newVal, oldVal) {
      doChange3('spName', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.spAddress', function (newVal, oldVal) {
      doChange3('spAddress', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.spCity', function (newVal, oldVal) {
      doChange3('spCity', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.spState', function (newVal, oldVal) {
      doChange3('spState', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.spZipcode', function (newVal, oldVal) {
      doChange3('spZipcode', newVal, oldVal, reg3, reg3_);
    });
    $scope.$watch('subBillObj.spTel', function (newVal, oldVal) {
      doChange3('spTel', newVal, oldVal, reg4, reg4_);
    });
    $scope.$watch('subBillObj.spFax', function (newVal, oldVal) {
      doChange3('spFax', newVal, oldVal, reg4, reg4_);
    });
    $scope.$watch('subBillObj.csAddress', function (newVal, oldVal) {
      doChange3('csAddress', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.csCity', function (newVal, oldVal) {
      doChange3('csCity', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.csState', function (newVal, oldVal) {
      doChange3('csState', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.csZipcode', function (newVal, oldVal) {
      doChange3('csZipcode', newVal, oldVal, reg3, reg3_);
    });
    $scope.$watch('subBillObj.csTel', function (newVal, oldVal) {
      doChange3('csTel', newVal, oldVal, reg4, reg4_);
    });
    $scope.$watch('subBillObj.csFax', function (newVal, oldVal) {
      doChange3('csFax', newVal, oldVal, reg4, reg4_);
    });
    $scope.$watch('subBillObj.goodsDesc', function (newVal, oldVal) {
      doChange3('goodsDesc', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.remark', function (newVal, oldVal) {
      doChange3('remark', newVal, oldVal, reg2, reg2_);
    });
    $scope.$watch('subBillObj.rcpNo', function (newVal, oldVal) {
      doChange3('rcpNo', newVal, oldVal, reg1, reg1_);
    });
    $scope.$watch('subBillObj.grossWeight', function (newVal, oldVal) {
      doChange3('grossWeight', newVal, oldVal, reg11, reg11_);
    });
    $scope.$watch('subBillObj.slac', function (newVal, oldVal) {
      doChange3('slac', newVal, oldVal, reg1, reg1_);
    });
    $scope.$watch('subBillObj.carriageValue', function (newVal, oldVal) {
      doChange3('carriageValue', newVal, oldVal, reg5, reg5_);
    });
    $scope.$watch('subBillObj.insuranceValue', function (newVal, oldVal) {
      doChange3('insuranceValue', newVal, oldVal, reg5, reg9_);
    });
    $scope.$watch('subBillObj.customsValue', function (newVal, oldVal) {
      doChange3('customsValue', newVal, oldVal, reg5, reg6_);
    });
    $scope.$watch('subBillObj.holdCode', function (newVal, oldVal) {
      doChange3('holdCode', newVal, oldVal, reg10, reg10_);
    });
    $scope.$watch('subBillObj.commodityCodes', function (newVal, oldVal) {
      doChange3('commodityCodes', newVal, oldVal, reg18, reg18_);
    });
  }
];

module.exports = angular.module('app.agentWaybill.newBill', []).controller('newBillCtrl', newBill_fn);