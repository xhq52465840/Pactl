'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    vm.title = items.title;
    vm.nameAdviceObj = items.obj;
    vm.save = save;
    vm.cancel = cancel;
    vm.changeText7 = changeText7;

    /**
     * 只能输入大写和特殊字符
     */
    function changeText7(text) {
      try {
        vm.nameAdviceObj[text] = vm.nameAdviceObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.nameAdviceObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];