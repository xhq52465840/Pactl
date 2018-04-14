'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
  function ($scope, $modalInstance, restAPI, items, $rootScope) {
    var vm = $scope;
    vm.securityEasyCargoAgreeBook = items.securityEasyCargoAgreeBook;
    vm.cancel = cancel;
    vm.save = save;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.securityEasyCargoAgreeBook);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];