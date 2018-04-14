'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.stamp = obj.obj;
    vm.save = save;
    vm.cancel = cancel;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.stamp);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];