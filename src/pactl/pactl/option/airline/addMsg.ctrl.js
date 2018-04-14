'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.msgObj = items.obj;
    vm.save = save;
    vm.title = items.title;
    vm.typeData = items.typeData;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.msgObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];