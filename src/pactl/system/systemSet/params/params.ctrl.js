'use strict';

var params_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.save = save;
    vm.onlyNum = onlyNum;
    vm.sentEmails = [];
    vm.params = {
      data1: {},
      data2: {},
      data3: {},
      data4: {},
      data5: {},
      data6: {},
      data7: {},
      data8: {},
      data9: {},
      data10: {},
      data11: {},
      data12: {},
      data13: {},
      data14: {},
      data15: {},
      data16: {},
      data17: {},
      data18: {},
      data19: {},
      data20: {}
    };
    vm.codeData = [{
      "name": "增量",
      "id": "1"
    }, {
      "name": "全部",
      "id": "2"
    }]
    sentEmail();

    /**
     * 获取所有发件箱
     */
    function sentEmail() {
      $rootScope.loading = true;
      restAPI.systemEmail.queryList.save({}, {
          emailType: '2'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp && resp.rows || [], function (v, k) {
            vm.sentEmails.push(v.mailAccount);
          });
          search();
        });
    }

    /**
     *业务参数查询
     */
    function search() {
      $rootScope.loading = true;
      restAPI.systemSet.queryList.save({}, $.param({
        regKeySeq: "SYSYEM_SETTINGS_BUSINESS_PARAM"
      })).$promise.then(function (resp) {
        $rootScope.loading = false;
        if (resp.ok) {
          angular.forEach(resp.data, function (v, k) {
            if (v.regKey === 'airlineNum') {
              vm.params.data1 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'expirationTime') {
              vm.params.data2 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'urgency') {
              vm.params.data3 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'veryUrgency') {
              vm.params.data4 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'msgToWaybill') {
              if (v.regVal) {
                if (v.regVal === '1') {
                  v.regVal = vm.codeData[0];
                } else if (v.regVal === '2') {
                  v.regVal = vm.codeData[1];
                }
              }
              vm.params.data5 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              }
            } else if (v.regKey === 'checkBillDuration') {
              vm.params.data6 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'notEWaybillDiff') {
              if (v.regVal) {
                if (v.regVal === '1') {
                  v.regVal = vm.codeData[0];
                } else if (v.regVal === '2') {
                  v.regVal = vm.codeData[1];
                }
              }
              vm.params.data7 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              }
            } else if (v.regKey === 'indexDays') {
              vm.params.data8 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'shipmentHours') {
              vm.params.data9 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'systemEmail') {
              for (var i = 0; i < vm.sentEmails.length; i++) {
                vm.params.data10 = v;
                var element = vm.sentEmails[i];
                if (element.id === +v.regVal) {
                  vm.params.data10.regVal = element
                  break;
                }
              };
            } else if (v.regKey === 'agentShipmentDays') {
              vm.params.data11 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'pactlRecEmail') {
              vm.params.data12 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'fCheckPicDays') {
              vm.params.data13 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'fCheckPicEmail') {
              vm.params.data14 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'fCheckTimeout1') {
              vm.params.data15 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'fCheckTimeout2') {
              vm.params.data16 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'agreeBook') {
              vm.params.data17 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'shcCode') {
              vm.params.data18 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            }else if (v.regKey === 'delBookEmailDays') {
            	console.log(v)
             vm.params.data19 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
             };
           } else if (v.regKey === 'delMsgEmailDays') {
              vm.params.data20 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
             };        	   
           }
          })
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }

    function onlyNum(param) {
      try {
      	if(vm.params[param].regVal<1){
      		 vm.params[param].regVal = ''
      	}else{
        vm.params[param].regVal = vm.params[param].regVal.replace(/[^0-9]/g, '');}
      } catch (error) {
        return;
      }
    }

    /**
     *  update保存
     */
    function save() {
      var data = [],
        obj1 = angular.copy(vm.params.data1),
        obj2 = angular.copy(vm.params.data2),
        obj3 = angular.copy(vm.params.data3),
        obj4 = angular.copy(vm.params.data4),
        obj5 = angular.copy(vm.params.data5),
        obj6 = angular.copy(vm.params.data6),
        obj7 = angular.copy(vm.params.data7),
        obj8 = angular.copy(vm.params.data8),
        obj9 = angular.copy(vm.params.data9),
        obj10 = angular.copy(vm.params.data10),
        obj11 = angular.copy(vm.params.data11),
        obj12 = angular.copy(vm.params.data12),
        obj13 = angular.copy(vm.params.data13),
        obj14 = angular.copy(vm.params.data14),
        obj15 = angular.copy(vm.params.data15),
        obj16 = angular.copy(vm.params.data16),
        obj17 = angular.copy(vm.params.data17),
        obj18 = angular.copy(vm.params.data18),
      	obj19 = angular.copy(vm.params.data19),
        obj20 = angular.copy(vm.params.data20)
      data.push(obj1);
      data.push(obj2);
      data.push(obj3);
      data.push(obj4);
      obj5.regVal && (obj5.regVal = obj5.regVal.id);
      data.push(obj5);
      data.push(obj6);
      obj7.regVal && (obj7.regVal = obj7.regVal.id);
      data.push(obj7);
      data.push(obj8);
      data.push(obj9);
      obj10.regVal = obj10.regVal ? obj10.regVal.id : '';
      data.push(obj10);
      data.push(obj11);
      data.push(obj12);
      data.push(obj13);
      data.push(obj14);
      data.push(obj15);
      data.push(obj16);
      data.push(obj17);
      data.push(obj18);
      data.push(obj19);
      data.push(obj20);
      $rootScope.loading = true;
      restAPI.systemSet.updateList.save({}, data)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '更新成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

  }
];

module.exports = angular.module('app.systemSet.params', []).controller('paramsCtrl', params_fn);