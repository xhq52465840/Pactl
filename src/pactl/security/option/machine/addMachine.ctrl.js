'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.machineObj = {};
    vm.save = save;
    vm.stationData = obj.stationData;
    vm.cancel = cancel;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if(obj.obj.id){
        for (var index = 0; index < vm.stationData.length; index++) {
          var element = vm.stationData[index];
          if(element.id === obj.obj.ctid){
            vm.machineObj.ctid = element;
            break;
          }
        }
        vm.machineObj.id = obj.obj.id;
        vm.machineObj.name = obj.obj.name;
        vm.machineObj.remark = obj.obj.remark;
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.machineObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];