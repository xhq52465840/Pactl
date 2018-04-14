'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.obj = obj.obj;
    vm.cancel = cancel;

    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];