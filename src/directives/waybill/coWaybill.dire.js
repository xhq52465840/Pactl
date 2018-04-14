'use strict';

module.exports = ['$document', '$rootScope', 'restAPI', '$modal', 'Notification', 'Auth', '$state', '$interval',
  function ($document, $rootScope, restAPI, $modal, Notification, Auth, $state, $interval) {
    return {
      restrict: 'EA',
      template: require('./coWaybill.html'),
      replace: true,
      scope: {
        billno: '=',
        billObj: '='
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.checkshipmentFlag=''
        vm.alsoNotifyData = {}; //当前的通知人
        vm.currentBillNo = ''; // 当前选中的运单号
        vm.currentBillType = ''; // 当前选中的运单类型
        vm.masterCertData = {}; // 显示主单证书数字
        vm.otherFeeData = [];
        vm.subBillObj = {}; //分单数据
        vm.search = search;
        vm.showSubBill = false;
        vm.showText = {
          airPort: '',
          dest: '',
          subGrossWeight: 0,
          subRcpNo: 0,
          subSlac: 0
        };
        /***********页面的方法****************/
        vm.alsoNotify = alsoNotify;
        vm.chooseBill = chooseBill;
        vm.chooseMaster = chooseMaster;
        vm.showCargoDeclaraction = showCargoDeclaraction;
        vm.showBatteryDeclaraction = showBatteryDeclaraction;
        vm.searchBook = searchBook;
        vm.showAllInfo = showAllInfo;
        vm.showLeftSub = showLeftSub;
        vm.showMasterCert = false;

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
              $rootScope.loading = false;
              if (resp.ok) {
                if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
                  setAllData(resp.data);
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
          setAlsoNotify(data.pAirWaybillInfo); //显示通知人
          setCert(data.pAirWaybillInfo.awId, '0'); //显示证书
          getStatus(data.pAirWaybillInfo.awId);
        }
        
        
        /**
         * 获取运单状态
         */
        function getStatus(awId){
        	//debugger
        	restAPI.waybill.statusdetail.save({}, {
    			awId: awId
    		}).$promise.then(function (resp) {
    			if(resp.ok){
    				if(resp.data){
    					vm.checkshipmentFlag=resp.data.shipmentFlag;
    				}
    			}
    		})
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
         * 显示证书
         */
        function setCert(awId, type) {
          restAPI.dataEdit.booksCount.save({}, {
              awId: awId
            })
            .$promise.then(function (resp) {
            	console.log(resp)
              if (resp.ok) {
                if (type === '0') {
                  vm.masterCertData = resp.data;
                  vm.billObj.certData = {};
                } else {
                  vm.subBillObj.subCertData = resp.data;
                  vm.subBillObj.certData = {};
                }
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
        	//console.log(baseData)
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
          vm.billObj.spCountry = baseData.spCountry;
          vm.billObj.spTel = baseData.spTel;
          vm.billObj.spFax = baseData.spFax;
          vm.billObj.spContractor = baseData.spContractor;
          vm.billObj.csAccountNumber = baseData.csAccountNumber;
          vm.billObj.csName = baseData.csName;
          vm.billObj.csAddress = baseData.csAddress;
          vm.billObj.csZipcode = baseData.csZipcode;
          vm.billObj.csCity = baseData.csCity;
          vm.billObj.csState = baseData.csState;
          vm.billObj.csCountry = baseData.csCountry;
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
          vm.billObj.accounInforIdentif = baseData.accounInforIdentif;
          vm.billObj.accounInforIdentif1 = baseData.accounInforIdentif1;
          vm.billObj.accounInforIdentif2 = baseData.accounInforIdentif2;
          vm.billObj.accounInforIdentif3 = baseData.accounInforIdentif3;
          vm.billObj.accounInforIdentif4 = baseData.accounInforIdentif4;
          vm.billObj.accounInforIdentif5 = baseData.accounInforIdentif5;
          vm.billObj.freightPrepaid = baseData.freightPrepaid;
          vm.billObj.freightPrepaid1 = baseData.freightPrepaid1;
          vm.billObj.freightPrepaid2 = baseData.freightPrepaid2;
          vm.billObj.freightPrepaid3 = baseData.freightPrepaid3;
          vm.billObj.freightPrepaid4 = baseData.freightPrepaid4;
          vm.billObj.freightPrepaid5 = baseData.freightPrepaid5;
          vm.billObj.dept = baseData.dept;
          vm.billObj.dest1 = baseData.dest1;
          vm.billObj.dest2 = baseData.dest2;
          vm.billObj.dest3 = baseData.dest3;
          vm.billObj.dest4 = baseData.dest4;
          vm.billObj.carrier1 = baseData.carrier1;
          vm.billObj.carrier2 = baseData.carrier2;
          vm.billObj.carrier3 = baseData.carrier3;
          vm.billObj.carrier4 = baseData.carrier4;
          vm.billObj.currency = baseData.currency;
          vm.billObj.destCurrency = baseData.destCurrency;
          vm.billObj.chargeCode = baseData.chargeCode;
          vm.billObj.wtVal = baseData.wtVal;
          vm.billObj.other = baseData.other;
          vm.billObj.carriageValue = baseData.carriageValue;
          vm.billObj.customsValue = baseData.customsValue;
          vm.billObj.airportDest = baseData.airportDest;
          if (baseData.airportDest) {
            restAPI.airData.getDataByCode.save({}, baseData.airportDest)
              .$promise.then(function (resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.showText.airPort = airportData.airportName;
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
          vm.billObj.weightCode = baseData.weightCode;
          vm.billObj.rateClass = baseData.rateClass;
          vm.billObj.commodityNo = baseData.commodityNo;
          vm.billObj.chargeWeight = baseData.chargeWeight;
          vm.billObj.rateCharge = baseData.rateCharge;
          vm.billObj.totalCount = baseData.totalCount;
          vm.billObj.slac = baseData.slac;
          vm.billObj.remark = baseData.remark;
          vm.billObj.goodsDesc = baseData.goodsDesc;
          vm.billObj.vol = baseData.vol;
          vm.billObj.volumeCode = baseData.volumeCode;
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
          vm.billObj.agreedFlag = baseData.agreedFlag;
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
          vm.otherFeeData = params;
        }

        /**
         * 货物申报
         */
        function showCargoDeclaraction() {
        	if(vm.checkshipmentFlag=='1'){
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
                  editAble: false,
                  newData: vm.billObj.cargoDeclare.newData
                };
              }
            }
          });
          cargoDeclaractionDialog.result.then(function (data) {
            vm.billObj.cargoDeclare = data;
            vm.billObj.showCargoDeclare = data.newData;
          },function(resp){

          });
        }
        /**
         * 锂电池
         */
        function showBatteryDeclaraction() {
        	//console.log($rootScope.checkshipmentFlag)
        	if(vm.checkshipmentFlag==='1'){
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
                  editAble: false,
                  newData: vm.billObj.liBattery.newData,
                  airCode: airCode
                };
              }
            }
          });
          batteryDeclaractionDialog.result.then(function (data) {
            vm.billObj.liBattery = data;
            vm.billObj.showLiBattery = data.newData;
          },function(resp){
            
          });
        }
        /**
         * Also notify
         */
        function alsoNotify() {
          var alsoNotifyDialog = $modal.open({
            template: require('./alsoNotify.html'),
            controller: require('./alsoNotify.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  title: 'alsoNotify',
                  obj: vm.alsoNotifyData
                };
              }
            }
          });
        }
        /**
         * 显示子运单
         * 
         * @param {any} params
         */
        function setSubBill(params) {
          vm.billObj.newSubBillObj = params;
          vm.showMasterCert = vm.billObj.newSubBillObj.length === 0;
        }
        /**
         * 显示主运单信息
         * 
         */
        function chooseMaster(type) {
          if (vm.currentBillNo === vm.billObj.waybillNo && vm.currentBillType === vm.billObj.type) {
            return false;
          }
          selectMasterBill();
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
         * 选择子运单
         */
        function chooseBill(data, index) {
          if (vm.currentBillNo === data.pAirWaybillInfo.waybillNo && vm.currentBillType === data.pAirWaybillInfo.waybillNo) {
            return false;
          }
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
          data.showLeftSub = true;
          showSubBillDetail(data);
        }
        /**
         * 显示子运单的信息
         */
        function showSubBillDetail(data) {
          var baseData = data.pAirWaybillInfo;
          vm.subBillObj = {};
          vm.currentBillNo = baseData.waybillNo;
          vm.currentBillType = baseData.type;
          vm.subBillObj.awId = baseData.awId;
          vm.subBillObj.parentNo = baseData.parentNo;
          vm.subBillObj.type = baseData.type;
          vm.subBillObj.waybillNo = baseData.waybillNo;
          vm.subBillObj.dept = baseData.dept;
          vm.subBillObj.dest1 = baseData.dest1;
          vm.subBillObj.spName = baseData.spName;
          vm.subBillObj.spAddress = baseData.spAddress;
          vm.subBillObj.spCity = baseData.spCity;
          vm.subBillObj.spState = baseData.spState;
          vm.subBillObj.spZipcode = baseData.spZipcode;
          vm.subBillObj.spTel = baseData.spTel;
          vm.subBillObj.spFax = baseData.spFax;
          vm.subBillObj.spCountry = baseData.spCountry;
          vm.subBillObj.csCountry = baseData.csCountry;
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
          vm.subBillObj.weightCode = baseData.weightCode;
          vm.subBillObj.slac = baseData.slac;
          vm.subBillObj.carriageValue = baseData.carriageValue;
          vm.subBillObj.insuranceValue = baseData.insuranceValue;
          vm.subBillObj.customsValue = baseData.customsValue;
          vm.subBillObj.wtVal = baseData.wtVal;
          vm.subBillObj.other = baseData.other;
          vm.subBillObj.currency = baseData.currency;
          vm.subBillObj.holdCode = baseData.holdCode;
          vm.subBillObj.commodityCodes = baseData.commodityCodes;
          vm.subBillObj.eliFlag = baseData.eliFlag;
          vm.subBillObj.elmFlag = baseData.elmFlag;
          vm.subBillObj.remark = baseData.remark;
          vm.subBillObj.goodsNameCn = baseData.goodsNameCn;
          vm.subBillObj.goodsRemarks = baseData.goodsRemarks;
          vm.subBillObj.ckElectricFlag = baseData.ckElectricFlag;
          vm.subBillObj.div = '<div class="pre-name">' + (baseData.remark ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + baseData.remark + '</div></div>' : '') + (baseData.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + baseData.goodsNameCn + '</div></div>' : '') + (baseData.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + baseData.goodsRemarks + '</pre></div>' : '') + '</div>';
          if (!baseData.certData) {
            setCert(vm.subBillObj.awId, '1');
          } else {
            vm.subBillObj.subCertData = baseData.subCertData;
            vm.subBillObj.certData = baseData.certData;
          }
        }
        /**
         * 证书显示
         */
        function searchBook(param, type, type1) {
          var canEdit = false;
          if (type === 'other') {
            showOtherBook(param, type, type1, canEdit);
          } else {
            showBook(param, type, type1, canEdit);
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
                    canEdit: canEdit
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
            } else if (type1 === '1') {
              vm.subBillObj.certData[type] = data.certData;
              vm.subBillObj.certData[type + 'Old'] = data.oldCertData;
              vm.subBillObj.subCertData[type] = data.certData.length;
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
        function showBook(awId, type, type1, canEdit) {
          var originCertData, oldCertData;
          if (type1 === '0') {
            originCertData = vm.billObj.certData[type];
            oldCertData = vm.billObj.certData[type + 'Old'];
          } else if (type1 === '1') {
            originCertData = vm.subBillObj.certData[type];
            oldCertData = vm.subBillObj.certData[type + 'Old'];
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
                  certData: originCertData,
                  oldCertData: oldCertData,
                  obj: {
                    awId: awId,
                    bookType: type,
                    canEdit: canEdit
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
            } else if (type1 === '1') {
              vm.subBillObj.certData[type] = data.certData;
              vm.subBillObj.certData[type + 'Old'] = data.oldCertData;
              vm.subBillObj.subCertData[type] = data.certData.length;
            }
          }, function (resp) {

          });
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
      }],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        scope.$watch('billno', function (newVal, oldVal) {
          if (newVal) {
            scope.search();
          }
        });
      }
    }
  }
];