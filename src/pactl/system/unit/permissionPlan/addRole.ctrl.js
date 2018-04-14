'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    var oldRoleData = obj.obj.data;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.roleData = [];
    vm.roleObj = {};

    getRole();

    /**
     * 获取所有角色列表
     */
    function getRole() {
      $rootScope.loading = true;
      restAPI.role.roles.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp, function (v, k) {
            if (oldRoleData.indexOf(v.id) < 0) {
              vm.roleData.push(v);
            }
          });
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.roleObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];