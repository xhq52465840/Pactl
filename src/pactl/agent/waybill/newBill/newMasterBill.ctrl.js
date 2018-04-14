/**
 *　　┏┓　　　┏┓+ +
 *　┏┛┻━━━┛┻┓ + +
 *　┃　　　　　　　┃ 　
 *　┃　　　━　　　┃ ++ + + +
 * ████━████ ┃+
 *　┃　　　　　　　┃ +
 *　┃　　　┻　　　┃
 *　┃　　　　　　　┃ + +
 *　┗━┓　　　┏━┛
 *　　　┃　　　┃　　　　　　　　　　　
 *　　　┃　　　┃ + + + +
 *　　　┃　　　┃
 *　　　┃　　　┃ +  神兽保佑
 *　　　┃　　　┃    代码无bug　　
 *　　　┃　　　┃　　+　　　　　　　　　
 *　　　┃　 　　┗━━━┓ + +
 *　　　┃ 　　　　　　　┣┓
 *　　　┃ 　　　　　　　┏┛
 *　　　┗┓┓┏━┳┓┏┛ + + + +
 *　　　　┃┫┫　┃┫┫
 *　　　　┗┻┛　┗┻┛+ + + +
 */

'use strict';

var newMasterBill_fn = ['$scope', '$stateParams', '$modal', '$rootScope', 'restAPI', 'Notification', '$state', 'Auth', '$timeout', '$interval', '$window',
  function ($scope, $stateParams, $modal, $rootScope, restAPI, Notification, $state, Auth, $timeout, $interval, $window) {
    var vm = $scope;
    var unitCode = Auth.getUnitCode();
    var myUnitCode = Auth.getMyUnitCode();
    var billNo_first = ''; //运单号的前3位
    var oldBillNo = ''; // url里的运单号
    vm.errorData = []; // 正则错的数据
    vm.addOtherFee = addOtherFee;
    vm.audit = audit;
    vm.addSubBill = addSubBill;
    vm.accounInforIdentifData = [];
    vm.airData = [];
    vm.timesFWB = '';
    vm.timesFHL = '';
    vm.alsoNotify = alsoNotify;
    vm.alsoNotifyData = {};
    vm.billObj = {}; //主单数据
    vm.copySub = copySub;
    vm.showLeftSub = showLeftSub;
    vm.showAllSubInfo = false;
    vm.showAllInfo = showAllInfo;
    /*************************/
    vm.flightDate = {
      dateNow: getNowData(10)
    };
    vm.fltDateAble = fltDateAble;
    vm.refreshDest = refreshDest;
    /*************************/
    vm.subBillObj = {}; //分单数据
    vm.showSubBill = false; //是否显示分单
    vm.showText = {
      airPort: '',
      dest: '',
      subGrossWeight: 0,
      subRcpNo: 0,
      subSlac: 0
    };
    vm.currencyData = [];
    vm.chargeCodeData = [];
    vm.chooseBill = chooseBill;
    vm.chooseMaster = chooseMaster;
    vm.countryData = []; //显示国家数据
    vm.blurGrossWeight = blurGrossWeight;
    vm.blurChargeWeight = blurChargeWeight;
    vm.changeParent = changeParent;
    vm.changeNum = changeNum;
    vm.changeNum2 = changeNum2;
    vm.changeNum3 = changeNum3;
    vm.changeNum4 = changeNum4;
    vm.changeNum5 = changeNum5;
    vm.changeNum6 = changeNum6;
    vm.changeNum7 = changeNum7;
    vm.changeNum8 = changeNum8;
    vm.changeNum9 = changeNum9;
    vm.changeNum10 = changeNum10;
    vm.changeNum11 = changeNum11;
    vm.changeNum12 = changeNum12;
    vm.changeNum13 = changeNum13;
    vm.changeText = changeText;
    vm.changeText1 = changeText1;
    vm.changeText2 = changeText2;
    vm.changeText3 = changeText3;
    vm.changeText4 = changeText4;
    vm.changeText5 = changeText5;
    vm.changeText6 = changeText6;
    vm.changeText7 = changeText7;
    vm.changeText8 = changeText8;
    vm.changeText9 = changeText9;
    vm.changeText10 = changeText10;
    vm.changeText11 = changeText11;
    vm.changeText12 = changeText12;
    vm.changeText13 = changeText13;
    vm.changeSubText = changeSubText;
    vm.disConnect = disConnect;
    vm.currentBillNo = ''; // 当前选中的运单号
    vm.currentBillType = ''; // 当前选中的运单类型
    vm.currentMasterData = {}; //当前刚加载的主运单数据
    vm.currentSubData = {}; //当前刚加载的分运单数据
    vm.onSelectDept = onSelectDept;
    vm.onSelectTo = onSelectTo;
    vm.onSelectCarrier1 = onSelectCarrier1;
    vm.onDate1 = onDate1;
    vm.del = del;
    vm.history = history;
    vm.lock = lock;
    vm.otherFeeData = []; //other数据 需要保存的
    vm.otherCodeData = [];
    vm.otherOwnerData = [];
    vm.openDate = openDate;
    vm.pickTemp = pickTemp;
    vm.print = print;
    vm.rateClassData = [];
    vm.removeOtherFee = removeOtherFee;
    vm.save = save;
    vm.saveTemp = saveTemp;
    vm.saveUser = saveUser;
    vm.saveSubBill = saveSubBill;
    vm.searchUser = searchUser;
    vm.send = send;
    vm.sendFHL = sendFHL;
    vm.selectOwner = selectOwner;
    vm.selectShcCode = selectShcCode;
    vm.selectWT = selectWT;
    vm.selectVol = selectVol;
    vm.shcCode = [];
    vm.specialData = []; //需要保存的特货数据
    vm.subBill = [];
    vm.subErrorData = []; // 正则错的数据
    vm.volumeCodeData = [];
    vm.volData = []; //需要保存的尺寸数据
    vm.wtValData = [];
    vm.weightCodeData = [];
    vm.wStatus = true;
    vm.doFocus = doFocus;
    vm.tagTransform = tagTransform;
    vm.tagTransform2str = tagTransform2str;
    // vm.selectGoods = selectGoods;
    vm.selectName = selectName;
    vm.airlineAllowPullDown = false;
    vm.allowDeleteMasterBill = false;

    getPermission();

    function getPermission() {
      $rootScope.loading = true;
      restAPI.permission.getPermission.query({
        tokens: Auth.getUser().token,
        unitid: Auth.getUser().unit,
        resId: '888003'
      }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.allowDeleteMasterBill = false;
          if (resp && resp.length && resp.length > 0) {
            angular.forEach(resp, function (v, k) {
              if (v.resId === '888003') {
                vm.allowDeleteMasterBill = true;
              }
            });
          } 
          check();
        });
    }

    /**
     * 校验id
     */
    function check() {
      oldBillNo = $stateParams.billNo;
      if (oldBillNo) {
        getCountry();
      } else {
        $state.go('index');
      }
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
          getInforIdentif();
        });
    }
    /**
     * 获取Accounting Information Identifier
     */
    function getInforIdentif() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480555528995044'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.accounInforIdentifData = resp.rows;
          getAirData();
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
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
          getChargeCode();
        });
    }
    /**
     * Charge Code
     */
    function getChargeCode() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480303167675367'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.chargeCodeData = resp.rows;
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
          getShcCode();
        });
    }
    /**
     * shc code
     */
    function getShcCode() {
      $rootScope.loading = true;
      restAPI.specialcargo.specialcargoList.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.shcCode = resp.rows;
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
          getRateClass();
        });
    }
    /**
     * Rate Class
     */
    function getRateClass() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1479970971410692'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.rateClassData = resp.rows;
          getVolumeCode();
        });
    }
    /**
     * volumeCode
     */
    function getVolumeCode() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480921089786152'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.volumeCodeData = resp.rows;
          getOtherCode();
        });
    }
    /**
     * OtherCode
     */
    function getOtherCode() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480924471649254'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.otherCodeData = resp.rows;
          getOtherOwner();
        });
    }
    /**
     * OtherOwner
     */
    function getOtherOwner() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480924490087238'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.otherOwnerData = resp.rows;
          getNecessaryData();
        });
    }

    function getNecessaryData() {
      $rootScope.loading = true;
      restAPI.fieldPactl.fieldList.save({}, {
          sid: '101'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.necessaryData = [];
          angular.forEach(resp.rows || [], function (v, k) {
            v.fieldMaintain && vm.necessaryData.push(v.fieldMaintain.field);
          });
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
          searchDataById();
        });
    }


    /**
     * 获取航空公司数据
     */
    function getAirLineParams(airCode) {
      $rootScope.loading = true;
      restAPI.airData.queryParams.save({}, {
          airCode : airCode
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setParam(resp.data || {});
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

     /**
     * 设置参数
     */
    function setParam(param) {
      vm.airlineAllowPullDown = param.pullSubwaybill === "1";
    }
    /**
     * 当前日期
     */
    function getNowData(num) {
      var date = new Date();
      if (num) {
        date.setDate(date.getDate() - num);
      }
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    /**
     * 选择dept
     * 
     */
    function onSelectDept(params) {
      vm.billObj.deptDesc = params.airportName;
    }
    /**
     * 选择TO
     * 
     */
    function onSelectTo(params) {
      if (vm.billObj.dest4) {
        vm.billObj.airportDest = vm.billObj.dest4.airportCode;
        vm.showText.airPort = vm.billObj.dest4.airportName;
        vm.showText.dest = vm.billObj.dest4.airportCode;
        return;
      }
      if (vm.billObj.dest3) {
        vm.billObj.airportDest = vm.billObj.dest3.airportCode;
        vm.showText.airPort = vm.billObj.dest3.airportName;
        vm.showText.dest = vm.billObj.dest3.airportCode;
        return;
      }
      if (vm.billObj.dest2) {
        vm.billObj.airportDest = vm.billObj.dest2.airportCode;
        vm.showText.airPort = vm.billObj.dest2.airportName;
        vm.showText.dest = vm.billObj.dest2.airportCode;
        return;
      }
      if (vm.billObj.dest1) {
        vm.billObj.airportDest = vm.billObj.dest1.airportCode;
        vm.showText.airPort = vm.billObj.dest1.airportName;
        vm.showText.dest = vm.billObj.dest1.airportCode;
        return;
      } else {
        vm.billObj.airportDest = '';
        vm.showText.airPort = '';
        vm.showText.dest = '';
      }
    }

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
     * By First Carrier
     */
    function onSelectCarrier1(params) {
      if (vm.billObj.flightNo) {
        var flightNo = vm.billObj.flightNo.substr(0, 2);
        var text = 'flightNo';
        var index = vm.errorData.indexOf(text);
        if (params && params.airCode === flightNo) {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errorData.push(text);
          }
        }
      }
    }
    /**
     * 航班一的数据
     */
    function onDate1(date, date1) {
      date1.setMinDate(new Date(vm.billObj.fltDate));
      date1.gotoDate(new Date(vm.billObj.fltDate));
      vm.billObj.fltDate2 = '';
    }
    /**
     * 航班二的数据
     */
    function openDate(date1) {
      date1.setMinDate(new Date(vm.billObj.fltDate));
      date1.gotoDate(new Date(vm.billObj.fltDate));
    }
    /**
     * 移除红框
     * 
     * @param {any} text 
     */
    function removeErrClass(text) {
      var index = vm.errorData.indexOf(text);
      if ($.trim(vm.billObj[text]) === '') {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      }
    }
    /**
     * 只能输入数字
     * 
     * @param {any} text
     */
    function changeNum(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9]/g, '');
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字和小数点
     * 
     * @param {any} text
     */
    function changeNum2(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字和小数点
     * 
     * @param {any} param
     */
    function changeNum3(param) {
      try {
        param.fee = param.fee.replace(/[^0-9.]/g, '');
        if(param.fee) {
          param.errorFlag = !/^[0-9]{1,10}(([.]{1}[0-9]{1,3})?|[0-9]{1,2})$/g.test(param.fee);
        } else {
          param.errorFlag = false;
        }
        selectOwner();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字和小数点
     * 
     * @param {any} text
     */
    function changeNum4(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9\.]/g, '');
        var index = vm.errorData.indexOf(text);
        if (vm.billObj[text]) {
          if (/^[0-9]{1,5}(([.]{1}[0-9]{1})?|[0-9]{1,2})$/g.test(vm.billObj[text])) {
            if (index > -1) {
              vm.errorData.splice(index, 1);
            }
          } else {
            if (index < 0) {
              vm.errorData.push(text);
            }
          }
        } else {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * GrossWeight
     */
    function blurGrossWeight() {
      var index = vm.errorData.indexOf('grossWeight');
      if (vm.billObj['chargeWeight']) {
        if (+vm.billObj['grossWeight'] > +vm.billObj['chargeWeight']) {
          Notification.error({
            message: '重量大于计费重量'
          });
          if (index < 0) {
            vm.errorData.push('grossWeight');
          }
        } else {
          index = vm.errorData.indexOf('chargeWeight');
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
          index = vm.errorData.indexOf('grossWeight');
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        }
      }
    }
    /**
     * ChargeWeight
     */
    function blurChargeWeight() {
      var index = vm.errorData.indexOf('chargeWeight');
      if (vm.billObj['grossWeight']) {
        if (+vm.billObj['grossWeight'] > +vm.billObj['chargeWeight']) {
          Notification.error({
            message: '重量大于计费重量'
          });
          if (index < 0) {
            vm.errorData.push('chargeWeight');
          }
        } else {
          index = vm.errorData.indexOf('chargeWeight');
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
          index = vm.errorData.indexOf('grossWeight');
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        }
      }
    }
    /**
     * 只能输入数字和小数点,小数点后面只能是5
     * 
     * @param {any} text
     */
    function changeNum5(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
        var index = vm.errorData.indexOf(text);
        if (vm.billObj[text]) {
          if (/^[0-9]{1,5}(((.5){1})?|[0-9]{1,2})$/g.test(vm.billObj[text])) {
            if (index > -1) {
              vm.errorData.splice(index, 1);
            }
            if (vm.billObj.rateCharge) {
              vm.billObj.totalCount = (+vm.billObj.rateCharge * +vm.billObj.chargeWeight).toFixed(3);
              selectWT();
            }
          } else {
            if (index < 0) {
              vm.errorData.push(text);
            }
          }
        } else {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 数字 8位0.0001–99999999
     * 
     * @param {any} text
     */
    function changeNum6(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
        var index = vm.errorData.indexOf(text);
        if (vm.billObj[text]) {
          if (/^[0-9]{1,8}(([.]{1}[0-9]{1,4})?)$/g.test(vm.billObj[text])) {
            if (index > -1) {
              vm.errorData.splice(index, 1);
            }
            if (text === 'rateCharge') {
              if (vm.billObj.chargeWeight) {
                vm.billObj.totalCount = (+vm.billObj.rateCharge * +vm.billObj.chargeWeight).toFixed(3);
                selectWT();
              }
            }
          } else {
            if (index < 0) {
              vm.errorData.push(text);
            }
          }
        } else {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 数字 12位0.001–999999999999
     * 
     * @param {any} text
     */
    function changeNum7(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
        var index = vm.errorData.indexOf(text);
        if (!vm.billObj[text].length) {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
          return;
        }
        if (/^[0-9]{1,10}(([.]{1}[0-9]{1,3})?|[0-9]{1,2})$/g.test(vm.billObj[text])) {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errorData.push(text);
          }
        }
        if (text === 'totalCount') {
          selectWT();
        } else if (text === 'valuationCharge' || text === 'tax') {
          countPrepaid();
        } else if (text === 'valuationCharge2' || text === 'tax2') {
          countPrepaid();
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 最多7位  0.01-9999999
     * 
     * @param {any} text
     */
    function changeNum8(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
        var index = vm.errorData.indexOf(text);
        if (/^[0-9]{1,5}(([.]{1}[0-9]{1,2})?|[0-9]{1,2})$/g.test(vm.billObj[text])) {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errorData.push(text);
          }
        }
        removeErrClass(text);
      } catch (error) {
        return;
      }
    }
    /**
     * 最多11位  6位小数
     * 
     * @param {any} text
     */
    function changeNum9(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
        var index = vm.errorData.indexOf(text);
        if (/^[0-9]{1,9}(([.]{1}[0-9]{1,6})?|[0-9]{1,2})$/g.test(vm.billObj[text])) {
          if (index > -1) {
            vm.errorData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errorData.push(text);
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
        var index = vm.subErrorData.indexOf(text);
        if (!vm.subBillObj[text].length) {
          if (index > -1) {
            vm.subErrorData.splice(index, 1);
          }
          return;
        }
        if (/^[0-9]{1,5}(([.]{1}[0-9]{1})?|[0-9]{1,2})$/g.test(vm.subBillObj[text])) {
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
    function changeNum12(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9-]/g, '').toUpperCase();
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
    /**
     * 只能输入数字和字母
     */
    function changeText1(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入字母空格/
     */
    function changeText2(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\/\s,]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入NVD 或 数字 .
     * 
     * @param {any} text
     */
    function changeText3(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var index = vm.errorData.indexOf(text);
      if (/(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NVD$)/g.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
      removeErrClass(text);
    }
    /**
     * 只能输入NCV 或 数字 .
     * 
     * @param {any} text
     */
    function changeText4(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var index = vm.errorData.indexOf(text);
      if (/(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NCV$)/g.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
      removeErrClass(text);
    }
    /**
     * 航空公司二字码+  最多5位航班号
     * 5位   （ 可以3位数字，，前4位数字，第5位可以是字母或数字）
     *   新需求，第五位必须是字母
     * 
     * @param {any} text
     */
    function changeText5(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d]/g, '').toUpperCase();
      var index = vm.errorData.indexOf(text);
      if (vm.billObj[text] === '' && text === 'flightNo2') {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
        return;
      }
      if (text === 'flightNo') {
        if (vm.billObj.carrier1 && vm.billObj.carrier1.airCode) {
          if (vm.billObj.carrier1.airCode === vm.billObj[text].substr(0, 2)) {
            if (index > -1) {
              vm.errorData.splice(index, 1);
            }
          } else {
            if (index < 0) {
              vm.errorData.push(text);
            }
            return;
          }
        }
      }
      var index1 = vm.errorData.indexOf(text);
      if (/^[A-Z\d]{2}(\d{3,4}|\d{4}[A-Z]{0,1})$/g.test(vm.billObj[text])) {
        if (index1 > -1) {
          vm.errorData.splice(index1, 1);
        }
      } else {
        if (index1 < 0) {
          vm.errorData.push(text);
        }
      }
    }
    /**
     * 航班二是否可用
     */
    function fltDateAble() {
      if (vm.billObj.flightNo && vm.billObj.fltDate) {
        return false;
      } else {
        vm.billObj.flightNo2 = vm.currentMasterData.flightNo2;
        vm.billObj.fltDate2 = vm.currentMasterData.fltDate2;
        return true;
      }
    }
    /**
     * 只能输入XXX 或 数字 .
     * 
     * @param {any} text
     */
    function changeText6(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var index = vm.errorData.indexOf(text);
      if (/(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^XXX$)/g.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
      removeErrClass(text);
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
      var index = vm.subErrorData.indexOf(text);
      if (!vm.subBillObj[text].length) {
        if (index > -1) {
          vm.subErrorData.splice(index, 1);
        }
        return;
      }
      if (/(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NVD$)/g.test(vm.subBillObj[text])) {
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
      var index = vm.subErrorData.indexOf(text);
      if (!vm.subBillObj[text].length) {
        if (index > -1) {
          vm.subErrorData.splice(index, 1);
        }
        return;
      }
      if (/(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NCV$)/g.test(vm.subBillObj[text])) {
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
      var index = vm.subErrorData.indexOf(text);
      if (!vm.subBillObj[text].length) {
        if (index > -1) {
          vm.subErrorData.splice(index, 1);
        }
        return;
      }
      if (/(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^XXX$)/g.test(vm.subBillObj[text])) {
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
        if (!vm.subBillObj[text].length) {
          if (index > -1) {
            vm.subErrorData.splice(index, 1);
          }
          return;
        }
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
     * 只能输入大写和特殊字符
     */
    function changeText(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').replace(/\t/g, ' ').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * owner 选择 
     */
    function selectOwner() {
      var data1 = 0, //P  A
        data2 = 0, //C A
        data3 = 0, //P C
        data4 = 0; //C C
      angular.forEach(vm.otherFeeData, function (v, k) {
        if (v.owner) {
          var data = v.fee;
          if (v.errorFlag) {
            data = 0;
          } else {
            if (!v.fee) {
              data = 0;
            }
          }
          if (vm.billObj.other && vm.billObj.other.id === 'C') {
            if (v.owner.id === 'A') {
              data2 += (+data);
            } else if (v.owner.id === 'C') {
              data4 += (+data);
            }
          } else if (vm.billObj.other && vm.billObj.other.id === 'P') {
            if (v.owner.id === 'A') {
              data1 += (+data);
            } else if (v.owner.id === 'C') {
              data3 += (+data);
            }
          }
        }
      });
      vm.billObj.totalAgent = data1.toFixed(3) || '';
      vm.billObj.totalAgent2 = data2.toFixed(3) || '';
      vm.billObj.totalCarrier = data3.toFixed(3) || '';
      vm.billObj.totalCarrier2 = data4.toFixed(3) || '';
      countPrepaid();
    }
    /**
     * WT/VAL
     */
    function selectWT() {
      var data1 = '', //P
        data2 = ''; //C
      if (vm.billObj.wtVal && vm.errorData.indexOf('totalCount') < 0 && vm.billObj.totalCount) {
        if (vm.billObj.wtVal.id === 'P') {
          data1 = vm.billObj.totalCount;
        } else if (vm.billObj.wtVal.id === 'C') {
          data2 = vm.billObj.totalCount;
        }
      }
      vm.billObj.prepaid = data1;
      vm.billObj.collect = data2;
      countPrepaid();
    }
    /**
     * 弹出shc code
     */
    function selectShcCode() {
      var holdCode = [];
      if (vm.billObj.holdCode) {
        holdCode = vm.billObj.holdCode.split(',');
      }
      var specialData = [];
      angular.forEach(vm.specialData, function (v, k) {
        var index = holdCode.indexOf(v.shc);
        if (index > -1) {
          specialData.push(v);
          holdCode.splice(index, 1);
        }
        for (var index = 0; index < vm.shcCode.length; index++) {
          var element = vm.shcCode[index];
          if (element.sccCode === v.shc) {
            v.shc = element;
            break;
          }
        }
      });
      var holdCodeDialog = $modal.open({
        template: require('../holdCode/holdCode.html'),
        controller: require('../holdCode/holdCode.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              data: specialData,
              shcCode: vm.shcCode
            };
          }
        }
      });
      holdCodeDialog.result.then(function (data) {
        vm.specialData = [];
        angular.forEach(data, function (v, k) {
          vm.specialData.push({
            awId: vm.billObj.awId || '',
            shc: v.shc && v.shc.sccCode,
            discription: v.discription,
            remarks: v.remarks
          });
          v.shc && holdCode.push(v.shc.sccCode);
        });
        vm.billObj.holdCode = holdCode.join(',');
        if (vm.billObj.holdCode) {
          vm.billObj.holdCodeList = [];
          var holdCodes = vm.billObj.holdCode.split(",");
          for (var index = 0; index < holdCodes.length; index++) {
            var code = holdCodes[index];
            vm.billObj.holdCodeList.push({
              code: code
            });
          }
        }
      }, function (resp) {

      });
    }
    /**
     * 根据运单号查数据
     */
    function searchDataById() {
      $rootScope.loading = true;
      restAPI.bill.billInfo.save({}, {
          waybillNo: oldBillNo,
          type: '0'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
              setAllData(resp.data);
            } else {
              setOriginData();
            }
            if(vm.billObj.carrier1) {
              var airCode = vm.billObj.carrier1.airCode || vm.billObj.carrier1;
              getAirLineParams(airCode);
            }
          } else {
            Notification.error({
              message: resp.msg
            });
            $state.go('index');
          }
        });
    }
    /**
     * 设置初始值
     */
    function setOriginData() {
      vm.billObj.type = '0';
      vm.billObj.waybillNo = $stateParams.billNo;
      vm.billObj.agentOprn = unitCode;
      vm.billObj.agentSales = myUnitCode;
      vm.billObj.agreedFlag = '1';
      vm.billObj.executed = getNowData();
      vm.billObj.signatureIssuing = unitCode;
      for (var index = 0; index < vm.currencyData.length; index++) {
        var element = vm.currencyData[index];
        if (element.currencyCode === 'CNY') {
          vm.billObj.currency = element;
          break;
        }
      }
      billNo_first = vm.billObj.waybillNo.substr(0, 3);
      for (var index = 0; index < vm.airData.length; index++) {
        var element = vm.airData[index];
        if (element.destCode === billNo_first) {
          vm.billObj.carrier1 = element;
          break;
        }
      }
      for (var index = 0; index < vm.accounInforIdentifData.length; index++) {
        var element = vm.accounInforIdentifData[index];
        if (element.id === 'GEN') {
          vm.billObj.accounInforIdentif = element;
          vm.billObj.accounInforIdentif1 = element;
          vm.billObj.accounInforIdentif2 = element;
          vm.billObj.accounInforIdentif3 = element;
          vm.billObj.accounInforIdentif4 = element;
          vm.billObj.accounInforIdentif5 = element;
          break;
        }
      }
      restAPI.airData.getDataByCode.save({}, 'PVG')
        .$promise.then(function (resp) {
          var airportData = resp.data;
          if (airportData) {
            vm.billObj.dept = airportData;
            vm.billObj.deptDesc = airportData.airportName;
          }
        });
      for (var index = 0; index < vm.wtValData.length; index++) {
        var element = vm.wtValData[index];
        if (element.id === 'P') {
          vm.billObj.wtVal = element;
          vm.billObj.other = element;
          break;
        }
      }
      vm.billObj.carriageValue = 'NVD';
      vm.billObj.customsValue = 'NCV';
      vm.billObj.insuranceValue = 'XXX';
      vm.billObj.place = 'PU DONG';
      for (var index = 0; index < vm.weightCodeData.length; index++) {
        var element = vm.weightCodeData[index];
        if (element.id === 'K') {
          vm.billObj.weightCode = element;
          break;
        }
      }
      for (var index = 0; index < vm.rateClassData.length; index++) {
        var element = vm.rateClassData[index];
        if (element.id === 'N') {
          vm.billObj.rateClass = element;
          break;
        }
      }
      for (var index = 0; index < vm.volumeCodeData.length; index++) {
        var element = vm.volumeCodeData[index];
        if (element.id === 'MC') {
          vm.billObj.volumeCode = element;
          break;
        }
      }
      vm.otherFeeData = [{}, {}, {}];
      angular.forEach(vm.otherFeeData, function (v, k) {
        for (var index = 0; index < vm.otherCodeData.length; index++) {
          var element = vm.otherCodeData[index];
          if (element.id === 'AW' && k === 0) {
            v.code = element;
            break;
          }
          if (element.id === 'MY' && k === 1) {
            v.code = element;
            break;
          }
          if (element.id === 'SC' && k === 2) {
            v.code = element;
            break;
          }
        }
        for (var index = 0; index < vm.otherOwnerData.length; index++) {
          var element = vm.otherOwnerData[index];
          if (element.id === 'C') {
            v.owner = element;
            break;
          }
        }
      });
      setIATA();
    }
    /**
     * 新建时初始化 IATA代码
     */
    function setIATA() {
      restAPI.bill.iata.save({}, {})
        .$promise.then(function (resp) {
          if (resp.ok) {
            vm.billObj.agentName = resp.data.agnetName;
            vm.billObj.agentCity = resp.data.city;
            vm.billObj.agentIataCode = resp.data.iata;
          }
        });
    }
    /**
     * 显示根据运单的数据
     */
    function setAllData(data) {
      vm.currentBillNo = data.pAirWaybillInfo.waybillNo;
      vm.timesFWB = (data.pAirWaybillInfo.smgTimes) ? data.pAirWaybillInfo.smgTimes : '';
      vm.currentBillType = data.pAirWaybillInfo.type;
      setBaseData(data.pAirWaybillInfo);
      setSubBill(data.airWayBillInfoVos); //显示子运单
      setOtherFeeData(data.pWaybillRateDetails); //显示other fee
      setShcCode(data.pWaybillSpecialReferences); //显示SHC CODE
      setAlsoNotify(data.pAirWaybillInfo); //显示通知人
      setVol(data.pWaybillGoodsSizes); //显示尺寸
      getBillStatus();
      vm.currentMasterData = angular.copy(vm.billObj);
      addDept({
        dept: data.pAirWaybillInfo.dept,
        dest1: data.pAirWaybillInfo.dest1,
        dest2: data.pAirWaybillInfo.dest2,
        dest3: data.pAirWaybillInfo.dest3,
        dest4: data.pAirWaybillInfo.dest4
      });
      vm.isFocus = data.isFocus === '1' ? true : false;
      vm.isLock = data.pAirWaybillInfo.lockStatus === '1' ? true : false;
    }
    /**
     * 关注
     */
    function doFocus(awId) {
      $rootScope.loading = true;
      restAPI.preJudice.focus.save({}, {
          awId: awId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.isFocus = !vm.isFocus;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 
     * 
     * @param {any} params 
     */
    function addDept(params) {
      if (params.dept) {
        restAPI.airData.getDataByCode.save({}, params.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.currentMasterData.dept = airportData;
            }
          });
      }
      if (params.dest1) {
        restAPI.airData.getDataByCode.save({}, params.dest1)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.currentMasterData.dest1 = airportData;
            }
          });
      }
      if (params.dest2) {
        restAPI.airData.getDataByCode.save({}, params.dest2)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.currentMasterData.dest2 = airportData;
            }
          });
      }
      if (params.dest3) {
        restAPI.airData.getDataByCode.save({}, params.dest3)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.currentMasterData.dest3 = airportData;
            }
          });
      }
      if (params.dest4) {
        restAPI.airData.getDataByCode.save({}, params.dest4)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.currentMasterData.dest4 = airportData;
            }
          });
      }
    }
    /**
     * 获取当前运单状态，如果wStatus为000和102时可以添加分单
     */
    function getBillStatus() {
      if (vm.billObj.awId) {
        restAPI.preJudice.checkRebook.save({}, {
            awId: vm.billObj.awId
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              var wStatus = resp.data && resp.data.wStatus;
              if (wStatus === '000' || wStatus === '102') {
                vm.wStatus = true;
              } else {
                vm.wStatus = false;
              }
            }
          });
      }
    }
    /**
     * 显示主运单基本信息
     * 
     */
    function setBaseData(baseData) {
      vm.billObj.type = baseData.type;
      vm.billObj.waybillNo = baseData.waybillNo;
      vm.billObj.awId = baseData.awId;
      vm.billObj.agentOprn = baseData.agentOprn;
      vm.billObj.agentSales = baseData.agentSales;
      vm.billObj.agentOprn = baseData.agentOprn;
      vm.billObj.agentOprnId = baseData.agentOprnId;
      vm.billObj.agentSales = baseData.agentSales;
      vm.billObj.agentSalesId = baseData.agentSalesId;
      vm.billObj.spAccountNumber = baseData.spAccountNumber;
      vm.billObj.spName = baseData.spName;
      vm.billObj.spAddress = baseData.spAddress;
      vm.billObj.spZipcode = baseData.spZipcode;
      vm.billObj.spCity = baseData.spCity;
      vm.billObj.spState = baseData.spState;
      if (baseData.spCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (baseData.spCountry === element.countryCode) {
            vm.billObj.spCountry = element;
            break;
          }
        }
      }
      vm.billObj.spTel = baseData.spTel;
      vm.billObj.spFax = baseData.spFax;
      vm.billObj.spContractor = baseData.spContractor;
      vm.billObj.csAccountNumber = baseData.csAccountNumber;
      vm.billObj.csName = baseData.csName;
      vm.billObj.csAddress = baseData.csAddress;
      vm.billObj.csZipcode = baseData.csZipcode;
      vm.billObj.csCity = baseData.csCity;
      vm.billObj.csState = baseData.csState;
      if (baseData.csCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (baseData.csCountry === element.countryCode) {
            vm.billObj.csCountry = element;
            break;
          }
        }
      }
      vm.billObj.csTel = baseData.csTel;
      vm.billObj.csFax = baseData.csFax;
      vm.billObj.csContractor = baseData.csContractor;
      vm.billObj.issuedBy = baseData.issuedBy;
      vm.billObj.agentName = baseData.agentName;
      vm.billObj.agentPartIdentifier = baseData.agentPartIdentifier;
      vm.billObj.agentCity = baseData.agentCity;
      vm.billObj.agentIataCode = baseData.agentIataCode;
      vm.billObj.agentCassAddress = baseData.agentCassAddress
      vm.billObj.accountNo = baseData.accountNo;
      vm.billObj.deptDesc = baseData.deptDesc;
      angular.forEach(vm.accounInforIdentifData, function (v, k) {
        if (baseData.accounInforIdentif === v.id) {
          vm.billObj.accounInforIdentif = v;
        }
        if (baseData.accounInforIdentif1 === v.id) {
          vm.billObj.accounInforIdentif1 = v;
        }
        if (baseData.accounInforIdentif2 === v.id) {
          vm.billObj.accounInforIdentif2 = v;
        }
        if (baseData.accounInforIdentif3 === v.id) {
          vm.billObj.accounInforIdentif3 = v;
        }
        if (baseData.accounInforIdentif4 === v.id) {
          vm.billObj.accounInforIdentif4 = v;
        }
        if (baseData.accounInforIdentif5 === v.id) {
          vm.billObj.accounInforIdentif5 = v;
        }
      });
      vm.billObj.freightPrepaid = baseData.freightPrepaid;
      vm.billObj.freightPrepaid1 = baseData.freightPrepaid1;
      vm.billObj.freightPrepaid2 = baseData.freightPrepaid2;
      vm.billObj.freightPrepaid3 = baseData.freightPrepaid3;
      vm.billObj.freightPrepaid4 = baseData.freightPrepaid4;
      vm.billObj.freightPrepaid5 = baseData.freightPrepaid5;
      if (baseData.dept) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dept = airportData;
            }
          });
      }
      if (baseData.dest1) {
        restAPI.airData.getDataByCode.save({}, baseData.dest1)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest1 = airportData;
            }
          });
      }
      if (baseData.dest2) {
        restAPI.airData.getDataByCode.save({}, baseData.dest2)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest2 = airportData;
            }
          });
      }
      if (baseData.dest3) {
        restAPI.airData.getDataByCode.save({}, baseData.dest3)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest3 = airportData;
            }
          });
      }
      if (baseData.dest4) {
        restAPI.airData.getDataByCode.save({}, baseData.dest4)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest4 = airportData;
            }
          });
      }
      angular.forEach(vm.airData, function (v, k) {
        if (baseData.carrier1 === v.airCode) {
          vm.billObj.carrier1 = v;
        }
        if (baseData.carrier2 === v.airCode) {
          vm.billObj.carrier2 = v;
        }
        if (baseData.carrier3 === v.airCode) {
          vm.billObj.carrier3 = v;
        }
        if (baseData.carrier4 === v.airCode) {
          vm.billObj.carrier4 = v;
        }
      });
      angular.forEach(vm.currencyData, function (v, k) {
        if (baseData.currency === v.currencyCode) {
          vm.billObj.currency = v;
        }
        if (baseData.destCurrency === v.currencyCode) {
          vm.billObj.destCurrency = v;
        }
      });
      if (baseData.chargeCode) {
        for (var index = 0; index < vm.chargeCodeData.length; index++) {
          var element = vm.chargeCodeData[index];
          if (baseData.chargeCode === element.id) {
            vm.billObj.chargeCode = element;
            break;
          }
        }
      }
      angular.forEach(vm.wtValData, function (v, k) {
        if (baseData.wtVal === v.id) {
          vm.billObj.wtVal = v;
        }
        if (baseData.other === v.id) {
          vm.billObj.other = v;
        }
      });
      vm.billObj.carriageValue = baseData.carriageValue;
      vm.billObj.customsValue = baseData.customsValue;
      vm.billObj.airportDest = baseData.airportDest;
      if (baseData.airportDest) {
        restAPI.airData.getDataByCode.save({}, baseData.airportDest)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.showText.airPort = airportData.airportName;
              vm.showText.dest = airportData.airportCode;
            }
          });
      }
      vm.billObj.flightNo = baseData.flightNo;
      vm.billObj.fltDate = baseData.fltDate;
      vm.billObj.flightNo2 = baseData.flightNo2;
      vm.billObj.fltDate2 = baseData.fltDate2;
      vm.billObj.insuranceValue = baseData.insuranceValue;
      vm.billObj.ssr = baseData.ssr;
      vm.billObj.osi1 = baseData.osi1;
      vm.billObj.holdCode = baseData.holdCode;
      vm.billObj.alsoNotify = baseData.alsoNotify;
      vm.billObj.rcpNo = baseData.rcpNo;
      vm.billObj.grossWeight = baseData.grossWeight;
      if (baseData.weightCode) {
        for (var index = 0; index < vm.weightCodeData.length; index++) {
          var element = vm.weightCodeData[index];
          if (baseData.weightCode === element.id) {
            vm.billObj.weightCode = element;
            break;
          }
        }
      }
      if (baseData.rateClass) {
        for (var index = 0; index < vm.rateClassData.length; index++) {
          var element = vm.rateClassData[index];
          if (baseData.rateClass === element.id) {
            vm.billObj.rateClass = element;
            break;
          }
        }
      }
      vm.billObj.commodityNo = baseData.commodityNo;
      vm.billObj.chargeWeight = baseData.chargeWeight;
      vm.billObj.rateCharge = baseData.rateCharge;
      vm.billObj.totalCount = baseData.totalCount;
      vm.billObj.slac = baseData.slac;
      vm.billObj.remark = baseData.remark;
      vm.billObj.goodsDesc = baseData.goodsDesc;
      vm.billObj.vol = baseData.vol;
      if (baseData.volumeCode) {
        for (var index = 0; index < vm.volumeCodeData.length; index++) {
          var element = vm.volumeCodeData[index];
          if (baseData.volumeCode === element.id) {
            vm.billObj.volumeCode = element;
            break;
          }
        }
      }
      vm.billObj.densityGroup = baseData.densityGroup;
      vm.billObj.prepaid = baseData.prepaid;
      vm.billObj.collect = baseData.collect;
      vm.billObj.valuationCharge = baseData.valuationCharge;
      vm.billObj.valuationCharge2 = baseData.valuationCharge2;
      vm.billObj.tax = baseData.tax;
      vm.billObj.tax2 = baseData.tax2;
      vm.billObj.totalAgent = baseData.totalAgent;
      vm.billObj.totalAgent2 = baseData.totalAgent2;
      vm.billObj.totalCarrier = baseData.totalCarrier;
      vm.billObj.totalCarrier2 = baseData.totalCarrier2;
      vm.billObj.totalPrepaid = baseData.totalPrepaid;
      vm.billObj.totalCollect = baseData.totalCollect;
      vm.billObj.rates = baseData.rates;
      vm.billObj.ccChargesDes = baseData.ccChargesDes;
      vm.billObj.chargesDestination = baseData.chargesDestination;
      if (baseData.agreedFlag === true || baseData.agreedFlag === '1') {
        vm.billObj.agreedFlag = '1';
      } else {
        vm.billObj.agreedFlag = '0';
      }
      vm.billObj.signatureAgent = baseData.signatureAgent;
      vm.billObj.executed = baseData.executed;
      vm.billObj.place = baseData.place;
      vm.billObj.signatureIssuing = baseData.signatureIssuing;
      vm.billObj.totalCollectCharges = baseData.totalCollectCharges;
      vm.billObj.holdCodeList = [];
      if (vm.billObj.holdCode) {
        var holdCodes = vm.billObj.holdCode.split(",");
        for (var index = 0; index < holdCodes.length; index++) {
          var code = holdCodes[index];
          vm.billObj.holdCodeList.push({
            code: code
          });
        }
      }
    }
    /**
     * 显示已存在的数据
     */
    function setOtherFeeData(params) {
      vm.otherFeeData = [];
      angular.forEach(params, function (v, k) {
        var code = {},
          owner = {};
        for (var index = 0; index < vm.otherCodeData.length; index++) {
          var element = vm.otherCodeData[index];
          if (element.id === v.code) {
            code = element;
          }
        }
        for (var index = 0; index < vm.otherOwnerData.length; index++) {
          var element = vm.otherOwnerData[index];
          if (element.id === v.owner) {
            owner = element;
          }
        }
        vm.otherFeeData.push({
          code: code,
          fee: v.fee,
          owner: owner
        })
      });
    }
    /**
     * 显示SHC CODE 
     * 
     */
    function setShcCode(params) {
      vm.specialData = [];
      angular.forEach(params, function (v, k) {
        vm.specialData.push({
          discription: v.discription,
          remarks: v.remarks,
          shc: v.shc
        });
      });
    }
    /**
     * 显示通知人
     * 
     */
    function setAlsoNotify(params) {
      vm.alsoNotifyData.notifyAddress = params.notifyAddress;
      vm.alsoNotifyData.notifyCity = params.notifyCity;
      vm.alsoNotifyData.notifyContractor = params.notifyContractor;
      vm.alsoNotifyData.notifyCountry = params.notifyCountry;
      vm.alsoNotifyData.notifyFax = params.notifyFax;
      vm.alsoNotifyData.notifyName = params.notifyName;
      vm.alsoNotifyData.notifyState = params.notifyState;
      vm.alsoNotifyData.notifyTel = params.notifyTel;
      vm.alsoNotifyData.notifyZipcode = params.notifyZipcode;
    }
    /**
     * 显示尺寸
     * 
     */
    function setVol(params) {
      vm.volData = [];
      angular.forEach(params, function (v, k) {
        vm.volData.push({
          length: v.length,
          width: v.width,
          height: v.height,
          pieces: v.pieces,
          weightCode: v.weightCode,
          weight: v.weight,
          unitcode: v.unitcode
        });
      });
    }
    /**
     * 显示子运单
     * 
     * @param {any} params
     */
    function setSubBill(params) {
      vm.subBill = params;
    }
    /**
     * 校验主单
     * 
     */
    function valid() {
      if (vm.errorData.length) {
        return false;
      }
      for (var index = 0; index < vm.otherFeeData.length; index++) {
        var element = vm.otherFeeData[index];
        if (element.errorFlag) {
          return false;
        }
      }
      return true;
    }
    /**
     * 航段没填写完整
     */
    function showFltError() {
      Notification.error({
        message: '有航段信息缺失，请补充完整'
      });
    }
    /**
     * 对航段的校验
     */
    function validFlt() {
      if (vm.billObj.dest4 || vm.billObj.carrier4) {
        if (!vm.billObj.dest4 || !vm.billObj.carrier4 || !vm.billObj.dest3 || !vm.billObj.carrier3 ||
          !vm.billObj.dest2 || !vm.billObj.carrier2 || !vm.billObj.dest1 || !vm.billObj.carrier1) {
          showFltError();
          return false;
        }
      }
      if (vm.billObj.dest3 || vm.billObj.carrier3) {
        if (!vm.billObj.dest3 || !vm.billObj.carrier3 || !vm.billObj.dest2 || !vm.billObj.carrier2 || !vm.billObj.dest1 || !vm.billObj.carrier1) {
          showFltError();
          return false;
        }
      }
      if (vm.billObj.dest2 || vm.billObj.carrier2) {
        if (!vm.billObj.dest2 || !vm.billObj.carrier2 || !vm.billObj.dest1 || !vm.billObj.carrier1) {
          showFltError();
          return false;
        }
      }
      if (vm.billObj.dest1 || vm.billObj.carrier1) {
        if (!vm.billObj.carrier1 || !vm.billObj.dest1) {
          showFltError();
          return false;
        }
      }
      return true;
    }
    /**
     * 校验 件数
     * 1.先获取所有的分单的rcpno
     */
    function validRcpNo() {
      var subRcpNo = 0;
      var masterRcpNo = +(vm.billObj.rcpNo || 0);
      angular.forEach(vm.subBill, function (v, k) {
        subRcpNo += +(v.pAirWaybillInfo.rcpNo || 0);
      });
      if (vm.subBill.length === 0) {
        subRcpNo = masterRcpNo;
      }
      if (masterRcpNo === subRcpNo) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 校验 重量
     */
    function validGrossWeight() {
      var subGrossWeight = 0;
      var masterGrossWeight = +(vm.billObj.grossWeight || 0);
      angular.forEach(vm.subBill, function (v, k) {
        subGrossWeight += +(v.pAirWaybillInfo.grossWeight || 0);
      });
      if (vm.subBill.length === 0) {
        subGrossWeight = masterGrossWeight;
      }
      if (masterGrossWeight === subGrossWeight) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 保存
     */
    function save() {
      if (vm.currentBillType === '1') {
        saveSubBill();
      } else {
        sMaster();
      }
    }
    /**
     * 保存按钮时保存主单
     */
    function sMaster() {
      if (!valid()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      if (!validFlt()) {
        showFltError();
        return false;
      }
      var obj = getData();
      if (obj.pAirWaybillInfo.awId) {
        var callback = function () {
          vm.currentMasterData = angular.copy(vm.billObj);
        };
        updateBill(obj, callback);
      } else {
        saveBill(obj);
      }
    }
    /**
     * 保存运单
     * 
     * @param {any} obj
     */
    function saveBill(param) {
      $rootScope.loading = true;
      restAPI.bill.saveBill.save({}, param)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.billObj.awId = resp.data.pAirWaybillInfo.awId;
            Notification.success({
              message: '保存运单成功'
            });
            searchDataById();
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
     * @param {any} obj
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
     * 保存数据
     */
    function getData() {
      var billObj = angular.copy(vm.billObj),
        obj = {};
      if (billObj.csCountry) {
        billObj.csCountry = billObj.csCountry.countryCode;
      } else {
        billObj.csCountry = '';
      }
      if (billObj.spCountry) {
        billObj.spCountry = billObj.spCountry.countryCode;
      } else {
        billObj.spCountry = '';
      }
      if (billObj.dept) {
        billObj.dept = billObj.dept.airportCode;
      } else {
        billObj.dept = '';
      }
      if (billObj.accounInforIdentif) {
        billObj.accounInforIdentif = billObj.accounInforIdentif.id;
      } else {
        billObj.accounInforIdentif = '';
      }
      if (billObj.accounInforIdentif1) {
        billObj.accounInforIdentif1 = billObj.accounInforIdentif1.id;
      } else {
        billObj.accounInforIdentif1 = '';
      }
      if (billObj.accounInforIdentif2) {
        billObj.accounInforIdentif2 = billObj.accounInforIdentif2.id;
      } else {
        billObj.accounInforIdentif2 = '';
      }
      if (billObj.accounInforIdentif3) {
        billObj.accounInforIdentif3 = billObj.accounInforIdentif3.id;
      } else {
        billObj.accounInforIdentif3 = '';
      }
      if (billObj.accounInforIdentif4) {
        billObj.accounInforIdentif4 = billObj.accounInforIdentif4.id;
      } else {
        billObj.accounInforIdentif4 = '';
      }
      if (billObj.accounInforIdentif5) {
        billObj.accounInforIdentif5 = billObj.accounInforIdentif5.id;
      } else {
        billObj.accounInforIdentif5 = '';
      }
      if (billObj.dest1) {
        billObj.dest1 = billObj.dest1.airportCode;
      } else {
        billObj.dest1 = '';
      }
      if (billObj.carrier1) {
        billObj.carrier1 = billObj.carrier1.airCode;
      } else {
        billObj.carrier1 = '';
      }
      if (billObj.dest2) {
        billObj.dest2 = billObj.dest2.airportCode;
      } else {
        billObj.dest2 = '';
      }
      if (billObj.carrier2) {
        billObj.carrier2 = billObj.carrier2.airCode;
      } else {
        billObj.carrier2 = '';
      }
      if (billObj.dest3) {
        billObj.dest3 = billObj.dest3.airportCode;
      } else {
        billObj.dest3 = '';
      }
      if (billObj.carrier3) {
        billObj.carrier3 = billObj.carrier3.airCode;
      } else {
        billObj.carrier3 = '';
      }
      if (billObj.dest4) {
        billObj.dest4 = billObj.dest4.airportCode;
      } else {
        billObj.dest4 = '';
      }
      if (billObj.carrier4) {
        billObj.carrier4 = billObj.carrier4.airCode;
      } else {
        billObj.carrier4 = '';
      }
      if (billObj.currency) {
        billObj.currency = billObj.currency.currencyCode;
      } else {
        billObj.currency = '';
      }
      if (billObj.chargeCode) {
        billObj.chargeCode = billObj.chargeCode.id;
      } else {
        billObj.chargeCode = '';
      }
      if (billObj.wtVal) {
        billObj.wtVal = billObj.wtVal.id;
      } else {
        billObj.wtVal = '';
      }
      if (billObj.other) {
        billObj.other = billObj.other.id;
      } else {
        billObj.other = '';
      }
      if (billObj.weightCode) {
        billObj.weightCode = billObj.weightCode.id;
      } else {
        billObj.weightCode = '';
      }
      if (billObj.rateClass) {
        billObj.rateClass = billObj.rateClass.id;
      } else {
        billObj.rateClass = '';
      }
      if (billObj.volumeCode) {
        billObj.volumeCode = billObj.volumeCode.id;
      } else {
        billObj.volumeCode = '';
      }
      if (billObj.destCurrency) {
        billObj.destCurrency = billObj.destCurrency.currencyCode;
      } else {
        billObj.destCurrency = '';
      }
      var alsoNotifyData = angular.copy(vm.alsoNotifyData);
      for (var key in alsoNotifyData) {
        if (alsoNotifyData.hasOwnProperty(key)) {
          var element = alsoNotifyData[key];
          billObj[key] = element;
        }
      }
      if (typeof billObj.agreedFlag === 'boolean') {
        billObj.agreedFlag = billObj.agreedFlag ? '1' : '0';
      } else if (typeof billObj.agreedFlag === 'string') {
        billObj.agreedFlag = billObj.agreedFlag;
      }
      if (!billObj.agentOprnId) {
        billObj.agentOprnId = Auth.getUnitId() + '';
      }
      if (!billObj.agentSalesId) {
        billObj.agentSalesId = Auth.getMyUnitId() + '';
      }
      obj.pAirWaybillInfo = billObj;
      delete obj.pAirWaybillInfo.smgTimes;
      delete obj.pAirWaybillInfo.holdCodeList;
      obj.pWaybillRateDetails = [];
      angular.forEach(vm.otherFeeData, function (v, k) {
        obj.pWaybillRateDetails.push({
          code: v.code && v.code.id,
          owner: v.owner && v.owner.id,
          fee: v.fee
        });
      });
      obj.pWaybillSpecialReferences = angular.copy(vm.specialData);
      obj.pWaybillGoodsSizes = angular.copy(vm.volData);
      return obj;
    }
    /**
     * 提取模板
     */
    function pickTemp(type) {
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
                type: type
              }
            };
          }
        }
      });
      pickTempDialog.result.then(function (data) {
        if (type === '0') {
          setMasterTempData(data);
        } else if (type === '1') {
          setSubTempData(data);
        }
      }, function (resp) {

      });
    }
    /**
     * 根据提取的模板数据来设置数据--主单
     * 
     * @param {any} params
     */
    function setMasterTempData(params) {
      try {
        var modelJson = JSON.parse(params.modelJson);
        setMasterTempBaseData(modelJson.pAirWaybillInfo);
        setOtherFeeData(modelJson.pWaybillRateDetails); //显示other fee
        setShcCode(modelJson.pWaybillSpecialReferences); //显示SHC CODE
        setAlsoNotify(modelJson.pAirWaybillInfo); //显示通知人
        setVol(modelJson.pWaybillGoodsSizes); //显示尺寸
      } catch (error) {
        Notification.error({
          message: '数据出错啦'
        });
      }
    }
    /**
     * 显示主运单基本信息
     * 
     */
    function setMasterTempBaseData(baseData) {
      vm.billObj.issuedBy = baseData.issuedBy;
      vm.billObj.spAccountNumber = baseData.spAccountNumber;
      vm.billObj.spName = baseData.spName;
      vm.billObj.spAddress = baseData.spAddress;
      vm.billObj.spZipcode = baseData.spZipcode;
      vm.billObj.spCity = baseData.spCity;
      vm.billObj.spState = baseData.spState;
      if (baseData.spCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (baseData.spCountry === element.countryCode) {
            vm.billObj.spCountry = element;
            break;
          }
        }
      } else {
        vm.billObj.spCountry = baseData.spCountry;
      }
      vm.billObj.spTel = baseData.spTel;
      vm.billObj.spFax = baseData.spFax;
      vm.billObj.spContractor = baseData.spContractor;
      vm.billObj.csAccountNumber = baseData.csAccountNumber;
      vm.billObj.csName = baseData.csName;
      vm.billObj.csAddress = baseData.csAddress;
      vm.billObj.csZipcode = baseData.csZipcode;
      vm.billObj.csCity = baseData.csCity;
      vm.billObj.csState = baseData.csState;
      if (baseData.csCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (baseData.csCountry === element.countryCode) {
            vm.billObj.csCountry = element;
            break;
          }
        }
      } else {
        vm.billObj.csCountry = baseData.csCountry;
      }
      vm.billObj.csTel = baseData.csTel;
      vm.billObj.csFax = baseData.csFax;
      vm.billObj.csContractor = baseData.csContractor;
      vm.billObj.agentName = baseData.agentName;
      vm.billObj.agentPartIdentifier = baseData.agentPartIdentifier;
      vm.billObj.agentCity = baseData.agentCity;
      vm.billObj.agentIataCode = baseData.agentIataCode;
      vm.billObj.agentCassAddress = baseData.agentCassAddress
      vm.billObj.accountNo = baseData.accountNo;
      vm.billObj.deptDesc = baseData.deptDesc;
      angular.forEach(vm.accounInforIdentifData, function (v, k) {
        if (baseData.accounInforIdentif === v.id) {
          vm.billObj.accounInforIdentif = v;
        }
        if (baseData.accounInforIdentif1 === v.id) {
          vm.billObj.accounInforIdentif1 = v;
        }
        if (baseData.accounInforIdentif2 === v.id) {
          vm.billObj.accounInforIdentif2 = v;
        }
        if (baseData.accounInforIdentif3 === v.id) {
          vm.billObj.accounInforIdentif3 = v;
        }
        if (baseData.accounInforIdentif4 === v.id) {
          vm.billObj.accounInforIdentif4 = v;
        }
        if (baseData.accounInforIdentif5 === v.id) {
          vm.billObj.accounInforIdentif5 = v;
        }
      });
      vm.billObj.freightPrepaid = baseData.freightPrepaid;
      vm.billObj.freightPrepaid1 = baseData.freightPrepaid1;
      vm.billObj.freightPrepaid2 = baseData.freightPrepaid2;
      vm.billObj.freightPrepaid3 = baseData.freightPrepaid3;
      vm.billObj.freightPrepaid4 = baseData.freightPrepaid4;
      vm.billObj.freightPrepaid5 = baseData.freightPrepaid5;
      if (baseData.dept) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dept = airportData;
            }
          });
      }
      if (baseData.dest1) {
        restAPI.airData.getDataByCode.save({}, baseData.dest1)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest1 = airportData;
            }
          });
      }
      if (baseData.dest2) {
        restAPI.airData.getDataByCode.save({}, baseData.dest2)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest2 = airportData;
            }
          });
      }
      if (baseData.dest3) {
        restAPI.airData.getDataByCode.save({}, baseData.dest3)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest3 = airportData;
            }
          });
      }
      if (baseData.dest4) {
        restAPI.airData.getDataByCode.save({}, baseData.dest4)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.billObj.dest4 = airportData;
            }
          });
      }
      angular.forEach(vm.airData, function (v, k) {
        if (baseData.carrier1 === v.airCode) {
          vm.billObj.carrier1 = v;
        }
        if (baseData.carrier2 === v.airCode) {
          vm.billObj.carrier2 = v;
        }
        if (baseData.carrier3 === v.airCode) {
          vm.billObj.carrier3 = v;
        }
        if (baseData.carrier4 === v.airCode) {
          vm.billObj.carrier4 = v;
        }
      });
      angular.forEach(vm.currencyData, function (v, k) {
        if (baseData.currency === v.currencyCode) {
          vm.billObj.currency = v;
        }
        if (baseData.destCurrency === v.currencyCode) {
          vm.billObj.destCurrency = v;
        }
      });
      if (baseData.chargeCode) {
        for (var index = 0; index < vm.chargeCodeData.length; index++) {
          var element = vm.chargeCodeData[index];
          if (baseData.chargeCode === element.id) {
            vm.billObj.chargeCode = element;
            break;
          }
        }
      } else {
        vm.billObj.chargeCode = baseData.chargeCode;
      }
      angular.forEach(vm.wtValData, function (v, k) {
        if (baseData.wtVal === v.id) {
          vm.billObj.wtVal = v;
        }
        if (baseData.other === v.id) {
          vm.billObj.other = v;
        }
      });
      vm.billObj.carriageValue = baseData.carriageValue;
      vm.billObj.customsValue = baseData.customsValue;
      vm.billObj.airportDest = baseData.airportDest;
      if (baseData.airportDest) {
        restAPI.airData.getDataByCode.save({}, baseData.airportDest)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.showText.airPort = airportData.airportName;
              vm.showText.dest = airportData.airportCode;
            }
          });
      }
      vm.billObj.insuranceValue = baseData.insuranceValue;
      vm.billObj.ssr = baseData.ssr;
      vm.billObj.osi1 = baseData.osi1;
      vm.billObj.holdCode = baseData.holdCode;
      vm.billObj.holdCodeList = [];
      if (vm.billObj.holdCode) {
        var holdCodes = vm.billObj.holdCode.split(",");
        for (var index = 0; index < holdCodes.length; index++) {
          var code = holdCodes[index];
          vm.billObj.holdCodeList.push({
            code: code
          });
        }
      }
      vm.billObj.alsoNotify = baseData.alsoNotify;
      vm.billObj.rcpNo = baseData.rcpNo;
      vm.billObj.grossWeight = baseData.grossWeight;
      if (baseData.weightCode) {
        for (var index = 0; index < vm.weightCodeData.length; index++) {
          var element = vm.weightCodeData[index];
          if (baseData.weightCode === element.id) {
            vm.billObj.weightCode = element;
            break;
          }
        }
      } else {
        vm.billObj.weightCode = baseData.weightCode;
      }
      if (baseData.rateClass) {
        for (var index = 0; index < vm.rateClassData.length; index++) {
          var element = vm.rateClassData[index];
          if (baseData.rateClass === element.id) {
            vm.billObj.rateClass = element;
            break;
          }
        }
      } else {
        vm.billObj.rateClass = baseData.rateClass;
      }
      vm.billObj.commodityNo = baseData.commodityNo;
      vm.billObj.chargeWeight = baseData.chargeWeight;
      vm.billObj.rateCharge = baseData.rateCharge;
      vm.billObj.totalCount = baseData.totalCount;
      vm.billObj.slac = baseData.slac;
      vm.billObj.remark = baseData.remark;
      vm.billObj.goodsDesc = baseData.goodsDesc;
      vm.billObj.vol = baseData.vol;
      if (baseData.volumeCode) {
        for (var index = 0; index < vm.volumeCodeData.length; index++) {
          var element = vm.volumeCodeData[index];
          if (baseData.volumeCode === element.id) {
            vm.billObj.volumeCode = element;
            break;
          }
        }
      } else {
        vm.billObj.volumeCode = baseData.volumeCode;
      }
      vm.billObj.densityGroup = baseData.densityGroup;
      vm.billObj.prepaid = baseData.prepaid;
      vm.billObj.collect = baseData.collect;
      vm.billObj.valuationCharge = baseData.valuationCharge;
      vm.billObj.valuationCharge2 = baseData.valuationCharge2;
      vm.billObj.tax = baseData.tax;
      vm.billObj.tax2 = baseData.tax2;
      vm.billObj.totalAgent = baseData.totalAgent;
      vm.billObj.totalAgent2 = baseData.totalAgent2;
      vm.billObj.totalCarrier = baseData.totalCarrier;
      vm.billObj.totalCarrier2 = baseData.totalCarrier2;
      vm.billObj.totalPrepaid = baseData.totalPrepaid;
      vm.billObj.totalCollect = baseData.totalCollect;
      vm.billObj.rates = baseData.rates;
      vm.billObj.ccChargesDes = baseData.ccChargesDes;
      vm.billObj.chargesDestination = baseData.chargesDestination;
      if (baseData.agreedFlag === true || baseData.agreedFlag === '1') {
        vm.billObj.agreedFlag = '1';
      } else {
        vm.billObj.agreedFlag = '0';
      }
      vm.billObj.signatureAgent = baseData.signatureAgent;
      vm.billObj.place = baseData.place;
      vm.billObj.signatureIssuing = baseData.signatureIssuing;
      vm.billObj.totalCollectCharges = baseData.totalCollectCharges;
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
     * 保存到模板
     * 
     * @param {any} type 主单0 分单1
     */
    function saveTemp(type) {
      if (type === '0') {
        if (!valid()) {
          Notification.error({
            message: '有数据格式错误，请检查标红的输入框'
          });
          return false;
        }
      } else if (type === '1') {
        if (!validSubBill()) {
          Notification.error({
            message: '有数据格式错误，请检查标红的输入框'
          });
          return false;
        }
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
        var obj = getSaveTempData(data, type);
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
     *  保存到模板数据  //0 是未点击，1 是点击
     * 
     * @param {any} data
     * @param {any} type 主单0 分单1
     * @returns
     */
    function getSaveTempData(data, type) {
      var obj = {};
      if (type === '0') {
        var billObj = getData();
        delete billObj.pAirWaybillInfo.awId;
        delete billObj.pAirWaybillInfo.waybillNo;
        delete billObj.pAirWaybillInfo.agentOprnId;
        delete billObj.pAirWaybillInfo.agentSalesId;
        delete billObj.pAirWaybillInfo.fltDate;
        delete billObj.pAirWaybillInfo.fltDate2;
        delete billObj.pAirWaybillInfo.executed;
        delete billObj.pAirWaybillInfo.agentOprn;
        delete billObj.pAirWaybillInfo.agentSales;
        obj = billObj;
      } else if (type === '1') {
        var subObj = getSubBillData();
        delete subObj.pAirWaybillInfo.awId;
        delete subObj.pAirWaybillInfo.parentNo;
        delete subObj.pAirWaybillInfo.waybillNo;
        obj = subObj;
      }
      obj.labelName = data.labelName;
      obj.mRemark = data.mRemark;
      obj.agentCode = Auth.getMyUnitId() + '';
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
      if (type1 === '1' && type2 === '0') {
        obj.data.name = vm.billObj.spName;
        obj.data.address = vm.billObj.spAddress;
        obj.data.zipcode = vm.billObj.spZipcode;
        obj.data.city = vm.billObj.spCity;
        obj.data.state = vm.billObj.spState;
        obj.data.country = vm.billObj.spCountry && vm.billObj.spCountry.countryCode;
        obj.data.tel = vm.billObj.spTel;
        obj.data.fax = vm.billObj.spFax;
        obj.data.contacts = vm.billObj.spContractor;
        obj.data.awType = type2;
        obj.data.scType = type1;
        obj.title = '添加发货人信息';
      }
      if (type1 === '0' && type2 === '0') {
        obj.data.name = vm.billObj.csName;
        obj.data.address = vm.billObj.csAddress;
        obj.data.zipcode = vm.billObj.csZipcode;
        obj.data.city = vm.billObj.csCity;
        obj.data.state = vm.billObj.csState;
        obj.data.country = vm.billObj.csCountry && vm.billObj.csCountry.countryCode;
        obj.data.tel = vm.billObj.csTel;
        obj.data.fax = vm.billObj.csFax;
        obj.data.contacts = vm.billObj.csContractor;
        obj.data.awType = type2;
        obj.data.scType = type1;
        obj.title = '添加收货人信息';
      }
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
        template: require('./searchName.html'),
        controller: require('./searchName.ctrl.js'),
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
      if (type1 === '0' && type2 === '0') {
        vm.billObj.csName = data.name;
        vm.billObj.csAddress = data.address;
        vm.billObj.csZipcode = data.zipcode;
        vm.billObj.csCity = data.city;
        vm.billObj.csState = data.state;
        if (data.country) {
          for (var index = 0; index < vm.countryData.length; index++) {
            var element = vm.countryData[index];
            if (element.countryCode === data.country) {
              vm.billObj.csCountry = element;
              break;
            }
          }
        }
        vm.billObj.csTel = data.tel;
        vm.billObj.csFax = data.fax;
        vm.billObj.csContractor = data.contacts;
      }
      if (type1 === '1' && type2 === '0') {
        vm.billObj.spName = data.name;
        vm.billObj.spAddress = data.address;
        vm.billObj.spZipcode = data.zipcode;
        vm.billObj.spCity = data.city;
        vm.billObj.spState = data.state;
        vm.billObj.spCountry = data.country;
        if (data.country) {
          for (var index = 0; index < vm.countryData.length; index++) {
            var element = vm.countryData[index];
            if (element.countryCode === data.country) {
              vm.billObj.spCountry = element;
              break;
            }
          }
        }
        vm.billObj.spTel = data.tel;
        vm.billObj.spFax = data.fax;
        vm.billObj.spContractor = data.contacts;
      }
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
     * 添加otherFee
     */
    function addOtherFee() {
      vm.otherFeeData.push({
        code: '',
        fee: '',
        owner: ''
      });
    }
    /**
     * 删除otherFee
     */
    function removeOtherFee(data) {
      vm.otherFeeData.splice(data, 1);
    }
    /**
     * 预审操作
     */
    function audit() {
      if (vm.currentBillType === '1') {
        if (!validSubBill()) {
          Notification.error({
            message: '有数据格式错误，请检查标红的输入框'
          });
          return false;
        }
        var obj = getSubBillData();
        var callback = function () {
          vm.index !== undefined && vm.subBill.splice(vm.index, 1, obj);
          vm.currentSubData = angular.copy(vm.subBillObj);
          doAudit();
        }
        updateBill(obj, callback);
      } else {
        if (!valid()) {
          Notification.error({
            message: '有数据格式错误，请检查标红的输入框'
          });
          return false;
        }
        if (!validFlt()) {
          showFltError();
          return false;
        }
        var obj = getData();
        var callback = function () {
          vm.currentMasterData = angular.copy(vm.billObj);
          doAudit();
        };
        updateBill(obj, callback);
      }
    }

    function doAudit() {
      var obj = getData();
      $rootScope.loading = true;
      restAPI.bill.billAudit.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '预审操作成功'
            });
            $state.go('agentPrejudice.pre', {
              awId: obj.pAirWaybillInfo.awId
            });
          } else {
            showErrorDialog(resp.msg);
          }
        });
    }
    /**
     * 显示error
     */
    function showErrorDialog(msg) {
      var errorDialog = $modal.open({
        template: require('../../../remove/remove1.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: msg
            };
          }
        }
      });
    }
    /**
     * 打印
     */
    function print() {

    }
    /**
     * 删除
     */
    function del() {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '你将要删除该运单：' + vm.billObj.waybillNo
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.bill.delBill.save({}, {
            awId: vm.billObj.awId
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              $state.go('agentWaybill.masterBill');
              Notification.success({
                message: '删除成功'
              });
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
     * 添加分运单
     */
    function addSubBill() {
      var isChange = false;
      if (vm.currentBillType === '0') {
        isChange = angular.equals(vm.currentMasterData, vm.billObj);
      } else if (vm.currentBillType === '1') {
        isChange = angular.equals(vm.currentSubData, vm.subBillObj);
      }
      if (!isChange) {
        var dialog = $modal.open({
          template: require('./dialog.html'),
          controller: require('./dialog.ctrl.js'),
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '操作提示',
                content: '是否保存当前运单的信息',
                btnName1: '保存',
                btnName2: '取消'
              };
            }
          }
        });
        dialog.result.then(function () {
          //判断当前是主运单还是分运单
          judgeType();
        }, function () {
          if (vm.currentBillType === '0') {
            vm.billObj = angular.copy(vm.currentMasterData);
          } else if (vm.currentBillType === '1') {
            vm.subBillObj = angular.copy(vm.currentSubData);
          }
          showAddSubBillDialog();
        });
      } else {
        showAddSubBillDialog();
      }
    }
    /**
     * 显示增加分单弹窗
     */
    function showAddSubBillDialog() {
      var addSubBillDialog = $modal.open({
        template: require('./addSubBill.html'),
        controller: require('./addSubBill.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加分运单',
              awId: vm.billObj.awId
            };
          }
        }
      });
      addSubBillDialog.result.then(function (data) {
        vm.subBill.push(data);
        selectSubbill(data, vm.subBill.length - 1);
      }, function (resp) {

      });
    }
    /**
     * 判断当前是主运单还是分运单
     */
    function judgeType() {
      if (vm.currentBillType === '0') {
        saveMaster();
      } else if (vm.currentBillType === '1') {
        saveSub();
      }
    }
    /**
     * 增加时保存主单
     */
    function saveMaster() {
      if (!valid()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getData();
      var callback = function () {
        vm.currentMasterData = angular.copy(vm.billObj);
        showAddSubBillDialog();
      };
      updateBill(obj, callback);
    }
    /**
     * 增加时保存分单
     */
    function saveSub() {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getSubBillData();
      var callback = function () {
        vm.index !== undefined && vm.subBill.splice(vm.index, 1, obj);
        vm.currentSubData = angular.copy(vm.subBillObj);
        showAddSubBillDialog();
      }
      updateBill(obj, callback);
    }
    /**
     * 显示主运单信息
     *  type noSave: 直接切换到主单 
     */
    function chooseMaster(type) {
      if (vm.currentBillNo === vm.billObj.waybillNo && vm.currentBillType === vm.billObj.type) {
        return false;
      }
      // 直接保存分单
      if (type === 'noSave') {
        selectMasterBill();
      } else {
        if (angular.equals(vm.currentSubData, vm.subBillObj)) {
          selectMasterBill();
        } else {
          saveCurrentMasterSubbillDialog();
        }
      }
    }
    /**
     * 切换主单时保存当前分单弹窗
     * 
     */
    function saveCurrentMasterSubbillDialog() {
      var dialog = $modal.open({
        template: require('./dialog.html'),
        controller: require('./dialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '是否保存该运单的信息',
              btnName1: '保存',
              btnName2: '切换'
            };
          }
        }
      });
      dialog.result.then(function () {
        saveMasterSubbill();
      }, function () {
        selectMasterBill();
      });
    }
    /**
     * 保存当前分单
     * 
     * @param {any} params
     * @returns
     */
    function saveMasterSubbill() {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getSubBillData();
      var callback = function () {
        vm.index !== undefined && vm.subBill.splice(vm.index, 1, obj);
        selectMasterBill();
      }
      updateBill(obj, callback);
    }
    /**
     * 切换到主单
     */
    function selectMasterBill() {
      delete vm.index;
      vm.showSubBill = false;
      vm.currentBillNo = vm.billObj.waybillNo;
      vm.currentBillType = vm.billObj.type;
    }
    /**
     * 保存当前主单弹窗
     * 
     */
    function saveCurrentBillDialog(data, index) {
      var dialog = $modal.open({
        template: require('./dialog.html'),
        controller: require('./dialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '是否保存该运单的信息',
              btnName1: '保存',
              btnName2: '切换'
            };
          }
        }
      });
      dialog.result.then(function () {
        saveCurrentBill(data, index);
      }, function () {
        vm.billObj = angular.copy(vm.currentMasterData);
        selectSubbill(data, index);
      });
    }
    /**
     * 保存当前主单
     * 
     * @param {any} data
     * @param {any} index
     */
    function saveCurrentBill(data, index) {
      if (!valid()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getData();
      var callback = function () {
        vm.currentMasterData = angular.copy(vm.billObj);
        selectSubbill(data, index);
      };
      updateBill(obj, callback);
    }
    /**
     * 选择子运单
     */
    function chooseBill(data, index) {
      if (vm.currentBillNo === data.pAirWaybillInfo.waybillNo && vm.currentBillType === data.pAirWaybillInfo.type) {
        return false;
      }
      if (vm.index !== undefined) {
        // 保存当前分单
        if (angular.equals(vm.currentSubData, vm.subBillObj)) {
          selectSubbill(data, index);
        } else {
          saveCurrentSubbillDialog(data, index);
        }
      } else {
        // 保存主单
        // 1、首先判断主单的数据是否改变；如果改变，弹窗；没有改变，直接切换
        if (angular.equals(vm.currentMasterData, vm.billObj)) {
          selectSubbill(data, index);
        } else {
          saveCurrentBillDialog(data, index);
        }
      }
    }
    /**
     * 保存当前分单弹窗
     * 
     */
    function saveCurrentSubbillDialog(data, index) {
      var dialog = $modal.open({
        template: require('./dialog.html'),
        controller: require('./dialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '是否保存该运单的信息',
              btnName1: '保存',
              btnName2: '切换'
            };
          }
        }
      });
      dialog.result.then(function () {
        saveCurrentSubbill(data, index);
      }, function () {
        selectSubbill(data, index);
      });
    }
    /**
     * 保存当前的分单
     * 
     * @param {any} params
     */
    function saveCurrentSubbill(data, index) {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getSubBillData();
      var callback = function () {
        vm.index !== undefined && vm.subBill.splice(vm.index, 1, obj);
        vm.currentSubData = angular.copy(vm.subBillObj);
        selectSubbill(data, index);
      }
      updateBill(obj, callback);
    }
    /**
     * 切换分单
     * 
     * @param {any} params
     * */
    function selectSubbill(data, index) {
      vm.showSubBill = true;
      vm.index = index;
      data.showLeftSub = true;
      showSubBillDetail(data);
    }
    /**
     * 显示子运单的信息
     */
    function showSubBillDetail(data) {
      var baseData = data.pAirWaybillInfo;
      vm.timesFHL = baseData.smgTimes || 0;
      vm.currentBillNo = baseData.waybillNo;
      vm.currentBillType = baseData.type;
      vm.subBillObj.awId = baseData.awId;
      vm.subBillObj.parentNo = baseData.parentNo;
      vm.subBillObj.type = baseData.type;
      vm.subBillObj.waybillNo = baseData.waybillNo;
      if (baseData.dept) {
        restAPI.airData.getDataByCode.save({}, baseData.dept)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dept = airportData;
              vm.currentSubData.dept = airportData;
            }
          });
      } else {
        restAPI.airData.getDataByCode.save({}, 'PVG')
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dept = airportData;
              vm.currentSubData.dept = airportData;
            }
          });
      }
      if (baseData.dest1) {
        restAPI.airData.getDataByCode.save({}, baseData.dest1)
          .$promise.then(function (resp) {
            var airportData = resp.data;
            if (airportData) {
              vm.subBillObj.dest1 = airportData;
              vm.currentSubData.dest1 = airportData;
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
      vm.currentSubData = angular.copy(vm.subBillObj);
    }
    /**
     * 删除关联
     */
    function disConnect(param, index, $e) {
      $e.stopPropagation();
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '你将要取消该运单：' + param.pAirWaybillInfo.waybillNo + '与主运单的关联'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.preJudice.disConnect.save({}, {
            awId: param.pAirWaybillInfo.awId,
            parentNo: ''
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.subBill.splice(index, 1);
              if (param.pAirWaybillInfo.waybillNo === vm.currentBillNo) {
                chooseMaster('noSave');
              }
              Notification.success({
                message: '取消关联成功'
              });
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
     * 历史记录
     */
    function history(type) {
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
              awId: type === '0' ? vm.currentMasterData.awId : vm.currentSubData.awId,
              params: type
            };
          }
        }
      });
      msgDialog.result.then(function () {

      }, function () {

      });
    }
    /**
     * 发送FWB
     */
    function send() {
      $rootScope.loading = true;
      restAPI.message.sendFWB.save({}, vm.billObj.awId)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '报文发送成功'
            });
            showMsg(resp.data);
            vm.timesFWB = +vm.timesFWB + 1;
          } else {
            showErrorDialog(resp.msg);
          }
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
            vm.timesFHL = +vm.timesFHL + 1;
            vm.subBillObj.smgTimes = vm.timesFHL;
          } else {
            showErrorDialog(resp.msg);
          }
        });
    }
    /**
     * 显示报文信息
     */
    function showMsg(params) {
      var msgDialog = $modal.open({
        template: require('./showMsg.html'),
        controller: require('./showMsg.ctrl.js'),
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
     * 锁定
     */
    function lock() {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '你将要' + (vm.isLock ? '解锁该运单,解锁后报文将可以更新运单制单数据' : '锁定该运单,锁定后报文将不再更新运单制单数据')
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        var lockStatus = vm.isLock ? '0' : '1';
        restAPI.preJudice.lockStatus.save({}, {
            awId: vm.billObj.awId,
            lockStatus: lockStatus
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: (lockStatus === '1' ? '锁定' : '解锁') + '成功'
              });
              vm.billObj.lockStatus = lockStatus;
              vm.isLock = lockStatus === '1';
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
     * Also notify
     */
    function alsoNotify() {
      var alsoNotifyDialog = $modal.open({
        template: require('../alsoNotify/alsoNotify.html'),
        controller: require('../alsoNotify/alsoNotify.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: 'alsoNotify',
              countryData: vm.countryData,
              obj: vm.alsoNotifyData
            };
          }
        }
      });
      alsoNotifyDialog.result.then(function (data) {
        vm.alsoNotifyData = data;
        var alsoNotify = [];
        data.notifyName && alsoNotify.push(data.notifyName);
        data.notifyAddress && alsoNotify.push(data.notifyAddress);
        data.notifyZipcode && alsoNotify.push(data.notifyZipcode);
        data.notifyCity && alsoNotify.push(data.notifyCity);
        data.notifyState && alsoNotify.push(data.notifyState);
        data.notifyCountry && alsoNotify.push(data.notifyCountry);
        data.notifyTel && alsoNotify.push(data.notifyTel);
        data.notifyFax && alsoNotify.push(data.notifyFax);
        data.notifyContractor && alsoNotify.push(data.notifyContractor);
        vm.billObj.alsoNotify = alsoNotify.join(',');
      }, function () {

      });
    }
    /**
     * 尺寸
     */
    function selectVol() {
      var volDialog = $modal.open({
        template: require('../vol/vol.html'),
        controller: require('../vol/vol.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              data: vm.volData
            };
          }
        }
      });
      volDialog.result.then(function (data) {
        vm.volData = [];
        var countData = 0;
        angular.forEach(data, function (v, k) {
          vm.volData.push({
            awId: vm.billObj.awId || '',
            length: v.length,
            width: v.width,
            height: v.height,
            pieces: v.pieces,
            weightCode: v.weightCode,
            weight: v.weight,
            unitcode: v.unitcode
          });
          countData += v.length * v.width * v.height * v.pieces;
         // console.log(countData)
        });
        //还有其他几个页面需要修改
       if(countData){
       	countVol(countData)
       };
      }, function (resp) {

      });
    }
    /**
     * 计算vol
     * 
     */
    function countVol(params) {
      var type = vm.billObj.volumeCode.id;
      var data = 0;
      switch (type) {
        case 'MC':
          data = params / 1000000;
          break;
        case 'CC':
          data = params;
          break;
        case 'CI':
          data = params * 0.0610238;
          break;
        case 'CF':
          data = params * 0.0000353;
          break;
      }
      vm.billObj.vol = data.toFixed(2);
    }
    /**
     * 计算Total Prepaid
     */
    function countPrepaid() {
      var data1 = +vm.billObj.prepaid || 0;
      var data2 = +vm.billObj.valuationCharge || 0;
      var data3 = +vm.billObj.tax || 0;
      var data4 = +vm.billObj.totalAgent || 0;
      var data5 = +vm.billObj.totalCarrier || 0;
      var data6 = +vm.billObj.collect || 0;
      var data7 = +vm.billObj.valuationCharge2 || 0;
      var data8 = +vm.billObj.tax2 || 0;
      var data9 = +vm.billObj.totalAgent2 || 0;
      var data10 = +vm.billObj.totalCarrier2 || 0;
      vm.billObj.totalPrepaid = (data1 + data2 + data3 + data4 + data5).toFixed(3);
      vm.billObj.totalCollect = (data6 + data7 + data8 + data9 + data10).toFixed(3);
    }
    /**
     * 保存子运单
     * 
     */
    function saveSubBill() {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getSubBillData();
      var callback = function () {
        vm.index !== undefined && vm.subBill.splice(vm.index, 1, obj);
        vm.currentSubData = angular.copy(vm.subBillObj);
      }
      updateBill(obj, callback);
    }
    /**
     * 获取子单数据
     */
    function getSubBillData() {
      var obj = angular.copy(vm.subBillObj);
      if (obj.dept) {
        obj.dept = obj.dept.airportCode;
      } else {
        obj.dept = '';
      }
      if (obj.dest1) {
        obj.dest1 = obj.dest1.airportCode;
      } else {
        obj.dest1 = '';
      }
      if (obj.spCountry) {
        obj.spCountry = obj.spCountry.countryCode;
      } else {
        obj.spCountry = '';
      }
      if (obj.csCountry) {
        obj.csCountry = obj.csCountry.countryCode;
      } else {
        obj.csCountry = '';
      }
      if (obj.weightCode) {
        obj.weightCode = obj.weightCode.id;
      } else {
        obj.weightCode = '';
      }
      if (obj.wtVal) {
        obj.wtVal = obj.wtVal.id;
      } else {
        obj.wtVal = '';
      }
      if (obj.other) {
        obj.other = obj.other.id;
      } else {
        obj.other = '';
      }
      if (obj.currency) {
        obj.currency = obj.currency.currencyCode;
      } else {
        obj.currency = '';
      }
      obj.agentOprnId = Auth.getUnitId() + '';
      obj.agentSalesId = Auth.getMyUnitId() + '';
      obj.agentOprn = Auth.getUnitCode();
      obj.agentSales = Auth.getMyUnitCode();
      obj.parentNo = vm.billObj.awId;
      //delete obj.smgTimes;
      delete obj.holdCodeList;
      return {
        pAirWaybillInfo: obj,
        pWaybillGoodsSizes: [],
        pWaybillRateDetails: [],
        pWaybillSpecialReferences: []
      };
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
     * 更改主单
     */
    function changeParent() {
      var changeDialog = $modal.open({
        template: require('./connect.html'),
        controller: require('./connect.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '更改主单号',
              obj: {}
            };
          }
        }
      });
      changeDialog.result.then(function (data) {
        saveParent(data.awId);
      }, function (resp) {

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
            Notification.success({
              message: '更改主单成功'
            });
            vm.subBill.splice(vm.index, 1);
            chooseMaster('noSave');
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 复制当前分单号
     * 
     *  复制时先保存当前分单的数据
     */
    function copySub(params, index, $e) {
      $e.stopPropagation();
      if (vm.index !== undefined) {
        copySaveSub(params);
      } else {
        copySubDialog(params);
      }
    }
    /**
     * 复制时保存分单
     */
    function copySaveSub(params) {
      if (!validSubBill()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getSubBillData();
      var callback = function () {
        vm.index !== undefined && vm.subBill.splice(vm.index, 1, obj);
        vm.currentSubData = angular.copy(vm.subBillObj);
        copySubDialog(obj);
      }
      updateBill(obj, callback);
    }
    /**
     * 复制弹窗
     */
    function copySubDialog(params) {
      var copyDialog = $modal.open({
        template: require('./copyDialog.html'),
        controller: require('./copyDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '克隆当前分单',
              obj: params.pAirWaybillInfo
            };
          }
        }
      });
      copyDialog.result.then(function (data) {
        vm.subBill.push(data);
        selectSubbill(data, vm.subBill.length - 1);
      }, function (resp) {

      });
    }
    var timer1 = $interval(function () {
      var subGrossWeight = 0;
      var subRcpNo = 0;
      var subSlac = 0;
      angular.forEach(vm.subBill, function (v, k) {
        subGrossWeight += +(v.pAirWaybillInfo.grossWeight || 0);
        subRcpNo += +(v.pAirWaybillInfo.rcpNo || 0);
        subSlac += +(v.pAirWaybillInfo.slac || 0);
      });
      vm.showText.subRcpNo = subRcpNo;
      vm.showText.subSlac = subSlac;
      vm.showText.subGrossWeight = subGrossWeight;
    }, 3000);
    /**
     * 子单的左边显示
     */
    function showLeftSub(param, $e) {
      $e.stopPropagation();
      param.showLeftSub = !param.showLeftSub;
    }
    /**
     * 显示分单的简易信息
     */
    function showAllInfo() {
      vm.showAllSubInfo = !vm.showAllSubInfo;
      angular.forEach(vm.subBill, function (v, k) {
        v.showLeftSub = vm.showAllSubInfo;
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

    // function selectGoods(data) {
    //   vm.billObj.goodsDesc = data.goodsName;
    // }
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
     * 分单号校验
     */
    function changeSubText() {
      try {
        vm.subBillObj.waybillNo = vm.subBillObj.waybillNo.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }

    var btnGroup = angular.element('#btnGroup'),
      oTop;
    angular.element($window).bind('scroll', function () {
      oTop = document.body.scrollTop == 0 ? document.documentElement.scrollTop : document.body.scrollTop;
      if (btnGroup[0].offsetTop + 70 < oTop) {
        btnGroup.addClass('btn-fixed');
      } else {
        btnGroup.removeClass('btn-fixed');
      }
    });
    $scope.$on('$destroy', function () {
      $interval.cancel(timer1);
      angular.element($window).unbind('scroll');
    });
  }
];

module.exports = angular.module('app.agentWaybill.newMasterBill', []).controller('newMasterBillCtrl', newMasterBill_fn);