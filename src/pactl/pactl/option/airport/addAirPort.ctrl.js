'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.airPortObj = angular.copy(items.obj);
    vm.cancel = cancel;
    vm.currencyData = angular.copy(items.currencyData);
    vm.save = save;
    vm.title = items.title;

    setData();
    
    /**
     * 显示数据
     */
    function setData() {
      if(items.obj.currencyCode){
        for (var index = 0; index < vm.currencyData.length; index++) {
          var element = vm.currencyData[index];
          if(vm.airPortObj.currencyCode === element.currencyCode){
            vm.airPortObj.currency = element;
            break;
          }
        }
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.airPortObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];