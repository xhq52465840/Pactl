'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$timeout',
  function ($scope, $modalInstance, items, $timeout) {
    var vm = $scope;
    vm.items = items;
    vm.cancel = cancel;

    // 取消
    function cancel() {
      $modalInstance.dismiss();
    }   
  }
];