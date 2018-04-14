'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Auth',
  function ($scope, $modalInstance, items, restAPI, $rootScope, Auth) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.relationObj = {};

    getRoleData();

    /**
     * 设置数据
     */
    function setData() {
      vm.relationObj.name = obj.obj.description;
      vm.relationObj.applyDescription = obj.obj.agentRelationDO.applyDescription;
      vm.relationObj.role = [];
      angular.forEach(vm.roleData, function (v, k) {
        vm.relationObj.role.push(v);
      });
    }

    /**
     * 获取角色数据
     */
    function getRoleData() {
      $rootScope.loading = true;
      restAPI.role.opagentRolesByType.query({
          id: Auth.getUnitId(),
          type:'salesAgent'
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleData = resp;
          setData();
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.relationObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];