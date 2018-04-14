'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.aisleObj = {};
    vm.save = save;
    vm.stationData = obj.stationData;
    vm.cancel = cancel;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.id) {
        vm.aisleObj.id = obj.obj.id;
        vm.aisleObj.name = obj.obj.name;
        vm.aisleObj.remark = obj.obj.remark;
        if(obj.obj.ctid){
          for (var index = 0; index < vm.stationData.length; index++) {
            var element = vm.stationData[index];
            if(element.id === obj.obj.ctid){
              vm.aisleObj.ctid = element;
              break;
            }
          }
        }       
      } 
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.aisleObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];