'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.userGroupObj = obj.obj;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.userGroupObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];