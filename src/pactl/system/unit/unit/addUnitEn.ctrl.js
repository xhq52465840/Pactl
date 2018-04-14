'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'Notification',
  function ($scope, $modalInstance, items, Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.unitEn = obj.obj;

    initData();

    function  initData() {
    }

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.unitEn);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];