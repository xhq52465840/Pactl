'use strict';

var senior_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.save = save;
    vm.seniors = {
      data1: {},
      data2: {},
      data3: {}
    };

    search();
    vm.codeData = [{
      "name": "否",
      "id": "0"
    }, {
      "name": "是",
      "id": "1"
    }]

    /**
     * 高级查询
     */
    function search() {
      $rootScope.loading = true;
      restAPI.systemSet.queryList.save({}, $.param({
        regKeySeq: "SYSYEM_SETTINGS_ADVANCED"
      })).$promise.then(function (resp) {
        $rootScope.loading = false;
        if (resp.ok) {
          angular.forEach(resp.data, function (v, k) {
            if (v.regKey === 'accessoryPath') {
              vm.seniors.data1 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'accessorySize') {
              vm.seniors.data2 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'supportZIP') {
              if (v.regVal) {
                if (v.regVal === '0') {
                  v.regVal = vm.codeData[0];
                } else if (v.regVal === '1') {
                  v.regVal = vm.codeData[1];
                }
              }
              vm.seniors.data3 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              }
            }
          });
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }

    /**
     *  update保存
     */
    function save() {
      var data = [],
        obj1 = angular.copy(vm.seniors.data1),
        obj2 = angular.copy(vm.seniors.data2),
        obj3 = angular.copy(vm.seniors.data3);
      data.push(obj1);
      data.push(obj2);
      obj3.regVal && (obj3.regVal = obj3.regVal.id);
      data.push(obj3);
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

module.exports = angular.module('app.systemSet.senior', []).controller('seniorCtrl', senior_fn);