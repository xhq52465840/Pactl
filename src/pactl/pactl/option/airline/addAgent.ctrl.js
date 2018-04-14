'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
  function ($scope, $modalInstance, restAPI, items, $rootScope) {
    var vm = $scope;
    vm.agentObj = angular.copy(items.obj);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;
    vm.officeCodeData = angular.copy(items.officeCodeData)

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.agentObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];