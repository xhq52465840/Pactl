'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.stopObj = obj.obj;
    vm.save = save;
    vm.cancel = cancel;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.stopObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];