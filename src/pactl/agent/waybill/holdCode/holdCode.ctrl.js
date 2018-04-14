'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI',
  function ($scope, $modalInstance, items, restAPI) {
    var vm = $scope;
    vm.add = add;
    vm.cancel = cancel;
    vm.newItems = angular.copy(items.data);
    vm.remove = remove;
    vm.save = save;
    vm.shcCodeData = items.shcCode;
    vm.selectCode = selectCode;
    vm.itemObj = {};

    /**
     * 添加新项目
     */
    function add() {
      vm.newItems.push({
        shc: '',
        discription: '',
        remarks: ''
      });
    }
    /**
     * 删除项目
     */
    function remove(index) {
      vm.newItems.splice(index, 1);
    }
    /**
     * 
     * 选择特货代码
     */
    function selectCode(param, item) {
      item.discription = param.sccDesc;
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.newItems);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];