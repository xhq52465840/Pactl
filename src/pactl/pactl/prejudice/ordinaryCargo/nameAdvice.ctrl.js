'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function ($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.obj = items.obj;
    vm.title = items.title;

    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];