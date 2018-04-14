'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.save = save;
    vm.tempObj = {};
    vm.title = items.title;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.tempObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];