'use strict';

module.exports = ['$document', '$rootScope', 'restAPI', '$modal', 'Notification', 'Auth', '$state',
  function ($document, $rootScope, restAPI, $modal, Notification, Auth, $state) {
    return {
      restrict: 'EA',
      template: require('./masterbill.html'),
      replace: true,
      scope: {
        billno: '='
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.billObj = {};
        vm.showText = {};
        vm.search = search;
        vm.showImg = false;
        vm.imgSrc = '';
        showImgOrHide();

        function showImgOrHide(params) {
          return vm.showImg = $state.current.name === 'pactlPrejudice.showMasterbill3' || $state.current.name === 'airline.showMasterbill';
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
              $rootScope.loading = false;
              if (resp.ok) {
                if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
                  setAllData(resp.data);
                } else {
                  Notification.error({
                    message: '未找到任何数据'
                  });
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
          setBaseData(data.pAirWaybillInfo);
          setOtherFeeData(data.pWaybillRateDetails); //显示other fee
          setImg(data.files);
          vm.personCode = data.personCode;
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
        }
        /**
         * 显示已存在的数据
         */
        function setOtherFeeData(params) {
          vm.otherFeeData = params;
        }
        /**
         * 显示印章图片
         * @param {*} params 
         */
        function setImg(params) {
          if(params.length){
            vm.imgSrc = params[0]['fileHttpPath'];
          }
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