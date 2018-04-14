'use strict';

module.exports = ['$scope', '$modalInstance', 'items','$modal',
  function ($scope, $modalInstance,items, $modal) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.msgObj = obj.obj;
    vm.save = save;
    vm.title = obj.title;
    
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.msgObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];