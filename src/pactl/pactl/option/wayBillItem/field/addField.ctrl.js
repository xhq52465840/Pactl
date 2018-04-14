'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.field = items.field;
    vm.fieldObj = {};
    vm.fieldType = items.fieldType;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (items.obj.field) {
        vm.isEdit = true;
        for (var index = 0; index < vm.fieldType.length; index++) {
          var element = vm.fieldType[index];
          if (element.id === items.obj.fieldSort) {
            vm.fieldObj.fieldSort = element;
            break;
          }
        }
        for (var index = 0; index < vm.field.length; index++) {
          var element = vm.field[index];
          if (element.columnName === items.obj.field) {
            vm.fieldObj.field = element;
            break;
          }
        }        
        vm.fieldObj.fieldDescriptionEn = items.obj.fieldDescriptionEn;
        vm.fieldObj.fieldDescriptionCn = items.obj.fieldDescriptionCn;
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