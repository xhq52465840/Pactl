'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
  function ($scope, $modalInstance, restAPI,items, $rootScope) {
      var vm = $scope;
      var obj = angular.copy(items);
      vm.cancel = cancel;
      vm.save = save;
      vm.title = obj.title;
      vm.roleObj = obj.obj;
      vm.permissionData = [];
      vm.isedit = obj.isedit;
      if(!vm.isedit) {
        getSet();
      }

    /**
     * 获取所有权限集合列表
     */
    function getSet() {
      $rootScope.loading = true;
      restAPI.permissionset.permissionsets.query({}, {})
          .$promise.then(function (resp) {
        $rootScope.loading = false;
        angular.forEach(resp || [], function(v, k) {
            vm.permissionData.push(v);
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