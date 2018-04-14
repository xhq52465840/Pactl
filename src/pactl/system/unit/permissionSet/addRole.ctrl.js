'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI',
  function ($scope, $modalInstance, items, restAPI) {
    var vm = $scope;
    var obj = angular.copy(items);
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
          vm.roleData = resp.data;
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