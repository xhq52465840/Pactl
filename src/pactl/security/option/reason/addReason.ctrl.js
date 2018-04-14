'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.reasonObj = {};
    vm.save = save;
    vm.typeData = obj.typeData;
    vm.cancel = cancel;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.name) {
        angular.forEach(vm.typeData, function (v, k) {
          if (v.id === obj.obj.type) {
            vm.reasonObj.type = v;
          }
        });
        vm.reasonObj.name = obj.obj.name;
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.reasonObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];