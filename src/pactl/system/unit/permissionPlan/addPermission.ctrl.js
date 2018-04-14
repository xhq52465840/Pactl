'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.permissionData = [];
    vm.permissionObj = {
      set: []
    };

    getPermission();

    /**
     * 获取所有权限集列表
     */
    function getPermission() {
      $rootScope.loading = true;
      restAPI.permissionset.permissionsets.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp || [], function(v, k) {
            if(obj.oldPermission.permission1.indexOf(v.id) < 0){
              vm.permissionData.push(v);
              if(obj.oldPermission.permission2.indexOf(v.id) > -1){
                vm.permissionObj.set.push(v);
              }
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