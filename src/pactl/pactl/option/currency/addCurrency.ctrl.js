'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.currencyObj = items.obj;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.currencyObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];