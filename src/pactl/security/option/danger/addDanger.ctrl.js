'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.dangerObj = obj.obj;
    vm.save = save;
    vm.cancel = cancel;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.dangerObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];