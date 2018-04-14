'use strict';

var ediyWaybillSubTemp_fn = ['$scope', '$state', '$stateParams', '$modal', '$rootScope', 'restAPI', 'Notification',
  function ($scope, $state, $stateParams, $modal, $rootScope, restAPI, Notification) {
    var vm = $scope;
    var id = '';
    vm.airportData = [];
    vm.cancel = cancel;
    vm.countryData = []; //显示国家数据 
    vm.currencyData = [];
    vm.save = save;
    vm.search = search;
    vm.searchUser = searchUser;
    vm.subErrorData = []; // 正则错的数据
    vm.subBillObj = {};
    vm.tempObj = {};
    vm.weightCodeData = [];
    vm.wtValData = [];
    vm.changeNum10 = changeNum10;
    vm.changeNum11 = changeNum11;
    vm.changeNum13 = changeNum13;
    vm.changeText7 = changeText7;
    vm.changeText8 = changeText8;
    vm.changeText9 = changeText9;
    vm.changeText10 = changeText10;
    vm.changeText11 = changeText11;
    vm.changeText12 = changeText12;
    vm.changeText13 = changeText13;
    vm.refreshDest = refreshDest;

    check();

    function check() {
      id = $stateParams.id;
      if (id) {
        getCountry();
      } else {
        cancel();
      }
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
          search();
        });
    }
    /**
     * 获取数据
     */
    function search() {
      $rootScope.loading = true;
      restAPI.bill.billTempById.save({}, {
          id: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setTempData(resp.data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 根据提取的模板数据来设置数据
     */
    function setTempData(item) {
      try {
        var modelJson = JSON.parse(item.modelJson);
        showSubBillDetail(modelJson);
        vm.tempObj.labelName = item.labelName;
        vm.tempObj.mRemark = item.mRemark;
      } catch (error) {
        Notification.error({
          message: '数据出错啦'
        });
      }
    }
    /**
     * 显示子运单的信息
     */
    function showSubBillDetail(data) {
      var baseData = data.pAirWaybillInfo;
      vm.subBillObj.type = baseData.type;
      if (baseData.dept) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dept = airportData;
            }
          });
      }
      if (baseData.dest1) {
        restAPI.airData.getDataByCode.save({}, baseData.dest1)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dest1 = airportData;
            }
          });
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
      vm.subBillObj.commodityCodes = baseData.commodityCodes;
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
    /**
     * 取消
     */
    function cancel() {
      $state.go('agentOption.waybillTemp');
    }
    /**
     * 保存
     */
    function save() {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      $rootScope.loading = true;
      var obj = getSaveTempData();
      obj.id = id;
      obj.labelName = vm.tempObj.labelName;
      obj.mRemark = vm.tempObj.mRemark;
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
     * 获取数据
     */
    function getSaveTempData() {
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
      return {
        pAirWaybillInfo: obj,
        pWaybillGoodsSizes: [],
        pWaybillRateDetails: [],
        pWaybillSpecialReferences: []
      };
    }
    /**
     * 只能输入大写和特殊字符
     */
    function changeText7(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字和字母
     */
    function changeText8(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入NVD 或 数字 .
     * 
     * @param {any} text
     */
    function changeText9(text) {
      vm.subBillObj[text] = vm.subBillObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var reg = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NVD$)/g;
      var index = vm.subErrorData.indexOf(text);
      if (reg.test(vm.subBillObj[text])) {
        if (index > -1) {
          vm.subErrorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.subErrorData.push(text);
        }
      }
    }
    /**
     * 只能输入NCV 或 数字 .
     * 
     * @param {any} text
     */
    function changeText10(text) {
      vm.subBillObj[text] = vm.subBillObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var reg = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NCV$)/g;
      var index = vm.subErrorData.indexOf(text);
      if (reg.test(vm.subBillObj[text])) {
        if (index > -1) {
          vm.subErrorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.subErrorData.push(text);
        }
      }
    }
    /**
     * 只能输入XXX 或 数字 .
     * 
     * @param {any} text
     */
    function changeText11(text) {
      vm.subBillObj[text] = vm.subBillObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var reg = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^XXX$)/g;
      var index = vm.subErrorData.indexOf(text);
      if (reg.test(vm.subBillObj[text])) {
        if (index > -1) {
          vm.subErrorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.subErrorData.push(text);
        }
      }
    }
    /**
     * 只能输入字母空格/
     */
    function changeText12(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/[^a-zA-Z\/\s,]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字/
     */
    function changeText13(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/[^0-9\/]/g, '').toUpperCase();
        var index = vm.subErrorData.indexOf(text);
        if (/^([0-9]{6,18}\/{1}){0,8}[0-9]{6,18}$/g.test(vm.subBillObj[text])) {
          if (index > -1) {
            vm.subErrorData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.subErrorData.push(text);
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字
     * 
     * @param {any} text
     */
    function changeNum10(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/[^0-9]/g, '');
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字和小数点
     * 
     * @param {any} text
     */
    function changeNum11(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/[^0-9.]/g, '');
        var reg = /^[0-9]{1,5}(([.]{1}[0-9]{1})?|[0-9]{1,2})$/g;
        var index = vm.subErrorData.indexOf(text);
        if (reg.test(vm.subBillObj[text])) {
          if (index > -1) {
            vm.subErrorData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.subErrorData.push(text);
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字-
     */
    function changeNum13(text) {
      try {
        vm.subBillObj[text] = vm.subBillObj[text].replace(/[^0-9-]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
  }
];

module.exports = angular.module('app.agentOption.ediyWaybillSubTemp', []).controller('ediyWaybillSubTempCtrl', ediyWaybillSubTemp_fn);