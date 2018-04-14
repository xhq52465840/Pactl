'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.itemObj = angular.copy(items.obj);
    vm.save = save;
    vm.title = items.title;
    vm.typeData = items.typeData;

    setData();
    /**
     * 显示数据
     */
    function setData() {
      if (vm.itemObj.catalogType) {
        for (var index = 0; index < vm.typeData.length; index++) {
          var element = vm.typeData[index];
          if (vm.itemObj.catalogType === element.code) {
            vm.itemObj.catalogType = element;
            break;
          }
        }
      }
      vm.itemObj.ftp = vm.itemObj.ftp === '1' ? true : false;
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