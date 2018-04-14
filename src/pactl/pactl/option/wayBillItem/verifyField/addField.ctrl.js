'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.fieldObj = {};
    vm.fieldData = items.field;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;
    vm.typeData = items.typeData;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (items.obj.field) {
        for (var index = 0; index < vm.fieldData.length; index++) {
          var element = vm.fieldData[index];
          if (element.id === items.obj.field) {
            vm.fieldObj.field = element;
            break;
          }
        }
        // for (var index = 0; index < vm.typeData.length; index++) {
        //   var element = vm.typeData[index];
        //   if (element.sid === items.obj.sid) {
            vm.fieldObj.type = items.obj.checkSort;
        //     break;
        //   }
        // }        
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