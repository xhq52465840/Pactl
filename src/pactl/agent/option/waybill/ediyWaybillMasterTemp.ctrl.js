'use strict';

var ediyWaybillMasterTemp_fn = ['$scope', '$state', '$stateParams', '$modal', '$rootScope', 'restAPI', 'Notification',
  function ($scope, $state, $stateParams, $modal, $rootScope, restAPI, Notification) {
    var vm = $scope;
    var id = '';
    var agentCode = '';
    vm.addOtherFee = addOtherFee;
    vm.alsoNotify = alsoNotify;
    vm.alsoNotifyData = {};
    vm.billObj = {};
    vm.cancel = cancel;
    vm.errorData = []; // 正则错的数据
    vm.otherFeeData = [];
    vm.onSelectDept = onSelectDept;
    vm.onSelectTo = onSelectTo;
    vm.removeOtherFee = removeOtherFee;
    vm.save = save;
    vm.saveUser = saveUser;
    vm.search = search;
    vm.selectOwner = selectOwner;
    vm.selectShcCode = selectShcCode;
    vm.selectWT = selectWT;
    vm.selectVol = selectVol;
    vm.searchUser = searchUser;
    vm.specialData = []; //需要保存的特货数据
    vm.showText = {
      airPort: ''
    };
    vm.tempObj = {};
    vm.volData = []; //需要保存的尺寸数据
    /*******基本数据*********/
    vm.countryData = [];
    vm.accounInforIdentifData = [];
    vm.airData = [];
    vm.currencyData = [];
    vm.chargeCodeData = [];
    vm.wtValData = [];
    vm.shcCode = [];
    vm.weightCodeData = [];
    vm.rateClassData = [];
    vm.volumeCodeData = [];
    vm.otherCodeData = [];
    vm.otherOwnerData = [];
    /**********************/
    vm.changeNum = changeNum;
    vm.changeNum2 = changeNum2;
    vm.changeNum3 = changeNum3;
    vm.changeNum4 = changeNum4;
    vm.changeNum5 = changeNum5;
    vm.changeNum6 = changeNum6;
    vm.changeNum7 = changeNum7;
    vm.changeNum8 = changeNum8;
    vm.changeNum9 = changeNum9;
    vm.changeNum12 = changeNum12;
    /*************************/
    vm.changeText = changeText;
    vm.changeText1 = changeText1;
    vm.changeText2 = changeText2;
    vm.changeText3 = changeText3;
    vm.changeText4 = changeText4;
    vm.changeText5 = changeText5;
    vm.changeText6 = changeText6;
    /**********************/
    vm.refreshDest = refreshDest;
    vm.blurGrossWeight = blurGrossWeight;
    vm.blurChargeWeight = blurChargeWeight;    

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
          search();
        });
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
        return;
      }
      if (vm.billObj.dest3) {
        vm.billObj.airportDest = vm.billObj.dest3.airportCode;
        vm.showText.airPort = vm.billObj.dest3.airportName;
        return;
      }
      if (vm.billObj.dest2) {
        vm.billObj.airportDest = vm.billObj.dest2.airportCode;
        vm.showText.airPort = vm.billObj.dest2.airportName;
        return;
      }
      if (vm.billObj.dest1) {
        vm.billObj.airportDest = vm.billObj.dest1.airportCode;
        vm.showText.airPort = vm.billObj.dest1.airportName;
        return;
      }
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
        var reg = /^[0-9]{1,10}(([.]{1}[0-9]{1,3})?|[0-9]{1,2})$/g;
        param.errorFlag = !reg.test(param.fee);
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
        var reg = /^[0-9]{1,10}(([.]{1}[0-9]{1,3})?|[0-9]{1,2})$/g;
        var index = vm.errorData.indexOf(text);
        if (reg.test(vm.billObj[text])) {
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
        var reg = /^[0-9]{1,5}(([.]{1}[0-9]{1,2})?|[0-9]{1,2})$/g;
        var index = vm.errorData.indexOf(text);
        if (reg.test(vm.billObj[text])) {
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
        var reg = /^[0-9]{1,9}(([.]{1}[0-9]{1,6})?|[0-9]{1,2})$/g;
        var index = vm.errorData.indexOf(text);
        if (reg.test(vm.billObj[text])) {
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
     * 只能输入大写和特殊字符
     */
    function changeText(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
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
      var reg = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NVD$)/g;
      var index = vm.errorData.indexOf(text);
      if (reg.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
    }
    /**
     * 只能输入NCV 或 数字 .
     * 
     * @param {any} text
     */
    function changeText4(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var reg = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NCV$)/g;
      var index = vm.errorData.indexOf(text);
      if (reg.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
    }
    /**
     * 航空公司二字码+  最多5位航班号
     * 5位   （ 可以3位数字，，前4位数字，第5位可以是字母或数字）
     * 
     * @param {any} text
     */
    function changeText5(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d]/g, '').toUpperCase();
      var reg = /^[A-Z0-9]{2}\d{3,4}[A-Z0-9]{0,1}$/g;
      var index = vm.errorData.indexOf(text);
      if (reg.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
    }
    /**
     * 只能输入XXX 或 数字 .
     * 
     * @param {any} text
     */
    function changeText6(text) {
      vm.billObj[text] = vm.billObj[text].replace(/[^a-zA-Z\d.]/g, '').toUpperCase();
      var reg = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^XXX$)/g;
      var index = vm.errorData.indexOf(text);
      if (reg.test(vm.billObj[text])) {
        if (index > -1) {
          vm.errorData.splice(index, 1);
        }
      } else {
        if (index < 0) {
          vm.errorData.push(text);
        }
      }
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
        setBaseData(modelJson.pAirWaybillInfo);
        setOtherFeeData(modelJson.pWaybillRateDetails); //显示other fee
        setShcCode(modelJson.pWaybillSpecialReferences); //显示SHC CODE
        setAlsoNotify(modelJson.pAirWaybillInfo); //显示通知人
        setVol(modelJson.pWaybillGoodsSizes); //显示尺寸
        vm.tempObj.labelName = item.labelName;
        vm.tempObj.mRemark = item.mRemark;
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
    function setBaseData(baseData) {
      vm.billObj.type = baseData.type;
      vm.billObj.waybillNo = baseData.waybillNo;
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
      vm.billObj.place = baseData.place;
      vm.billObj.signatureIssuing = baseData.signatureIssuing;
      vm.billObj.totalCollectCharges = baseData.totalCollectCharges;
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
          pieces: v.pieces
        });
      });
    }
    /**
     * Also notify
     */
    function alsoNotify() {
      var alsoNotifyDialog = $modal.open({
        template: require('../../waybill/alsoNotify/alsoNotify.html'),
        controller: require('../../waybill/alsoNotify/alsoNotify.ctrl.js'),
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
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var element = data[key];
            alsoNotify.push(element);
          }
        }
        vm.billObj.alsoNotify = alsoNotify.join(',');
      }, function () {

      });
    }
    /**
     * 尺寸
     */
    function selectVol() {
      var volDialog = $modal.open({
        template: require('../../waybill/vol/vol.html'),
        controller: require('../../waybill/vol/vol.ctrl.js'),
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
            pieces: v.pieces
          });
          countData += v.length * v.width * v.height * v.pieces;
        });
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
        template: require('../../waybill/holdCode/holdCode.html'),
        controller: require('../../waybill/holdCode/holdCode.ctrl.js'),
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
      }, function (resp) {

      });
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
      if (!valid()) {
        Notification.error({
          message: '有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      $rootScope.loading = true;
      var obj = getSaveTempData();
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
     * 保存数据
     * 0 是未点击，1 是点击
     */
    function getSaveTempData() {
      var billObj = angular.copy(vm.billObj),
        obj = {};
      if (billObj.csCountry) {
        billObj.csCountry = billObj.csCountry.countryCode;
      }
      if (billObj.spCountry) {
        billObj.spCountry = billObj.spCountry.countryCode;
      }
      if (billObj.dept) {
        billObj.dept = billObj.dept.airportCode;
      }
      if (billObj.accounInforIdentif) {
        billObj.accounInforIdentif = billObj.accounInforIdentif.id;
      }
      if (billObj.accounInforIdentif1) {
        billObj.accounInforIdentif1 = billObj.accounInforIdentif1.id;
      }
      if (billObj.accounInforIdentif2) {
        billObj.accounInforIdentif2 = billObj.accounInforIdentif2.id;
      }
      if (billObj.accounInforIdentif3) {
        billObj.accounInforIdentif3 = billObj.accounInforIdentif3.id;
      }
      if (billObj.accounInforIdentif4) {
        billObj.accounInforIdentif4 = billObj.accounInforIdentif4.id;
      }
      if (billObj.accounInforIdentif5) {
        billObj.accounInforIdentif5 = billObj.accounInforIdentif5.id;
      }
      if (billObj.dest1) {
        billObj.dest1 = billObj.dest1.airportCode;
      }
      if (billObj.carrier1) {
        billObj.carrier1 = billObj.carrier1.airCode;
      }
      if (billObj.dest2) {
        billObj.dest2 = billObj.dest2.airportCode;
      }
      if (billObj.carrier2) {
        billObj.carrier2 = billObj.carrier2.airCode;
      }
      if (billObj.dest3) {
        billObj.dest3 = billObj.dest3.airportCode;
      }
      if (billObj.carrier3) {
        billObj.carrier3 = billObj.carrier3.airCode;
      }
      if (billObj.dest4) {
        billObj.dest4 = billObj.dest4.airportCode;
      }
      if (billObj.carrier4) {
        billObj.carrier4 = billObj.carrier4.airCode;
      }
      if (billObj.currency) {
        billObj.currency = billObj.currency.currencyCode;
      }
      if (billObj.chargeCode) {
        billObj.chargeCode = billObj.chargeCode.id;
      }
      if (billObj.wtVal) {
        billObj.wtVal = billObj.wtVal.id;
      }
      if (billObj.other) {
        billObj.other = billObj.other.id;
      }
      if (billObj.weightCode) {
        billObj.weightCode = billObj.weightCode.id;
      }
      if (billObj.rateClass) {
        billObj.rateClass = billObj.rateClass.id;
      }
      if (billObj.volumeCode) {
        billObj.volumeCode = billObj.volumeCode.id;
      }
      if (billObj.destCurrency) {
        billObj.destCurrency = billObj.destCurrency.currencyCode;
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
      obj.pAirWaybillInfo = billObj;
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
      obj.id = id;
      obj.labelName = vm.tempObj.labelName;
      obj.mRemark = vm.tempObj.mRemark;
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
  }
];

module.exports = angular.module('app.agentOption.ediyWaybillMasterTemp', []).controller('ediyWaybillMasterTempCtrl', ediyWaybillMasterTemp_fn);