'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    var oldSetData = obj.data;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.permissionData = [];
    vm.permissionObj = {
      permission: []
    };

    getSet();

    /**
     * 获取所有权限集合列表
     */
    function getSet() {
      $rootScope.loading = true;
      restAPI.permissionset.permissionsets.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp || [], function(v, k) {
          if(oldSetData.indexOf(v.id) < 0){
            vm.permissionData.push(v);
          }
          if(oldSetData.indexOf(v.id) > -1){
            vm.permissionObj.permission.push(v);
          }
        });
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.permissionObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];