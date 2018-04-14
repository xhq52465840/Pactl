'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    vm.items = items;
    vm.cancel = cancel;

    // 取消
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];