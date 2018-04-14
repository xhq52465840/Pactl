'use strict';

module.exports = ['$document', '$rootScope', 'restAPI', 'Notification',
  function ($document, $rootScope, restAPI, Notification) {
    return {
      restrict: 'EA',
      template: require('./awb.html'),
      replace: true,
      scope: {
        awb: '=',
        awbType: '='
      },
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        var vm = scope;
        scope.$watch('awb', function (newVal, oldVal) {
          if (newVal) {
            getData();
          }
        })

        function getData() {
          getBillData();
          getImg();
        }

        function getBillData() {
          $rootScope.loading = true;
          restAPI.bill.billInfo.save({}, {
              awId: scope.awb,
              type: '0'
            })
            .$promise.then(function (resp) {
              $rootScope.loading = false;
              if (resp.ok) {
                scope.awbBill = resp.data;
                setData();
              } else {
                Notification.error({
                  message: resp.msg
                });
              }
            })
        }

        function getImg() {
          $rootScope.loading = true;
          restAPI.barCode.barCode.save({}, scope.awb)
            .$promise.then(function (resp) {
              $rootScope.loading = false;
              if (resp.ok) {
                scope.awbImg = resp.data;
              } else {
                Notification.error({
                  message: resp.msg
                });
              }
            })
        }

        function setData() {
          scope.obj = scope.awbBill.pAirWaybillInfo;
          vm.pWaybillGoodsSizes = scope.awbBill.pWaybillGoodsSizes;
          scope.billNo1 = scope.obj.waybillNo.substring(0, 3);
          scope.billNo2 = scope.obj.waybillNo.substring(3);
          scope.sp_zcs = setSpZcs();
          scope.sp_tel = setSpTel();
          scope.cs_zcs = setCsZcs();
          scope.cs_tel = setCsTel();
          setIataCode();
          setWtVal();
          setOther();
          setGoodsDesc();
          scope.rateDetails = scope.awbBill.pWaybillRateDetails || [];
          getAirData();
          scope.al_zcs = setAlZcs();
          scope.al_tel = setAlTel();
        }

        function getAirData() {
          var dest = (scope.obj.dest4 || scope.obj.dest3 || scope.obj.dest2 || scope.obj.dest1);
          restAPI.airPort.queryList.save({}, {
              airportCode: dest
            })
            .$promise.then(function (resp) {
              if (resp.rows && resp.rows.length) {
                scope.airportDataName = resp.rows[0].airportName || '';
                if (scope.airportDataName.length < 22) {
                  scope.airportDataName1 = scope.airportDataName;
                } else {
                  scope.airportDataName2 = scope.airportDataName;
                }
              }
            });
        }

        function setSpZcs() {
          var sp_zcs = [];
          scope.obj.spZipcode && sp_zcs.push(scope.obj.spZipcode);
          scope.obj.spCity && sp_zcs.push(scope.obj.spCity);
          scope.obj.spState && sp_zcs.push(scope.obj.spState);
          scope.obj.spCountry && sp_zcs.push(scope.obj.spCountry);
          return sp_zcs.join(', ');
        }

        function setSpTel() {
          var sp_tel = [];
          scope.obj.spTel && sp_tel.push('TL: ' + scope.obj.spTel);
          scope.obj.spFax && sp_tel.push('FX: ' + scope.obj.spFax);
          return sp_tel.join(' ');
        }

        function setCsZcs() {
          var cs_zcs = [];
          scope.obj.csZipcode && cs_zcs.push(scope.obj.csZipcode);
          scope.obj.csCity && cs_zcs.push(scope.obj.csCity);
          scope.obj.csState && cs_zcs.push(scope.obj.csState);
          scope.obj.csCountry && cs_zcs.push(scope.obj.csCountry);
          return cs_zcs.join(', ');
        }

        function setCsTel() {
          var cs_tel = [];
          scope.obj.csTel && cs_tel.push('TL: ' + scope.obj.csTel);
          scope.obj.csFax && cs_tel.push('FX: ' + scope.obj.csFax);
          return cs_tel.join(' ');
        }

        function setAlZcs() {
          var al_zcs = [];
          scope.obj.notifyZipcode && al_zcs.push(scope.obj.notifyZipcode);
          scope.obj.notifyCity && al_zcs.push(scope.obj.notifyCity);
          scope.obj.notifyState && al_zcs.push(scope.obj.notifyState);
          scope.obj.notifyCountry && al_zcs.push(scope.obj.notifyCountry);
          return al_zcs.join(', ');
        }

        function setAlTel() {
          var al_tel = [];
          scope.obj.notifyTel && al_tel.push('TL: ' + scope.obj.notifyTel);
          scope.obj.notifyFax && al_tel.push('FX: ' + scope.obj.notifyFax);
          return al_tel.join(' ');
        }

        function setIataCode() {
          if (scope.obj.agentIataCode) {
            if (scope.obj.agentIataCode.length === 7) {
              scope.iata_code1 = scope.obj.agentIataCode.substring(0, 2) + '-' + scope.obj.agentIataCode.substring(2, 3)
              scope.iata_code2 = scope.obj.agentIataCode.substring(3);
            } else {
              scope.iata_code1 = scope.obj.agentIataCode;
            }
          }
        }

        function setWtVal() {
          scope.obj.wtVal_p = scope.obj.wtVal === 'P' ? 'X' : ''
          scope.obj.wtVal_c = scope.obj.wtVal === 'C' ? 'X' : ''
        }

        function setOther() {
          scope.obj.other_p = scope.obj.other === 'P' ? 'X' : ''
          scope.obj.other_c = scope.obj.other === 'C' ? 'X' : ''
        }

        function setGoodsDesc() {
          scope.goodsDesc = scope.obj.goodsDesc.toUpperCase();
          if (scope.obj.vol) {
            scope.goodsDesc1 = 'VOLUME' + ' ' + scope.obj.vol + scope.obj.volumeCode.toUpperCase();
          } else {
            scope.goodsDesc1 = '';
          }
          var goodsDescs = [];
          if(vm.pWaybillGoodsSizes && vm.pWaybillGoodsSizes.length>0) {
            angular.forEach(vm.pWaybillGoodsSizes, function (v, k) {
              if(v.length && v.width && v.height && v.pieces) {
                goodsDescs.push(v.length + "*"+v.width+"*"+v.height+"*"+v.pieces);
              }
            });
          }
          vm.goodsDescs = goodsDescs;
        }
      }
    }
  }
];