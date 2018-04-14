'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    vm.catalogAddrData = angular.copy(items.catalogAddrData);
    vm.msgTypeData = angular.copy(items.msgTypeData);
    vm.cancel = cancel;
    vm.itemObj = angular.copy(items.obj);
    vm.save = save;
    vm.title = items.title;
    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (vm.itemObj.recCatalog) {
        for (var index = 0; index < vm.catalogAddrData.length; index++) {
          var element = vm.catalogAddrData[index];
          if (vm.itemObj.recCatalog === element.id) {
            vm.itemObj.recCatalog = element;
            break;
          }
        }
      }
      if (vm.itemObj.recCatalog2) {
        for (var index = 0; index < vm.catalogAddrData.length; index++) {
          var element = vm.catalogAddrData[index];
          if (vm.itemObj.recCatalog2 === element.id) {
            vm.itemObj.recCatalog2 = element;
            break;
          }
        }
      }
      if (vm.itemObj.msgType) {
        for (var index = 0; index < vm.msgTypeData.length; index++) {
          var element = vm.msgTypeData[index];
          if (vm.itemObj.msgType === element.code) {
            vm.itemObj.msgType = element;
            break;
          }
        }
      }
    }
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