'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    vm.typeObj = items.obj;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.typeObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];