'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope',
  function($scope, $modalInstance, items, $rootScope) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.itemObj = angular.copy(items.obj);
    vm.save = save;
    vm.title = items.title;
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.itemObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];