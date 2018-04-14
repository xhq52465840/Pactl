'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.fieldObj = angular.copy(items.obj);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;
    
    setData();

    /**
     * 显示编辑 
     */
    function setData() {
      if(items.obj.sid){
        vm.fieldObj.isEdit = true;
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.fieldObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }    
  }
];