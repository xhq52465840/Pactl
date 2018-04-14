'use strict';

module.exports = ['$document', '$rootScope', 'restAPI', '$modal', 'Notification', 'Auth', '$state', '$interval', '$timeout',
  function ($document, $rootScope, restAPI, $modal, Notification, Auth, $state, $interval, $timeout) {
    return {
      restrict: 'EA',
      template: require('./waybill.html'),
      replace: true,
      scope: {
        billno: '=',
        billObj: '=',
        applyCertData: '='
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.alsoNotifyData = {}; //当前的通知人
        vm.originbillObj = {}; //原主单数据
        vm.currentBillNo = ''; // 当前选中的运单号
        vm.currentBillType = ''; // 当前选中的运单类型
        vm.errorData = []; // 正则错的数据
        vm.getCountry = getCountry;
        vm.otherFeeData = [];
        vm.volData = [];
        vm.subBillObj = {}; //分单数据
        vm.subErrorData = []; // 正则错的数据
        vm.search = search;
        vm.showSubBill = false;
        vm.showText = {
          airPort: '',
          dest: '',
          subGrossWeight: 0,
          subRcpNo: 0,
          subSlac: 0
        };
        vm.specialData = [];
        vm.billObj.errorData = vm.errorData;
        vm.billObj.subErrorData = vm.subErrorData;
        vm.billObj.pWaybillRateDetails = vm.otherFeeData;
        vm.billObj.pWaybillGoodsSize = vm.volData;
        vm.billObj.pWaybillSpecialReferences = vm.specialData;
        vm.showMasterCert = false;
        /***********基本数据************/
        vm.airData = [];
        vm.accounInforIdentifData = [];
        vm.chargeCodeData = [];
        vm.canPull = canPull;
        vm.countryData = [];
        vm.currencyData = [];
        vm.otherCodeData = [];
        vm.otherOwnerData = [];
        vm.rateClassData = [];
        vm.shcCode = [];
        vm.weightCodeData = [];
        vm.wtValData = [];
        vm.volumeCodeData = [];
        /************数据校验****************/

        /***********页面的方法****************/
        vm.addOtherFee = addOtherFee;
        vm.alsoNotify = alsoNotify;
        vm.blurGrossWeight = blurGrossWeight;
        vm.blurChargeWeight = blurChargeWeight;
        vm.masterCertData = {}; // 显示主单证书数字
        vm.chooseBill = chooseBill;
        vm.isDisable = isDisable;
        vm.isDisable2 = isDisable2;
        vm.isDisable3 = isDisable3;
        vm.chooseMaster = chooseMaster;
        vm.countTotal = countTotal;
        vm.onSelectDept = onSelectDept;
        vm.onSelectTo = onSelectTo;
        vm.openDate = openDate;
        vm.pullDown = pullDown;
        vm.pullUp = pullUp;
        vm.removeOtherFee = removeOtherFee;
        vm.showCargoDeclaraction = showCargoDeclaraction;
        vm.showBatteryDeclaraction = showBatteryDeclaraction;
        vm.saveUser = saveUser;
        vm.searchUser = searchUser;
        vm.selectShcCode = selectShcCode;
        vm.selectVol = selectVol;
        vm.selectOwner = selectOwner;
        vm.selectWT = selectWT;
        vm.searchBook = searchBook;
        vm.selectName = selectName;
        vm.changeXiang = changeXiang
        vm.showOther = showOther;
        vm.showCkElectricFlag = showCkElectricFlag;
        vm.showSubDest1 = showSubDest1;
        /*************************/
        vm.flightDate = {
          dateNow: getNowData(10)
        };
        vm.fltDateAble = fltDateAble;
        vm.onDate1 = onDate1;
        /*************************/
        vm.refreshDest = refreshDest;
        vm.showAllInfo = showAllInfo;
        vm.showLeftSub = showLeftSub;
        vm.disConnect = disConnect;
        vm.editELI = editELI;
        vm.editELM = editELM;
        vm.nameAadded = nameAadded;
        vm.airlineAllowPullDown = false;
        vm.billObj.setCertData = setCertData;
        vm.ckEleStatus = ckEleStatus;
        vm.canNameAddedEdit = canNameAddedEdit;
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
         * 查询
         */
        function search() {
          $rootScope.loading = true;
          restAPI.bill.ckwbinfo.save({}, {
              waybillNo: vm.billno,
              type: '0'
            })
            .$promise.then(function (resp) {
            	//console.log(resp)
              $rootScope.loading = false;
              if (resp.ok) {
                if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
                  setAllData(resp.data);
                  vm.billObj.originbillObj = angular.copy(resp.data);
                  vm.originbillObj = angular.copy(resp.data);
                  if(vm.billObj.carrier1) {
                    var airCode = vm.billObj.carrier1.airCode || vm.billObj.carrier1;
                    getAirLineParams(airCode);
                  }
                } else {
                  Notification.error({
                    message: '未找到任何数据'
                  });
                  $state.go('index');
                }
              } else {
                Notification.error({
                  message: resp.msg
                });
              }
            });
        }
        /**
         * 显示根据运单的数据
         */
        function setAllData(data) {
          vm.currentBillNo = data.pAirWaybillInfo.waybillNo;
          vm.currentBillType = data.pAirWaybillInfo.type;
          setBaseData(data.pAirWaybillInfo);
          setSubBill(data.airWayBillInfoVos); //显示子运单
          setOtherFeeData(data.pWaybillRateDetails); //显示other fee
          setShcCode(data.pWaybillSpecialReferences); //显示SHC CODE
          setAlsoNotify(data.pAirWaybillInfo); //显示通知人
          setVol(data.pWaybillGoodsSizes); //显示尺寸
          setCert(data.pAirWaybillInfo.awId, '0'); //显示证书
          vm.billObj.originbillObj1 = angular.copy(vm.billObj);
          addDept({
            dept: data.pAirWaybillInfo.dept,
            dest1: data.pAirWaybillInfo.dest1,
            dest2: data.pAirWaybillInfo.dest2,
            dest3: data.pAirWaybillInfo.dest3,
            dest4: data.pAirWaybillInfo.dest4
          });
        }

        /**
         * 货物申报
         */
        function showCargoDeclaraction() {
        	if(vm.billObj.statusData.shipmentFlag==='1'){
        		return false
        	}
          var cargoDeclaractionDialog = $modal.open({
            template: require('../../pactl/agent/prejudice/apply/cargoDeclaraction.html'),
            controller: require('../../pactl/agent/prejudice/apply/cargoDeclaraction.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  title: '货物申报',
                  awId: vm.billObj.awId,
                  editAble: canDeclaractiontEdit(),
                  newData: vm.billObj.cargoDeclare.newData
                };
              }
            }
          });
          cargoDeclaractionDialog.result.then(function (data) {
            vm.billObj.cargoDeclare = data;
            vm.billObj.showCargoDeclare = data.newData;
          }, function (resp) {

          });
        }
        /**
         * 锂电池
         */
        function showBatteryDeclaraction() {
        	if(vm.billObj.statusData.shipmentFlag==='1'){
        		return false
        	}        	
          var airCode = "";
          if(vm.billObj.carrier1) {
            airCode = vm.billObj.carrier1.airCode || vm.billObj.carrier1;
          }
          var batteryDeclaractionDialog = $modal.open({
            template: require('../../pactl/agent/prejudice/apply/batteryDeclaraction.html'),
            controller: require('../../pactl/agent/prejudice/apply/batteryDeclaraction.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  title: '锂电池',
                  awId: vm.billObj.awId,
                  waybillNo: vm.billObj.waybillNo,
                  editAble: canDeclaractiontEdit(),
                  newData: vm.billObj.liBattery.newData,
                  airCode: airCode
                };
              }
            }
          });
          batteryDeclaractionDialog.result.then(function (data) {
            vm.billObj.liBattery = data;
            vm.billObj.showLiBattery = data.newData;
            vm.billObj.eliFlag = vm.billObj.showLiBattery.eli.flag === 'true'?'1':'0';
            vm.billObj.elmFlag = vm.billObj.showLiBattery.elm.flag === 'true'?'1':'0';
          }, function (resp) {

          });
        }

        /**
         * 货物申报和锂电池声明是否可以编辑
         */
        function canDeclaractiontEdit() {
          var aStatus = vm.billObj.statusData.aStatus,
            fstatus = vm.billObj.firstCheckData.fstatus;
          if (!vm.billObj.showCargoDeclare) {
            return false;
          }
          if (!vm.billObj.showCargoDeclare.cargoDeclare) {
            return false;
          }
          if (vm.billObj.showCargoDeclare.cargoDeclare.dangerFlag === '0' || vm.billObj.showCargoDeclare.cargoDeclare.dangerFlag === '3') {
            return false;
          }
          if ((aStatus === '200' && fstatus === '0' && vm.billObj.statusData.dataUpdateFlag === '0') || (aStatus === '201' || aStatus === '202')) {
            return true;
          } else {
            return false;
          }
        }


        /**
         * 货物申报和锂电池声明是否可以编辑
         */
        function canNameAddedEdit() {
          var aStatus = vm.billObj.statusData.aStatus,
            fstatus = vm.billObj.firstCheckData.fstatus;
          if (!vm.billObj.showCargoDeclare) {
            return false;
          }
          if (!vm.billObj.showCargoDeclare.cargoDeclare) {
            return false;
          }
          if ((aStatus === '200' && fstatus === '0' && vm.billObj.statusData.dataUpdateFlag === '0') || (aStatus === '201' || aStatus === '202')) {
            return true;
          } else {
            return false;
          }
        }

        /**
         * 分单锂电池选项 
         */
        function editELI(subBillObj) {
          if (!canDeclaractiontEdit()) {
            return;
          }
          if (subBillObj.eliFlag === "1") {
            subBillObj.eliFlag = "0";
          } else {
            subBillObj.eliFlag = "1";
          }
        }

        function editELM(subBillObj) {
          if (!canDeclaractiontEdit()) {
            return;
          }
          if (subBillObj.elmFlag === "1") {
            subBillObj.elmFlag = "0";
          } else {
            subBillObj.elmFlag = "1";
          }
        }

        /**
         * 磁检证书的却换
         */
        function ckEleStatus(param, value) {
          if(vm.billObj.statusData.dataUpdateFlag === '0') {
            param.ckElectricFlag = value;
          }
        }

        /**
         * 主单、分单的品名补充
         */
        function nameAadded(param) {
          var goodsNameEn = '';
          if (param.type === '0') {
            goodsNameEn = param.goodsNameEn;
          } else {
            goodsNameEn = param.remark;
          }
          var nameAaddedDialog = $modal.open({
            template: require('../../pactl/agent/prejudice/apply/nameAaddedDialog.html'),
            controller: require('../../pactl/agent/prejudice/apply/nameAaddedDialog.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  obj: {
                    waybillNo: param.waybillNo,
                    goodsNameEn: goodsNameEn,
                    goodsNameCn: param.goodsNameCn,
                    goodsRemarks: param.goodsRemarks,
                    editAble: canNameAddedEdit(),
                    wbEle: param.wbEle
                  }
                };
              }
            }
          });
          nameAaddedDialog.result.then(function (data) {
            if (param.type === '0') {
              param.goodsNameEn = data.goodsNameEn;
            } else {
              param.remark = data.goodsNameEn;
            }
            param.goodsNameCn = data.goodsNameCn;
            param.goodsRemarks = data.goodsRemarks;
            param.div = '<div class="pre-name">' + (data.goodsNameEn ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + data.goodsNameEn + '</div></div>' : '') + (data.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + data.goodsNameCn + '</div></div>' : '') + (data.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + data.goodsRemarks + '</pre></div>' : '') + '</div>';
          }, function (resp) {

          });
        }

        /**
         *点击选择，弹出品名列表供用户点击选择
         */
        function selectName(param) {
          var selectNameDialog = $modal.open({
            template: require('../../pactl/agent/waybill/newBill/selectNameDialog.html'),
            controller: require('../../pactl/agent/waybill/newBill/selectNameDialog.ctrl.js'),
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

        function addDept(params) {
          if (params.dept) {
            restAPI.airData.getDataByCode.save({}, params.dept)
              .$promise.then(function (resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.billObj.originbillObj1.dept = airportData;
                }
              });
          }
          if (params.dest1) {
            restAPI.airData.getDataByCode.save({}, params.dest1)
              .$promise.then(function (resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.billObj.originbillObj1.dest1 = airportData;
                }
              });
          }
          if (params.dest2) {
            restAPI.airData.getDataByCode.save({}, params.dest2)
              .$promise.then(function (resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.billObj.originbillObj1.dest2 = airportData;
                }
              });
          }
          if (params.dest3) {
            restAPI.airData.getDataByCode.save({}, params.dest3)
              .$promise.then(function (resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.billObj.originbillObj1.dest3 = airportData;
                }
              });
          }
          if (params.dest4) {
            restAPI.airData.getDataByCode.save({}, params.dest4)
              .$promise.then(function (resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.billObj.originbillObj1.dest4 = airportData;
                }
              });
          }
        }

        function setCertData(awId, type,wcdId) {
          if(wcdId) {
            var applyCertData = [];
            angular.forEach(vm.applyCertData, function (m, n) {
              if (m.wcdId !== wcdId) {
                applyCertData.push(m);
              }
            });
            vm.applyCertData = applyCertData;
          }
          if(vm.showSubBill) {
            if(awId !== vm.subBillObj.awId) {
              return false;
            }
          } else {
            if(awId !== vm.billObj.awId) {
              return false;
            }
          }
          var book = 0;
          var books = [];
          var applyCertData = angular.copy(vm.applyCertData);
          if(applyCertData && applyCertData.length>0) {
            angular.forEach(applyCertData, function (m, n) {
              if(m.book.awId === awId) {
                book += 1;
                books.push(m);
              }
            });
          }
          if (type === '0') {
            vm.billObj.applyBookData = books;
          } else {
            vm.subBillObj.applyBookData = books;
          }
        }

        /**
         * 显示证书
         */
        function setCert(awId, type) {
          if(vm.showSubBill) {
            if(awId !== vm.subBillObj.awId) {
              return false;
            }
          } else {
            if(awId !== vm.billObj.awId) {
              return false;
            }
          }
          restAPI.dataEdit.booksCount.save({}, {
              awId: awId
            })
            .$promise.then(function (resp) {
              if (resp.ok) {
                if (type === '0') {
                  vm.masterCertData = resp.data;
                  vm.billObj.certData = {};
                } else {
                  vm.subBillObj.subCertData = resp.data;
                  vm.subBillObj.certData = {};
                }
                
                setCertData(awId,type);
              } else {
                Notification.error({
                  message: resp.msg
                });
              }
            });
        }
        /**
         * 显示主运单基本信息
         * 
         */
        function setBaseData(baseData) {
          vm.billObj.wbEle = baseData.wbEle;
          vm.billObj.type = baseData.type;
          vm.billObj.waybillNo = baseData.waybillNo;
          vm.billObj.awId = baseData.awId;
          vm.billObj.agentOprn = baseData.agentOprn;
          vm.billObj.agentSales = baseData.agentSales;
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
          vm.billObj.agentCassAddress = baseData.agentCassAddress;
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
          vm.billObj.goodsNameEn = baseData.goodsNameEn;
          vm.billObj.goodsNameCn = baseData.goodsNameCn;
          vm.billObj.goodsRemarks = baseData.goodsRemarks;
          vm.billObj.ckElectricFlag = baseData.ckElectricFlag;
          vm.billObj.div = '<div class="pre-name">' + (baseData.goodsNameEn ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + baseData.goodsNameEn + '</div></div>' : '') + (baseData.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + baseData.goodsNameCn + '</div></div>' : '') + (baseData.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + baseData.goodsRemarks + '</pre></div>' : '') + '</div>';
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
            });
          });
          vm.billObj.pWaybillRateDetails = vm.otherFeeData;
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
          vm.billObj.pWaybillSpecialReferences = vm.specialData;
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
          vm.billObj.pWaybillGoodsSize = vm.volData;
        }
        /**
         * 显示子运单
         * 
         * @param {any} params
         */
        function setSubBill(params) {
          vm.billObj.newSubBillObj = params || [];
          vm.showMasterCert = vm.billObj.newSubBillObj.length === 0;
        }
        $scope.$on('refreshSub', function (event, data) {
          setSubBill();
        });
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
         * 保存人名
         * 
         * @param {any} type1 收货人0 发货人1 通知人2
         * @param {any} type2 主单0 分单1
         * 
         */
        function saveUser(type1, type2) {
          var obj = getSaveUserData(type1, type2);
          var addPeoplDialog = $modal.open({
            template: require('../../pactl/agent/option/people/addPeople.html'),
            controller: require('../../pactl/agent/option/people/addPeople.ctrl.js'),
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
            template: require('../../pactl/agent/waybill/newBill/searchName.html'),
            controller: require('../../pactl/agent/waybill/newBill/searchName.ctrl.js'),
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
          vm.billObj.totalAgent = data1.toFixed(3) || undefined;
          vm.billObj.totalAgent2 = data2.toFixed(3) || undefined;
          vm.billObj.totalCarrier = data3.toFixed(3) || undefined;
          vm.billObj.totalCarrier2 = data4.toFixed(3) || undefined;
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
            template: require('../../pactl/agent/waybill/holdCode/holdCode.html'),
            controller: require('../../pactl/agent/waybill/holdCode/holdCode.ctrl.js'),
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
            vm.billObj.pWaybillSpecialReferences = vm.specialData = [];
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
         * 航班二是否可用
         */
        function fltDateAble() {
          if (vm.billObj.flightNo && vm.billObj.fltDate) {
            return false;
          } else {
            vm.billObj.flightNo2 = '';
            vm.billObj.fltDate2 = '';
            return true;
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
         * 显示主运单信息
         * 
         */
        function chooseMaster(type) {
          if (vm.currentBillNo === vm.billObj.waybillNo && vm.currentBillType === vm.billObj.type) {
            return false;
          }
          // 直接保存分单
          if (type === 'noSave') {
            selectMasterBill();
          } else {
            saveMasterSubbill();
          }
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
          vm.index !== undefined && vm.billObj.newSubBillObj.splice(vm.index, 1, obj);
          selectMasterBill();
        }
        /**
         * 切换到主单
         */
        function selectMasterBill() {
          delete vm.index;
          vm.billObj.nowSubIndex = '';
          vm.showSubBill = false;
          vm.currentBillNo = vm.billObj.waybillNo;
          vm.currentBillType = vm.billObj.type;
        }
        /**
         * 选择子运单
         */
        function chooseBill(data, index) {
          if (vm.currentBillNo === data.pAirWaybillInfo.waybillNo && vm.currentBillType === data.pAirWaybillInfo.type) {
            return false;
          }
          vm.clickSub = 'now';
          if (vm.index !== undefined) {
            // 保存当前分单
            saveCurrentSubbill(data, index);
          } else {
            // 保存主单
            saveCurrentBill(data, index);
          }
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
          vm.index !== undefined && vm.billObj.newSubBillObj.splice(vm.index, 1, obj);
          selectSubbill(data, index);
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
          return {
            pAirWaybillInfo: obj,
            pWaybillGoodsSizes: [],
            pWaybillRateDetails: [],
            pWaybillSpecialReferences: []
          };
        }
        /**
         * 切换分单
         * 
         * @param {any} params
         * */
        function selectSubbill(data, index) {
          vm.showSubBill = true;
          vm.index = index;
          vm.billObj.nowSubIndex = vm.index;
          data.showLeftSub = true;
          showSubBillDetail(data);
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
          selectSubbill(data, index);
        }
        /**
         * 显示子运单的信息
         */
        function showSubBillDetail(data) {
          var baseData = data.pAirWaybillInfo;
          vm.billObj.nowSubBill = vm.subBillObj = {};
          vm.currentBillNo = baseData.waybillNo;
          vm.currentBillType = baseData.type;
          vm.subBillObj.refStatus = baseData.refStatus;
          vm.subBillObj.wbEle = baseData.wbEle;
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
                  vm.clickSub = 'past';
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
                  vm.clickSub = 'past';
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
          vm.subBillObj.commodityCodes = baseData.commodityCodes;
          if (!baseData.certData) {
            setCert(vm.subBillObj.awId, '1');
          } else {
            vm.subBillObj.subCertData = baseData.subCertData;
            vm.subBillObj.certData = baseData.certData;
            setCertData(vm.subBillObj.awId, '1');
          }
          vm.subBillObj.eliFlag = baseData.eliFlag;
          vm.subBillObj.elmFlag = baseData.elmFlag;
          vm.subBillObj.remark = baseData.remark;
          vm.subBillObj.goodsNameCn = baseData.goodsNameCn;
          vm.subBillObj.goodsRemarks = baseData.goodsRemarks;
          vm.subBillObj.ckElectricFlag = baseData.ckElectricFlag;
          vm.subBillObj.div = '<div class="pre-name">' + (baseData.remark ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + baseData.remark + '</div></div>' : '') + (baseData.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + baseData.goodsNameCn + '</div></div>' : '') + (baseData.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + baseData.goodsRemarks + '</pre></div>' : '') + '</div>';
        }

        /**
         * 校验是否可以拉下
         * 收单完成时 wstatus= '301'，代理如果需要拉上或者拉下分单，代理需要进入修改页面进行拉下或者拉上；
         * @param {any} params
         */
        function canPull(params, type) {
          if (type === 'down') {
            if (vm.billObj.statusData.messageFlag !== '1') {
              return false;
            }
            if (!vm.billObj.showCargoDeclare) {
              return false;
            }
            if (!vm.billObj.showCargoDeclare.cargoDeclare) {
              return false;
            }
            if (vm.billObj.showCargoDeclare.cargoDeclare.dangerFlag === '0' || vm.billObj.showCargoDeclare.cargoDeclare.dangerFlag === '3') {
              return false;
            }
            if (isCommited()) {
              return false;
            }
            if (params.pAirWaybillInfo.refStatus !== '1' && (vm.billObj.statusData.wStatus === '101' || vm.billObj.statusData.wStatus === '301' || vm.billObj.statusData.wStatus === '302') && !isRefStatusPositive(params.pAirWaybillInfo.awId)) {
              return true;
            } else {
              return false;
            }
          } else if (type === 'up') {
            if (vm.billObj.statusData.messageFlag !== '1') {
              return false;
            }
             if (!vm.billObj.showCargoDeclare) {
              return false;
            }
            if (!vm.billObj.showCargoDeclare.cargoDeclare) {
              return false;
            }
            if (vm.billObj.showCargoDeclare.cargoDeclare.dangerFlag === '0' || vm.billObj.showCargoDeclare.cargoDeclare.dangerFlag === '3') {
              return false;
            }
            if (isCommited()) {
              return false;
            }
            if (params.pAirWaybillInfo.refStatus === '1' && (vm.billObj.statusData.wStatus === '101' || vm.billObj.statusData.wStatus === '301' || vm.billObj.statusData.wStatus === '302') && isRefStatusPositive(params.pAirWaybillInfo.awId)) {
              return true;
            } else {
              return false;
            }
          }
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
         * Also notify
         */
        function alsoNotify() {
          var alsoNotifyDialog = $modal.open({
            template: require('../../pactl/agent/waybill/alsoNotify/alsoNotify.html'),
            controller: require('../../pactl/agent/waybill/alsoNotify/alsoNotify.ctrl.js'),
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
            template: require('../../pactl/agent/waybill/vol/vol.html'),
            controller: require('../../pactl/agent/waybill/vol/vol.ctrl.js'),
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
            vm.billObj.pWaybillGoodsSize = vm.volData = [];
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
         * 获取运单当前是不是已经被拉下
         */
        function isRefStatusPositive(awId) {
          if (!vm.billObj.oldData || vm.billObj.oldData.length == 0) {
            return false;
          }
          var dataIndex = -1;
          angular.forEach(vm.billObj.oldData, function (v, k) {
            if (v.difference.awId === awId && v.difference.diffClass === 'field' && v.difference.diffField === 'refStatus' && v.difference.newValue === '1') {
              dataIndex = k;
            }
          });
          if (dataIndex >= 0) {
            return true;
          } else {
            return false;
          }
        }
        /**
         * 获取运单当前是不是已经被拉下
         */
        function isRefStatusPositive(awId) {
          if (!vm.billObj.oldData || vm.billObj.oldData.length == 0) {
            return false;
          }
          var dataIndex = -1;
          angular.forEach(vm.billObj.oldData, function (v, k) {
            if (v.difference.awId === awId && v.difference.diffClass === 'field' && v.difference.diffField === 'refStatus' && v.difference.newValue === '1') {
              dataIndex = k;
            }
          });
          if (dataIndex >= 0) {
            return true;
          } else {
            return false;
          }
        }
        /**
         * 获取数据修改申请是否已经提交
         */
        function isCommited() {
          if (!vm.billObj.oldData || vm.billObj.oldData.length == 0) {
            return false;
          }
          var isCommit = false;
          angular.forEach(vm.billObj.oldData, function (v, k) {
            if (v.difference.commitFlag === '1') {
              isCommit = true;
            }
          });
          return isCommit;
        }
        /**
         * 拉上拉下的修改
         * 
         * @param {any} params 
        
         * 
         */
        function addRefStatusData(text, newVal, oldVal, billNo) {
          var subData = [],
            dataIndex = -1;
          angular.forEach(vm.billObj.subData, function (v, k) {
            subData.push({
              billNo: v.billNo,
              diffField: v.difference.diffField
            });
            if (v.billNo === billNo && dataIndex === -1) {
              dataIndex = k;
            }
          });
          var index = -1;
          for (var i = 0; i < subData.length; i++) {
            var element = subData[i];
            if (element.billNo === billNo && element.diffField === text) {
              index = i;
              break;
            }
          }
          var data = {
            billNo: billNo,
            difference: {
              diffField: text,
              newValue: newVal || '',
              oldValue: oldVal || ''
            }
          };
          if (index > -1) {
            vm.billObj.subData.splice(index, 1, data);
          } else {
            if (dataIndex > -1) {
              vm.billObj.subData.splice(dataIndex, 0, data);
            } else {
              vm.billObj.subData.push(data);
            }
          }
        }
        /**
         * 拉下
         * 
         * 
         * 
         * @param {any} params
         * @param {any} index
         */
        function pullDown(params, index, $e) {
          $e.stopPropagation();
          var arr = [];
          angular.forEach(vm.billObj.newSubBillObj, function (v, k) {
            if (v.pAirWaybillInfo.refStatus !== '1') {
              arr.push(v.pAirWaybillInfo.waybillNo);
            }
          });
          if (arr.length === 1) {
            Notification.warning({
              message: '最后一个分单不能被拉下。'
            });
            return false;
          }
          var oldVal = params.pAirWaybillInfo.refStatus,
            billNo = params.pAirWaybillInfo.waybillNo,
            newVal = '1';
          params.pAirWaybillInfo.refStatus = newVal;
          if (vm.index === index) {
            vm.subBillObj.refStatus = params.pAirWaybillInfo.refStatus;
          }
          addRefStatusData('refStatus', newVal, oldVal, billNo);
        }
        /**
         * 测试编辑框能否触发函数
         * 
         * /**
     * 只能输入大写和特殊字符
     */
        function changeXiang(text){
        	 try{
        	vm.billObj.goodsDesc = vm.billObj.goodsDesc.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').replace(/\t/g, ' ').toUpperCase();
        }catch(error){
        	return
        }
        	 }
        /**
         * 拉上
         * 
         * @param {any} params
         * @param {any} index
         */
        function pullUp(params, index, $e) {
          $e.stopPropagation();
          var oldVal = params.pAirWaybillInfo.refStatus,
            billNo = params.pAirWaybillInfo.waybillNo,
            newVal = '0';
          params.pAirWaybillInfo.refStatus = newVal;
          if (vm.index === index) {
            vm.subBillObj.refStatus = params.pAirWaybillInfo.refStatus;
          }
          addRefStatusData('refStatus', newVal, oldVal, billNo);
        }
        /**
         * 证书是否可以编辑
         */
        function canCertEdit() {
          var aStatus = vm.billObj.statusData.aStatus,
            fstatus = vm.billObj.firstCheckData.fstatus;
          if (((aStatus === '200' && fstatus === '0') || (aStatus === '202')) && vm.billObj.statusData.dataUpdateFlag === '0') {
            return true;
          } else {
            return false;
          }
        }

        function canSubCertEdit(param) {
          var aStatus = vm.billObj.statusData.aStatus,
            fstatus = vm.billObj.firstCheckData.fstatus,
            wstatus = vm.billObj.statusData.wStatus;
          if (aStatus === '201' && (wstatus === '101' || wstatus === '302') && vm.billObj.statusData.dataUpdateFlag === '0') {
            return true;
          } else {
            return false;
          }
        }

        function canOtherCertEdit() {
          var aStatus = vm.billObj.statusData.aStatus,
            fstatus = vm.billObj.firstCheckData.fstatus;
          if (((aStatus === '200' && fstatus === '0') || (aStatus === '201' || aStatus === '202')) && vm.billObj.statusData.dataUpdateFlag === '0' ) {
            return true;
          } else {
            return false;
          }
        }
        /**
         * 证书显示
         */
        function searchBook(param, type, type1) {
          if (type === 'other') {
            var canEdit = canOtherCertEdit();
            showOtherBook(param, type, type1, canEdit);
          } else {
            var canEdit = canCertEdit();
            if(type1 === '0') {
              canEdit = canEdit && vm.showMasterCert;
            }
            var canSubCertEditFlag = false;
            if(type1 === '1') {
              canSubCertEditFlag = canSubCertEdit(param);
            }
            showBook(param, type, type1, canEdit,canSubCertEditFlag);
          }
        }
        /**
         * 显示其他文档
         * 
         */
        function showOtherBook(awId, type, type1, canEdit) {
          var originCertData, oldCertData;
          if (type1 === '0') {
            originCertData = vm.billObj.certData[type];
            oldCertData = vm.billObj.certData[type + 'Old'];
          } else if (type1 === '1') {
            originCertData = vm.subBillObj.certData[type];
            oldCertData = vm.subBillObj.certData[type + 'Old'];
          }
          var otherBookDialog = $modal.open({
            template: require('./otherBook.html'),
            controller: require('./otherBook.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  title: '其他文档',
                  certData: originCertData,
                  oldCertData: oldCertData,
                  obj: {
                    awId: awId,
                    bookType: type,
                    canEdit: canEdit,
                    fstatus: vm.billObj.firstCheckData.fstatus
                  }
                };
              }
            }
          });
          otherBookDialog.result.then(function (data) {
            if (type1 === '0') {
              vm.billObj.certData[type] = data.certData;
              vm.billObj.certData[type + 'Old'] = data.oldCertData;
              vm.masterCertData[type] = data.certData.length;
              addToMasterCertData(type);
            } else if (type1 === '1') {
              vm.subBillObj.certData[type] = data.certData;
              vm.subBillObj.certData[type + 'Old'] = data.oldCertData;
              vm.subBillObj.subCertData[type] = data.certData.length;
              addToSubCertData(type);
            }
          }, function (resp) {

          });
        }
        /**
         * 显示证书
         * 
         * @param {any} awId
         * @param {any} type 证书的类型
         * @param {any} type1 主分单   主0    分1
         */
        function showBook(awId, type, type1, canEdit,canSubCertEditFlag) {
          var originCertData, oldCertData, applyBookData;
          var book = 0;
          var books = [];
          var applyCertData = angular.copy(vm.applyCertData);
          if(applyCertData && applyCertData.length>0) {
            angular.forEach(applyCertData, function (m, n) {
              if(m.book.awId === awId) {
                book += 1;
                books.push(m);
              }
            });
          }
          if (type1 === '0') {
            vm.billObj.applyBookData = books;
          } else {
            vm.subBillObj.applyBookData = books;
          }
          if (type1 === '0') {
            originCertData = vm.billObj.certData[type];
            oldCertData = vm.billObj.certData[type + 'Old'];
            applyBookData = vm.billObj.applyBookData;
          } else if (type1 === '1') {
            originCertData = vm.subBillObj.certData[type];
            oldCertData = vm.subBillObj.certData[type + 'Old'];
            applyBookData = vm.subBillObj.applyBookData;
          }
          var bookDialog = $modal.open({
            template: require('./book.html'),
            controller: require('./book.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  title: '证书',
                  certData: originCertData, //所有的证书
                  oldCertData: oldCertData, //删除的证书
                  applyBookData: applyBookData,//差异中的证书
                  obj: {
                    awId: awId,
                    bookType: type,
                    canEdit: canEdit,
                    fstatus: vm.billObj.firstCheckData.fstatus,
                    agentOprnId: vm.billObj.originbillObj.pAirWaybillInfo.agentOprnId,
                    carrier1: vm.billObj.carrier1.airCode,
                    canSubCertEdit : canSubCertEditFlag,
                    masterAwId : vm.billObj.awId
                  }
                };
              }
            }
          });
          bookDialog.result.then(function (data) {
            if (type1 === '0') {
              vm.billObj.certData[type] = data.certData;
              vm.billObj.certData[type + 'Old'] = data.oldCertData;
              vm.masterCertData[type] = data.certData.length;
              addToMasterCertData(type);
            } else if (type1 === '1') {
              vm.subBillObj.certData[type] = data.certData;
              vm.subBillObj.certData[type + 'Old'] = data.oldCertData;
              vm.subBillObj.subCertData[type] = data.certData.length;
              addToSubCertData(type);
            }
          }, function (resp) {

          });
        }
        /**
         * 关键字段是否可以修改--主单
         * 
         * @param {any} text
         */
        function isDisable(text) {
          if (vm.billObj.wbEle === '1') {
            return true;
          }
          if (vm.billObj.statusData.dataUpdateFlag === '1' && vm.billObj.masterKeyData.indexOf(text) > -1) {
            return true;
          } else {
            var wStatus = vm.billObj.statusData.wStatus,
              aStatus = vm.billObj.statusData.aStatus;
            if ((wStatus === '100' || wStatus === '101') && (aStatus === '210' || aStatus === '211') && vm.billObj.masterKeyData.indexOf(text) > -1) {
              return true;
            } else {
              return false;
            }
          }
        }
        /**
         * 关键字段是否可以修改--分单
         * 
         * @param {any} text
         */
        function isDisable2(text) {
          if (vm.subBillObj.wbEle === '1') {
            return true;
          }
          if (vm.billObj.statusData.dataUpdateFlag === '1' && vm.billObj.subKeyData.indexOf(text) > -1) {
            return true;
          } else {
            var wStatus = vm.billObj.statusData.wStatus,
              aStatus = vm.billObj.statusData.aStatus;
            if ((wStatus === '100' || wStatus === '101') && (aStatus === '210' || aStatus === '211') && vm.billObj.subKeyData.indexOf(text) > -1) {
              return true;
            } else {
              return false;
            }
          }
        }
        /**
         * 是否能添加其他文档
         */
        function showOther() {
          var fStatus = vm.billObj.statusData.fStatus,
            aStatus = vm.billObj.statusData.aStatus;
          if (fStatus === 0) {
            return false;
          } else if (aStatus === '201' || aStatus === '202') {
            return true;
          } else if (fStatus === "1") {
            return true;
          }
        }

        /**
         * 
         */
        function showCkElectricFlag(type) {
          var fStatus = vm.billObj.statusData.fStatus,
            aStatus = vm.billObj.statusData.aStatus;
          if(!vm.billObj.waybillNo) {
            return false;
          }
          if (aStatus === '201') {
            if(type === '0') {
              return vm.billObj.newSubBillObj.length === 0;
            } else {
              return true;
            }
          } else {
            return false;
          }
        }
        /**
         * 关键字段是否可以修改--主单
         * 
         * @param {any} text
         */
        function isDisable3() {
          if (vm.billObj.wbEle === '1') {
            return true;
          }
        }

        /**
         * 添加货物申报的修改
         */
        function addToCargoDeclare(params) {

        }

        /**
         * 添加锂电池声明的修改
         */
        function addToLiBattery(params) {

        }
        /**
         * 主单证书的修改
         */
        function addToMasterCertData(type) {
          var diffField = "";
          if (type === "other") {
            diffField = "添加其它证书";
          } else if (type === "book") {
            diffField = "添加证书关联";
          }
          var params = vm.billObj.certData;
          var data = [];
          if (!params) {
            return data;
          }
          angular.forEach(vm.billObj.masterData, function (v, k) {
            if (v.difference.diffField !== diffField) {
              data.push(v);
            }
            if (v.difference.diffField === diffField && v.type !== type) {
              data.push(v);
            }
          });
          var data1 = angular.copy(vm.billObj.certData[type]),
            data2 = angular.copy(vm.billObj.certData[type + 'Old']),
            data1Arr = [];
          angular.forEach(data1, function (v, k) {
            if (v.originType === '1') {
              data1Arr.push(v.book.id);
            }
            if (v.originType === '2') {
              data.push({
                billNo: vm.billObj.waybillNo,
                difference: {
                  diffField: diffField,
                  oldValue: '',
                  newValue: v.fileHttpPath,
                  reviewResult: ''
                },
                type: type,
                book: v,
                srcArr: v.srcArr
              });
            }
          });
          angular.forEach(data2, function (v, k) {
            if (data1Arr.indexOf(v.book.id) < 0) {
              data.push({
                billNo: vm.billObj.waybillNo,
                difference: {
                  diffField: diffField,
                  oldValue: v.fileHttpPath,
                  newValue: '',
                  reviewResult: ''
                },
                type: type,
                book: v.book,
                srcArr: v.srcArr
              });
            }
          });
          vm.billObj.masterData = data;
        }
        /**
         * 分单证书的修改
         */
        function addToSubCertData(type) {
          var diffField = "";
          if (type === "other") {
            diffField = "添加其它证书";
          } else if (type === "book") {
            diffField = "添加证书关联";
          }
          var params = vm.subBillObj.certData;
          var data = [];
          if (!params) {
            return data;
          }
          var currentSubData = [];
          angular.forEach(vm.billObj.subData, function (v, k) {
            if (v.billNo === vm.currentBillNo) {
              if (v.difference.diffField !== diffField) {
                currentSubData.push(v);
              }
              if (v.difference.diffField === diffField && v.type !== type) {
                currentSubData.push(v);
              }
            } else {
              data.push(v);
            }
          });
          var data1 = angular.copy(vm.subBillObj.certData[type]), //操作后的数据
            data2 = angular.copy(vm.subBillObj.certData[type + 'Old']), //原来的数据
            data1Arr = [];
          angular.forEach(data1, function (v, k) {
            if (v.originType === '1') {
              data1Arr.push(v.book.id);
            }
            if (v.originType === '2') {
              currentSubData.push({
                billNo: vm.subBillObj.waybillNo,
                difference: {
                  diffField: diffField,
                  oldValue: '',
                  newValue: v.fileHttpPath,
                  reviewResult: ''
                },
                type: type,
                book: v,
                srcArr: v.srcArr
              });
            }
          });
          angular.forEach(data2, function (v, k) {
            if (data1Arr.indexOf(v.book.id) < 0) {
              currentSubData.push({
                billNo: vm.subBillObj.waybillNo,
                difference: {
                  diffField: diffField,
                  oldValue: v.fileHttpPath,
                  newValue: '',
                  reviewResult: ''
                },
                type: type,
                book: v.book,
                srcArr: v.srcArr
              });
            }
          });
          Array.prototype.push.apply(data, currentSubData);
          vm.billObj.subData = data;
        }
        /**
         * 计算total
         */
        function countTotal() {
          vm.billObj.totalCount = (+vm.billObj.rateCharge * +vm.billObj.chargeWeight).toFixed(3) + '';
          selectWT();
        }
        /**
         * GrossWeight
         */
        function blurGrossWeight() {
          var index = vm.errorData.indexOf('grossWeight');
          var element1 = angular.element('[name=m_chargeWeight]');
          var element = angular.element('[name=m_grossWeight]');
          if (vm.billObj['chargeWeight']) {
            if (+vm.billObj['grossWeight'] > +vm.billObj['chargeWeight']) {
              Notification.error({
                message: '重量大于计费重量'
              });
              if (index < 0) {
                vm.errorData.push('grossWeight');
                element.addClass('error');
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
              element.removeClass('error');
              element1.removeClass('error');
            }
          }
        }
        /**
         * ChargeWeight
         */
        function blurChargeWeight() {
          var index = vm.errorData.indexOf('chargeWeight');
          var element1 = angular.element('[name=m_grossWeight]');
          var element = angular.element('[name=m_chargeWeight]');
          if (vm.billObj['grossWeight']) {
            if (+vm.billObj['grossWeight'] > +vm.billObj['chargeWeight']) {
              Notification.error({
                message: '重量大于计费重量'
              });
              if (index < 0) {
                vm.errorData.push('chargeWeight');
                element.addClass('error');
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
              element.removeClass('error');
              element1.removeClass('error');
            }
          }
        }

        function showSubDest1(params) {
          if (angular.isObject(params)) {
            return params.airportCode;
          } else {
            return params;
          }
        }
        var timer1 = $interval(function () {
          var subGrossWeight = 0;
          var subRcpNo = 0;
          var subSlac = 0;
          angular.forEach(vm.billObj.newSubBillObj, function (v, k) {
            subGrossWeight += +(v.pAirWaybillInfo.grossWeight || 0);
            subRcpNo += +(v.pAirWaybillInfo.rcpNo || 0);
            subSlac += +(v.pAirWaybillInfo.slac || 0);
          });
          vm.showText.subRcpNo = subRcpNo;
          vm.showText.subSlac = subSlac;
          vm.showText.subGrossWeight = subGrossWeight;
        }, 1000);
        $scope.$on('$destroy', function () {
          $interval.cancel(timer1);
        });
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
          angular.forEach(vm.billObj.newSubBillObj, function (v, k) {
            v.showLeftSub = vm.showAllSubInfo;
          });
        }
        /**
         * 删除关联
         */
        function disConnect(param, index, $e) {
          $e.stopPropagation();
          var delDialog = $modal.open({
            template: require('../../pactl/remove/remove.html'),
            controller: require('../../pactl/remove/remove.ctrl.js'),
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
                  vm.billObj.newSubBillObj.splice(index, 1);
                  if (param.pAirWaybillInfo.waybillNo === vm.currentBillNo) {
                    chooseMaster();
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
      }],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        var white = '#fff',
          blue = '#daf0fe',
          yellow = '#fff7e4',
          color = 'background-color',
          transparent = 'transparent',
          errClass = 'error',
          reg1 = /[^0-9]/g,
          reg1_ = /[0-9]/g,
          reg2 = /([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,
          reg2_ = /[^\u4E00-\u9FA5\uFE30-\uFFA0]/g,
          reg3 = /[^a-zA-Z0-9]/g,
          reg3_ = /[a-zA-Z0-9]/g,
          reg4 = /[^0-9\-]/g,
          reg4_ = /[0-9\-]/g,
          reg5 = /[^a-zA-Z0-9\.]/g,
          reg5_ = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NVD$)/g,
          reg6_ = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^NCV$)/g,
          reg7_ = /^[A-Z\d]{2}(\d{3,4}|\d{4}[A-Z]{0,1})$/g,
          reg8_ = /^\d{4}-\d{2}-\d{2}$/g,
          reg9_ = /(^[0-9]{1,8}(([.]{1}[0-9]{1,3})?|[0-9]{1,3})$|^XXX$)/g,
          reg10 = /[^a-zA-Z0-9\/\s,]/g,
          reg10_ = /[a-zA-Z0-9\/\s,]/g,
          reg11 = /[^0-9\.]/g,
          reg11_ = /^[0-9]{1,5}(([.]{1}[0-9]{1})?|[0-9]{1,2})$/g,
          reg12_ = /^[0-9]{1,5}(((.5){1})?|[0-9]{1,2})$/g,
          reg13_ = /^[0-9]{1,8}(([.]{1}[0-9]{1,4})?)$/g,
          reg14_ = /^[0-9]{1,10}(([.]{1}[0-9]{1,3})?|[0-9]{1,2})$/g,
          reg15_ = /^[0-9]{1,5}(([.]{1}[0-9]{1,2})?|[0-9]{1,2})$/g,
          reg16_ = /[0-9\.]/g,
          reg17_ = /^[0-9]{1,9}(([.]{1}[0-9]{1,6})?|[0-9]{1,2})$/g,
          reg18 = /[^0-9\/]/g,
          reg18_ = /^([0-9]{6,18}\/{1}){0,8}[0-9]{6,18}$/g,
          reg19 = /./g,
          reg19_ = /[^.]/g;
        /**
         * 计算Total Prepaid
         */
        function countPrepaid() {
          var data1 = +scope.billObj.prepaid || 0;
          var data2 = +scope.billObj.valuationCharge || 0;
          var data3 = +scope.billObj.tax || 0;
          var data4 = +scope.billObj.totalAgent || 0;
          var data5 = +scope.billObj.totalCarrier || 0;
          var data6 = +scope.billObj.collect || 0;
          var data7 = +scope.billObj.valuationCharge2 || 0;
          var data8 = +scope.billObj.tax2 || 0;
          var data9 = +scope.billObj.totalAgent2 || 0;
          var data10 = +scope.billObj.totalCarrier2 || 0;
          scope.billObj.totalPrepaid = (data1 + data2 + data3 + data4 + data5).toFixed(2);
          scope.billObj.totalCollect = (data6 + data7 + data8 + data9 + data10).toFixed(2);
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
        var pos, length;
        /**
         * 数据校验
         * 
         * @param {any} text 改变的字段
         * @param {any} val1 新值
         * @param {any} val2 旧值
         * @param {any} reg 正则
         * @returns
         */
        function doChange(text, val1, val2, reg, reg_, notToUpperCase) {
          var pAirWaybillInfo = scope.originbillObj.pAirWaybillInfo;
          var element = angular.element('[name=m_' + text + ']');
          var ele = element[0];
          if (document.activeElement !== ele && text !== "goodsNameEn" && text !== "goodsNameCn" && text !== "goodsRemarks" && text !== 'ckElectricFlag') return;
          if (angular.isDefined(length) && angular.isDefined(pos) && text !== "goodsNameEn" && text !== "goodsNameCn" && text !== "goodsRemarks" && text !== 'ckElectricFlag') {
            return;
          }
          if (pAirWaybillInfo) {
            var data = pAirWaybillInfo[text];
            if (val1 != data) {
              try {
                if (text === 'ssr' || text === 'osi1') {
                  val1 = val1.substring(0, ele.getAttribute('maxlength'));
                }
                if (!notToUpperCase) {
                  val1 = val1.replace(reg, '').toUpperCase();
                }
              } catch (error) {
                scope.billObj[text] = val2;
                return;
              }
              if (text === 'chargeWeight' || text === 'grossWeight') {
                scope.billObj[text] = val1;
              } else {
                pos = getCursorPos(ele);
                length = scope.billObj[text].length;
                scope.billObj[text] = val1;
                var length1 = scope.billObj[text].length;
                if (length === length1) {
                  doText(ele, pos);
                } else {
                  doText(ele, pos - (length - length1));
                }
                ele.blur();
              }
              var index1 = scope.errorData.indexOf(text);
              if (reg_.test(val1)) {
                if (index1 > -1) {
                  scope.errorData.splice(index1, 1);
                  element.removeClass(errClass);
                }
                if (text === 'totalCount') {
                  scope.selectWT();
                } else if (text === 'valuationCharge' || text === 'tax' || text === 'valuationCharge2' || text === 'tax2') {
                  countPrepaid();
                }
                if (text === 'chargeWeight') {
                  if (scope.billObj.rateCharge) {
                    scope.countTotal();
                  }
                }
                if (text === 'rateCharge') {
                  if (scope.billObj.chargeWeight) {
                    scope.countTotal();
                  }
                }
                if (text === 'flightNo') {
                  index1 = scope.errorData.indexOf(text);
                  if (scope.billObj.carrier1.airCode === scope.billObj[text].substr(0, 2)) {
                    if (index1 > -1) {
                      scope.errorData.splice(index1, 1);
                      element.removeClass(errClass);
                    }
                  } else {
                    if (index1 < 0) {
                      scope.errorData.push(text);
                      element.addClass(errClass);
                    }
                  }
                }
              } else {
                if ($.trim(scope.billObj[text]) !== '') {
                  if (index1 < 0) {
                    scope.errorData.push(text);
                    element.addClass(errClass);
                  }
                }
              }
              reg_.lastIndex = 0;
              var index = scope.billObj.masterKeyData.indexOf(text);
              if (index > -1) {
                //TODO 将必要数据的修改放到上面的表格中
                addToMasterData(text, val1, data, 'in');
                element.css(color, yellow);
              } else {
                element.css(color, blue);
              }
            } else {
              var index3 = scope.errorData.indexOf(text);
              if ($.trim(scope.billObj[text]) !== '' && (index3 > -1)) {
                scope.errorData.splice(index3, 1);
                element.removeClass(errClass);
              }
              addToMasterData(text, val1, data, 'out');
              element.css(color, white);
            }
          }
        }
        /**
         * 下拉校验--主单
         */
        function doChange1(text, val1, text2) {
          if (scope.originbillObj.pAirWaybillInfo) {
            var data = scope.originbillObj.pAirWaybillInfo[text];
            var element = angular.element('[name=m_' + text + ']');
            var element1 = element.find('span.select2-chosen');
            if ((val1 && val1[text2] !== data) || (val1 === undefined && val1 !== data)) {
              var index = scope.billObj.masterKeyData.indexOf(text);
              if (index > -1) {
                //TODO 将必要数据的修改放到上面的表格中
                if (val1 === undefined) {
                  addToMasterData(text, val1, data, 'in');
                } else {
                  addToMasterData(text, val1[text2], data, 'in');
                }
                element1.css(color, yellow);
              } else {
                element1.css(color, blue);
              }
            } else {
              if (val1 === undefined) {
                addToMasterData(text, val1, data, 'out');
              } else {
                addToMasterData(text, val1[text2], data, 'out');
              }
              element1.css(color, transparent);
            }
            if (text === 'carrier1') {
              var text1 = 'flightNo';
              var element1 = angular.element('[name=m_' + text1 + ']');
              var index1 = scope.errorData.indexOf(text1);
              var flightNo = scope.billObj.flightNo.substr(0, 2);
              if (val1 && val1.airCode === flightNo) {
                if (index1 > -1) {
                  scope.errorData.splice(index1, 1);
                  element1.removeClass(errClass);
                }
              } else {
                if (index1 < 0) {
                  scope.errorData.push(text1);
                  element1.addClass(errClass);
                }
              }
            }
          }
        }
        /**
         * 分单校验
         */
        function doChange3(text, val1, val2, reg, reg_, notToUpperCase) {
          var subIndex = scope.index,
            subData = {};
          if (subIndex !== undefined) {
            subData = scope.originbillObj.airWayBillInfoVos[subIndex];
          }
          var element = angular.element('[name=s_' + text + ']');
          var ele = element[0];
          if (subData.pAirWaybillInfo) {
            var data = subData.pAirWaybillInfo[text];
            if (val1 !== data) {
              if (!notToUpperCase) {
                try {
                  val1 = val1.replace(reg, '').toUpperCase();
                } catch (error) {
                  scope.subBillObj[text] = val2;
                  return;
                }
              }
              if (document.activeElement === ele) {
                pos = getCursorPos(ele);
                length = scope.subBillObj[text].length;
              }
              scope.subBillObj[text] = val1;
              if (document.activeElement === ele) {
                var length1 = scope.subBillObj[text].length;
                if (length === length1) {
                  doText(ele, pos);
                } else {
                  doText(ele, pos - (length - length1));
                }
                ele.blur();
              }
              var index1 = scope.subErrorData.indexOf(text);
              if (reg_.test(val1)) {
                if (index1 > -1) {
                  scope.subErrorData.splice(index1, 1);
                  element.removeClass(errClass);
                }
              } else {
                if ($.trim(scope.subBillObj[text]) !== '') {
                  if (index1 < 0) {
                    scope.subErrorData.push(text);
                    element.addClass(errClass);
                  }
                }
              }
              reg_.lastIndex = 0;
              var index = scope.billObj.subKeyData.indexOf(text);
              if (index > -1) {
                //TODO 将必要数据的修改放到上面的表格中
                addToSubData(text, val1, data, 'in');
                element.css(color, yellow);
              } else {
                element.css(color, blue);
              }
            } else {
              var index3 = scope.subErrorData.indexOf(text);
              if ($.trim(scope.subBillObj[text]) !== '' && (index3 > -1)) {
                scope.subErrorData.splice(index3, 1);
                element.removeClass(errClass);
              }
              addToSubData(text, val1, data, 'out');
              element.css(color, white);
            }
          }
        }
        /**
         * 下拉校验--分单
         */
        function doChange2(text, val1, text2) {
          var subIndex = scope.index,
            subData = {};
          if (subIndex !== undefined) {
            subData = scope.originbillObj.airWayBillInfoVos[subIndex];
          }
          if (subData.pAirWaybillInfo) {
            var data = subData.pAirWaybillInfo[text];
            var element = angular.element('[name=s_' + text + ']');
            var element1 = element.find('span.select2-chosen');
            if ((val1 && val1[text2] !== data) || (val1 === undefined && val1 !== data)) {
              var index = scope.billObj.subKeyData.indexOf(text);
              if (index > -1) {
                //TODO 将必要数据的修改放到上面的表格中
                if (val1 === undefined) {
                  if (scope.clickSub !== 'now') {
                    addToSubData(text, val1, data, 'in');
                  }
                } else {
                  addToSubData(text, val1[text2], data, 'in');
                }
                element1.css(color, yellow);
              } else {
                element1.css(color, blue);
              }
            } else {
              if (val1 === undefined) {
                addToSubData(text, val1, data, 'out');
              } else {
                addToSubData(text, val1[text2], data, 'out');
              }
              element1.css(color, transparent);
            }
          }
        }
        /**
         * 将关键数据的修改放到表格--主单
         * 
         * @param {any} text
         */
        function addToMasterData(text, newVal, oldVal, type) {
          var masterData = [];
          angular.forEach(scope.billObj.masterData, function (v, k) {
            masterData.push(v.difference.diffField);
          });
          var index = masterData.indexOf(text);
          var data = {
            billNo: scope.billObj.waybillNo,
            difference: {
              diffField: text,
              newValue: newVal || '',
              oldValue: oldVal || ''
            }
          };
          if (type === 'in') {
            if (index > -1) {
              scope.billObj.masterData.splice(index, 1, data);
            } else {
              scope.billObj.masterData.push(data);
            }
          } else if (type === 'out') {
            if (index > -1) {
              scope.billObj.masterData.splice(index, 1);
            }
          }
        }
        /**
         * 将关键数据的修改放到表格--分单
         * 
         * @param {any} text
         */
        function addToSubData(text, newVal, oldVal, type) {
          var subData = [],
            dataIndex = -1;
          angular.forEach(scope.billObj.subData, function (v, k) {
            subData.push({
              billNo: v.billNo,
              diffField: v.difference.diffField
            });
            if (v.billNo === scope.currentBillNo && dataIndex === -1) {
              dataIndex = k;
            }
          });
          var index = -1;
          for (var i = 0; i < subData.length; i++) {
            var element = subData[i];
            if (element.billNo === scope.currentBillNo && element.diffField === text) {
              index = i;
              break;
            }
          }
          var data = {
            billNo: scope.currentBillNo,
            difference: {
              diffField: text,
              newValue: newVal || '',
              oldValue: oldVal || ''
            }
          };
          if (type === 'in') {
            if (index > -1) {
              scope.billObj.subData.splice(index, 1, data);
            } else {
              if (dataIndex > -1) {
                scope.billObj.subData.splice(dataIndex, 0, data);
              } else {
                scope.billObj.subData.push(data);
              }
            }
          } else if (type === 'out') {
            if (index > -1) {
              scope.billObj.subData.splice(index, 1);
            }
          }
        }
        scope.$watch('billno', function (newVal, oldVal) {
          if (newVal) {
            scope.getCountry();
          }
        });
        scope.$watch('billObj.spAccountNumber', function (newVal, oldVal) {
          doChange('spAccountNumber', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('billObj.spName', function (newVal, oldVal) {
          doChange('spName', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.spAddress', function (newVal, oldVal) {
          doChange('spAddress', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.spZipcode', function (newVal, oldVal) {
          doChange('spZipcode', newVal, oldVal, reg3, reg3_);
        });
        scope.$watch('billObj.spCity', function (newVal, oldVal) {
          doChange('spCity', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.spState', function (newVal, oldVal) {
          doChange('spState', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.spCountry', function (newVal, oldVal) {
          doChange1('spCountry', newVal, 'countryCode');
        });
        scope.$watch('billObj.spTel', function (newVal, oldVal) {
          doChange('spTel', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('billObj.spFax', function (newVal, oldVal) {
          doChange('spFax', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('billObj.spContractor', function (newVal, oldVal) {
          doChange('spContractor', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.issuedBy', function (newVal, oldVal) {
          doChange('issuedBy', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.csAccountNumber', function (newVal, oldVal) {
          doChange('csAccountNumber', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('billObj.csName', function (newVal, oldVal) {
          doChange('csName', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.csAddress', function (newVal, oldVal) {
          doChange('csAddress', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.csZipcode', function (newVal, oldVal) {
          doChange('csZipcode', newVal, oldVal, reg3, reg3_);
        });
        scope.$watch('billObj.csCity', function (newVal, oldVal) {
          doChange('csCity', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.csState', function (newVal, oldVal) {
          doChange('csState', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.csCountry', function (newVal, oldVal) {
          doChange1('csCountry', newVal, 'countryCode');
        });
        scope.$watch('billObj.csTel', function (newVal, oldVal) {
          doChange('csTel', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('billObj.csFax', function (newVal, oldVal) {
          doChange('csFax', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('billObj.csContractor', function (newVal, oldVal) {
          doChange('csContractor', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.agentName', function (newVal, oldVal) {
          doChange('agentName', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.agentCity', function (newVal, oldVal) {
          doChange('agentCity', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.agentIataCode', function (newVal, oldVal) {
          doChange('agentIataCode', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('billObj.agentCassAddress', function (newVal, oldVal) {
          doChange('agentCassAddress', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('billObj.accountNo', function (newVal, oldVal) {
          doChange('accountNo', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.dept', function (newVal, oldVal) {
          doChange1('dept', newVal, 'airportCode');
        });
        scope.$watch('billObj.deptDesc', function (newVal, oldVal) {
          doChange('deptDesc', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.accounInforIdentif', function (newVal, oldVal) {
          doChange1('accounInforIdentif', newVal, 'id');
        });
        scope.$watch('billObj.freightPrepaid', function (newVal, oldVal) {
          doChange('freightPrepaid', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.accounInforIdentif1', function (newVal, oldVal) {
          doChange1('accounInforIdentif1', newVal, 'id');
        });
        scope.$watch('billObj.freightPrepaid1', function (newVal, oldVal) {
          doChange('freightPrepaid1', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.accounInforIdentif2', function (newVal, oldVal) {
          doChange1('accounInforIdentif2', newVal, 'id');
        });
        scope.$watch('billObj.freightPrepaid2', function (newVal, oldVal) {
          doChange('freightPrepaid2', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.accounInforIdentif3', function (newVal, oldVal) {
          doChange1('accounInforIdentif3', newVal, 'id');
        });
        scope.$watch('billObj.freightPrepaid3', function (newVal, oldVal) {
          doChange('freightPrepaid3', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.accounInforIdentif4', function (newVal, oldVal) {
          doChange1('accounInforIdentif4', newVal, 'id');
        });
        scope.$watch('billObj.freightPrepaid4', function (newVal, oldVal) {
          doChange('freightPrepaid4', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.accounInforIdentif5', function (newVal, oldVal) {
          doChange1('accounInforIdentif5', newVal, 'id');
        });
        scope.$watch('billObj.freightPrepaid5', function (newVal, oldVal) {
          doChange('freightPrepaid5', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.dest1', function (newVal, oldVal) {
          doChange1('dest1', newVal, 'airportCode');
        });
        scope.$watch('billObj.carrier1', function (newVal, oldVal) {
          doChange1('carrier1', newVal, 'airCode');
        });
        scope.$watch('billObj.dest2', function (newVal, oldVal) {
          doChange1('dest2', newVal, 'airportCode');
        });
        scope.$watch('billObj.carrier2', function (newVal, oldVal) {
          doChange1('carrier2', newVal, 'airCode');
        });
        scope.$watch('billObj.dest3', function (newVal, oldVal) {
          doChange1('dest3', newVal, 'airportCode');
        });
        scope.$watch('billObj.carrier3', function (newVal, oldVal) {
          doChange1('carrier3', newVal, 'airCode');
        });
        scope.$watch('billObj.dest4', function (newVal, oldVal) {
          doChange1('dest4', newVal, 'airportCode');
        });
        scope.$watch('billObj.carrier4', function (newVal, oldVal) {
          doChange1('carrier4', newVal, 'airCode');
        });
        scope.$watch('billObj.currency', function (newVal, oldVal) {
          doChange1('currency', newVal, 'currencyCode');
        });
        scope.$watch('billObj.chargeCode', function (newVal, oldVal) {
          doChange1('chargeCode', newVal, 'id');
        });
        scope.$watch('billObj.wtVal', function (newVal, oldVal) {
          doChange1('wtVal', newVal, 'id');
        });
        scope.$watch('billObj.other', function (newVal, oldVal) {
          doChange1('other', newVal, 'id');
        });
        scope.$watch('billObj.carriageValue', function (newVal, oldVal) {
          doChange('carriageValue', newVal, oldVal, reg5, reg5_);
        });
        scope.$watch('billObj.customsValue', function (newVal, oldVal) {
          doChange('customsValue', newVal, oldVal, reg5, reg6_);
        });
        scope.$watch('billObj.airportDest', function (newVal, oldVal) {
          doChange('airportDest', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.flightNo', function (newVal, oldVal) {
          doChange('flightNo', newVal, oldVal, reg3, reg7_);
        });
        scope.$watch('billObj.fltDate', function (newVal, oldVal) {
          doChange('fltDate', newVal, oldVal, reg4, reg8_);
        });
        scope.$watch('billObj.flightNo2', function (newVal, oldVal) {
          doChange('flightNo2', newVal, oldVal, reg3, reg7_);
        });
        scope.$watch('billObj.fltDate2', function (newVal, oldVal) {
          doChange('fltDate2', newVal, oldVal, reg4, reg8_);
        });
        scope.$watch('billObj.insuranceValue', function (newVal, oldVal) {
          doChange('insuranceValue', newVal, oldVal, reg3, reg9_);
        });
        scope.$watch('billObj.ssr', function (newVal, oldVal) {
          doChange('ssr', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.osi1', function (newVal, oldVal) {
          doChange('osi1', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.holdCode', function (newVal, oldVal) {
          doChange('holdCode', newVal, oldVal, reg10, reg10_);
        });
        scope.$watch('billObj.alsoNotify', function (newVal, oldVal) {
          if (scope.originbillObj.pAirWaybillInfo) {
            var data = scope.originbillObj.pAirWaybillInfo.alsoNotify;
            var element = angular.element('[name=m_alsoNotify]');
            if (newVal !== data) {
              var index = scope.billObj.masterKeyData.indexOf('alsoNotify');
              if (index > -1) {
                element.css(color, yellow);
              } else {
                element.css(color, blue);
              }
            } else {
              element.css(color, white);
            }
          }
        });
        scope.$watch('billObj.rcpNo', function (newVal, oldVal) {
          doChange('rcpNo', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('billObj.grossWeight', function (newVal, oldVal) {
          doChange('grossWeight', newVal, oldVal, reg11, reg11_);
        });
        scope.$watch('billObj.weightCode', function (newVal, oldVal) {
          doChange1('weightCode', newVal, 'id');
        });
        scope.$watch('billObj.rateClass', function (newVal, oldVal) {
          doChange1('rateClass', newVal, 'id');
        });
        scope.$watch('billObj.commodityNo', function (newVal, oldVal) {
          doChange('commodityNo', newVal, oldVal, reg3, reg3_);
        });
        scope.$watch('billObj.chargeWeight', function (newVal, oldVal) {
          doChange('chargeWeight', newVal, oldVal, reg11, reg12_);
        });
        scope.$watch('billObj.rateCharge', function (newVal, oldVal) {
          doChange('rateCharge', newVal, oldVal, reg11, reg13_);
        });
        scope.$watch('billObj.totalCount', function (newVal, oldVal) {
          doChange('totalCount', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.slac', function (newVal, oldVal) {
          doChange('slac', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('billObj.remark', function (newVal, oldVal) {
          doChange('remark', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.goodsDesc', function (newVal, oldVal) {
          doChange('goodsDesc', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.vol', function (newVal, oldVal) {
          doChange('vol', newVal, oldVal, reg11, reg15_);
        });
        scope.$watch('billObj.volumeCode', function (newVal, oldVal) {
          doChange1('volumeCode', newVal, 'id');
        });
        scope.$watch('billObj.densityGroup', function (newVal, oldVal) {
          doChange('densityGroup', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.prepaid', function (newVal, oldVal) {
          doChange('prepaid', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.collect', function (newVal, oldVal) {
          doChange('collect', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.valuationCharge', function (newVal, oldVal) {
          doChange('valuationCharge', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.valuationCharge2', function (newVal, oldVal) {
          doChange('valuationCharge2', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.tax', function (newVal, oldVal) {
          doChange('tax', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.tax2', function (newVal, oldVal) {
          doChange('tax2', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.totalAgent', function (newVal, oldVal) {
          doChange('totalAgent', newVal, oldVal, reg11, reg16_);
        });
        scope.$watch('billObj.totalAgent2', function (newVal, oldVal) {
          doChange('totalAgent2', newVal, oldVal, reg11, reg16_);
        });
        scope.$watch('billObj.totalCarrier', function (newVal, oldVal) {
          doChange('totalCarrier', newVal, oldVal, reg11, reg16_);
        });
        scope.$watch('billObj.totalCarrier2', function (newVal, oldVal) {
          doChange('totalCarrier2', newVal, oldVal, reg11, reg16_);
        });
        scope.$watch('billObj.totalPrepaid', function (newVal, oldVal) {
          doChange('totalPrepaid', newVal, oldVal, reg11, reg16_);
        });
        scope.$watch('billObj.totalCollect', function (newVal, oldVal) {
          doChange('totalCollect', newVal, oldVal, reg11, reg16_);
        });
        scope.$watch('billObj.destCurrency', function (newVal, oldVal) {
          doChange1('destCurrency', newVal, 'currencyCode');
        });
        scope.$watch('billObj.rates', function (newVal, oldVal) {
          doChange('rates', newVal, oldVal, reg11, reg17_);
        });
        scope.$watch('billObj.ccChargesDes', function (newVal, oldVal) {
          doChange('ccChargesDes', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.signatureAgent', function (newVal, oldVal) {
          doChange('signatureAgent', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.executed', function (newVal, oldVal) {
          doChange('executed', newVal, oldVal, reg4, reg8_);
        });
        scope.$watch('billObj.place', function (newVal, oldVal) {
          doChange('place', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.signatureIssuing', function (newVal, oldVal) {
          doChange('signatureIssuing', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.chargesDestination', function (newVal, oldVal) {
          doChange('chargesDestination', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.totalCollectCharges', function (newVal, oldVal) {
          doChange('totalCollectCharges', newVal, oldVal, reg11, reg14_);
        });
        scope.$watch('billObj.goodsNameEn', function (newVal, oldVal) {
          doChange('goodsNameEn', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('billObj.goodsNameCn', function (newVal, oldVal) {
          doChange('goodsNameCn', newVal, oldVal, reg19, reg19_, true);
        });
        scope.$watch('billObj.goodsRemarks', function (newVal, oldVal) {
          doChange('goodsRemarks', newVal, oldVal, reg19, reg19_, true);
        });
        scope.$watch('billObj.ckElectricFlag', function (newVal, oldVal) {
          doChange('ckElectricFlag', newVal, oldVal, reg19, reg19_, true);
        });
        scope.$watch('billObj.agreedFlag', function (newVal, oldVal) {
          if (scope.originbillObj.pAirWaybillInfo) {
            var data = scope.originbillObj.pAirWaybillInfo.agreedFlag;
            var data1;
            if (newVal === '1' || newVal === true) {
              data1 = '1';
            } else {
              data1 = '0';
            }
            var element = angular.element('[name=m_agreedFlag]');
            if (data1 !== data) {
              var index = scope.billObj.masterKeyData.indexOf('agreedFlag');
              if (index > -1) {
                element.css(color, yellow);
              } else {
                element.css(color, blue);
              }
            } else {
              element.css(color, transparent);
            }
          }
        });
        scope.$watch('otherFeeData', function (newVal, oldVal) {
          if (scope.originbillObj.pWaybillRateDetails) {
            angular.forEach(newVal, function (v, k) {
              var data = scope.originbillObj.pWaybillRateDetails[k],
                name1 = 'code' + k,
                name2 = 'owner' + k,
                name3 = 'fee' + k,
                element1 = angular.element('[name="' + name1 + '"]').find('span.select2-chosen'),
                element2 = angular.element('[name="' + name2 + '"]').find('span.select2-chosen'),
                element3 = angular.element('[name="' + name3 + '"]');
              if (data) {
                if (v.code && v.code.id != data.code) {
                  element1.css(color, blue);
                } else {
                  element1.css(color, transparent);
                }
                if (v.owner && v.owner.id != data.owner) {
                  element2.css(color, blue);
                } else {
                  element2.css(color, transparent);
                }
                v.fee = (v.fee + '').replace(/[^0-9\.]/g, '');
                v.errorFlag = !/^[0-9]{1,10}(([.]{1}[0-9]{1,3})?|[0-9]{1,2})$/g.test(v.fee);
                if (v.fee != data.fee) {
                  if ($.trim(v.fee) === '') {
                    v.errorFlag = false;
                  }
                  if (v.fee === '' && (data.fee === undefined || data.fee === '')) {
                    element3.css(color, white);
                  } else {
                    element3.css(color, blue);
                  }
                } else {
                  if ($.trim(v.fee) === '') {
                    v.errorFlag = false;
                  }
                  element3.css(color, white);
                }
                scope.selectOwner();
              } else {
                element1.css(color, blue);
                element2.css(color, blue);
                element3.css(color, blue);
              }
            });
          }
        }, true);
        /********分单*********/
        scope.$watch('subBillObj.dept', function (newVal, oldVal) {
          doChange2('dept', newVal, 'airportCode');
        });
        scope.$watch('subBillObj.dest1', function (newVal, oldVal) {
          doChange2('dest1', newVal, 'airportCode');
        });
        scope.$watch('subBillObj.spName', function (newVal, oldVal) {
          doChange3('spName', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.spAddress', function (newVal, oldVal) {
          doChange3('spAddress', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.spCity', function (newVal, oldVal) {
          doChange3('spCity', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.spCountry', function (newVal, oldVal) {
          doChange2('spCountry', newVal, 'countryCode');
        });
        scope.$watch('subBillObj.spState', function (newVal, oldVal) {
          doChange3('spState', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.spZipcode', function (newVal, oldVal) {
          doChange3('spZipcode', newVal, oldVal, reg3, reg3_);
        });
        scope.$watch('subBillObj.spTel', function (newVal, oldVal) {
          doChange3('spTel', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('subBillObj.spFax', function (newVal, oldVal) {
          doChange3('spFax', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('subBillObj.csName', function (newVal, oldVal) {
          doChange3('csName', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.csAddress', function (newVal, oldVal) {
          doChange3('csAddress', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.csCity', function (newVal, oldVal) {
          doChange3('csCity', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.csCountry', function (newVal, oldVal) {
          doChange2('csCountry', newVal, 'countryCode');
        });
        scope.$watch('subBillObj.csState', function (newVal, oldVal) {
          doChange3('csState', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.csZipcode', function (newVal, oldVal) {
          doChange3('csZipcode', newVal, oldVal, reg3, reg3_);
        });
        scope.$watch('subBillObj.csTel', function (newVal, oldVal) {
          doChange3('csTel', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('subBillObj.csFax', function (newVal, oldVal) {
          doChange3('csFax', newVal, oldVal, reg4, reg4_);
        });
        scope.$watch('subBillObj.goodsDesc', function (newVal, oldVal) {
          doChange3('goodsDesc', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.remark', function (newVal, oldVal) {
          doChange3('remark', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.rcpNo', function (newVal, oldVal) {
          doChange3('rcpNo', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('subBillObj.grossWeight', function (newVal, oldVal) {
          doChange3('grossWeight', newVal, oldVal, reg11, reg11_);
        });
        scope.$watch('subBillObj.weightCode', function (newVal, oldVal) {
          doChange2('weightCode', newVal, 'id');
        });
        scope.$watch('subBillObj.slac', function (newVal, oldVal) {
          doChange3('slac', newVal, oldVal, reg1, reg1_);
        });
        scope.$watch('subBillObj.carriageValue', function (newVal, oldVal) {
          doChange3('carriageValue', newVal, oldVal, reg5, reg5_);
        });
        scope.$watch('subBillObj.insuranceValue', function (newVal, oldVal) {
          doChange3('insuranceValue', newVal, oldVal, reg5, reg9_);
        });
        scope.$watch('subBillObj.customsValue', function (newVal, oldVal) {
          doChange3('customsValue', newVal, oldVal, reg5, reg6_);
        });
        scope.$watch('subBillObj.wtVal', function (newVal, oldVal) {
          doChange2('wtVal', newVal, 'id');
        });
        scope.$watch('subBillObj.other', function (newVal, oldVal) {
          doChange2('other', newVal, 'id');
        });
        scope.$watch('subBillObj.currency', function (newVal, oldVal) {
          doChange2('currency', newVal, 'currencyCode');
        });
        scope.$watch('subBillObj.holdCode', function (newVal, oldVal) {
          doChange3('holdCode', newVal, oldVal, reg10, reg10_);
        });
        scope.$watch('subBillObj.commodityCodes', function (newVal, oldVal) {
          doChange3('commodityCodes', newVal, oldVal, reg18, reg18_);
        });
        scope.$watch('subBillObj.eliFlag', function (newVal, oldVal) {
          doChange3('eliFlag', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.elmFlag', function (newVal, oldVal) {
          doChange3('elmFlag', newVal, oldVal, reg2, reg2_);
        });
        scope.$watch('subBillObj.goodsNameCn', function (newVal, oldVal) {
          doChange3('goodsNameCn', newVal, oldVal, reg19, reg19_, true);
        });
        scope.$watch('subBillObj.goodsRemarks', function (newVal, oldVal) {
          doChange3('goodsRemarks', newVal, oldVal, reg19, reg19_, true);
        });
        scope.$watch('subBillObj.ckElectricFlag', function (newVal, oldVal) {
          doChange3('ckElectricFlag', newVal, oldVal, reg19, reg19_, true);
        });
        scope.$on('reset-master', function (event, data) {
          var dataParam = data.params,
            dataIndex = data.index,
            diffField = dataParam.difference.diffField;
          if (diffField === '证书') {
            certChange(dataParam, scope.billObj, 'master');
          } else {
            scope.billObj[diffField] = scope.billObj.originbillObj1[diffField];
          }
          scope.billObj.masterData.splice(dataIndex, 1);
        });
        scope.$on('reset-sub', function (event, data) {
          var billData = scope.billObj.originbillObj1.newSubBillObj || [],
            dataParam = data.params,
            dataDifference = dataParam.difference,
            dataIndex = data.index,
            currentIndex = -1,
            currentData,
            subData,
            diffField,
            value;
          for (var index = 0; index < billData.length; index++) {
            var element = billData[index];
            if (element.pAirWaybillInfo.waybillNo === data.params.billNo) {
              currentData = element.pAirWaybillInfo;
              currentIndex = index;
              break;
            }
          }
          if (angular.isObject(currentData)) {
            diffField = dataDifference.diffField;
            if (currentIndex === scope.index) {
              subData = scope.subBillObj;
              value = currentData[diffField];
              if (diffField === '证书') {
                certChange(dataParam, subData, 'sub');
              } else {
                switch (diffField) {
                  case 'dept':
                  case 'dest1':
                    if (value) {
                      restAPI.airData.getDataByCode.save({}, value)
                        .$promise.then(function (resp) {
                          var airportData = resp.data;
                          if (airportData) {
                            subData[diffField] = airportData;
                          }
                        });
                    }
                    break;
                  case 'spCountry':
                  case 'csCountry':
                    for (var index = 0; index < scope.countryData.length; index++) {
                      var element = scope.countryData[index];
                      if (element.countryCode === value) {
                        subData[diffField] = element;
                        break;
                      }
                    }
                    break;
                  case 'weightCode':
                    for (var index = 0; index < scope.weightCodeData.length; index++) {
                      var element = scope.weightCodeData[index];
                      if (element.id === value) {
                        subData[diffField] = element;
                        break;
                      }
                    }
                    break;
                  case 'wtVal':
                  case 'other':
                    for (var index = 0; index < scope.wtValData.length; index++) {
                      var element = scope.wtValData[index];
                      if (element.id === value) {
                        subData[diffField] = element;
                        break;
                      }
                    }
                    break;
                  case 'currency':
                    for (var index = 0; index < scope.currencyData.length; index++) {
                      var element = scope.currencyData[index];
                      if (element.currencyCode === value) {
                        subData[diffField] = element;
                        break;
                      }
                    }
                    break;
                  default:
                    subData[diffField] = value;
                    break;
                }
              }
            } else {
              subData = scope.billObj.newSubBillObj[currentIndex];
              if (diffField === '证书') {
                certChange(dataParam, subData.pAirWaybillInfo, 'sub');
              } else {
                subData.pAirWaybillInfo[diffField] = currentData[diffField];
              }
              scope.billObj.newSubBillObj.splice(currentIndex, 1, subData);
            }
          }
          scope.billObj.subData.splice(dataIndex, 1);
        });
        /**
         * 证书修改
         * 
         * @param {any} param
         * 
         */
        function certChange(param, data, dataType) {
          var type = param.type,
            certData1 = data.certData[type] || [],
            certData2 = data.certData[type + 'Old'] || [],
            newValue = param.difference.newValue,
            oldValue = param.difference.oldValue;
          if (newValue) {
            angular.forEach(certData1, function (v, k) {
              if (v.fileHttpPath === newValue) {
                certData1.splice(k, 1);
              }
            });
          } else if (oldValue) {
            angular.forEach(certData2, function (v, k) {
              if (v.fileHttpPath === oldValue) {
                var fileData = certData2.splice(k, 1);
                certData1.push(fileData[0]);
              }
            });
          }
          if (dataType === 'master') {
            scope.masterCertData[type] = certData1.length;
          } else if (dataType === 'sub') {
            data.subCertData[type] = certData1.length;
          }
        }
      }
    }
  }
];