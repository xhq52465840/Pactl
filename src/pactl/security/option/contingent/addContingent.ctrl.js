'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.contingent = {};
    vm.save = save;
    vm.stationData = obj.stationData;
    vm.cancel = cancel;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.id) {
        vm.contingent.id = obj.obj.id;
        vm.contingent.unitid = obj.obj.unitid;
        vm.contingent.name = obj.obj.name;
        vm.contingent.mac = obj.obj.mac;
        vm.contingent.remark = obj.obj.remark;
        vm.contingent.eMail = obj.obj.eMail;
        if(obj.obj.ctid){
          for (var index = 0; index < vm.stationData.length; index++) {
            var element = vm.stationData[index];
            if(element.id === obj.obj.ctid){
              vm.contingent.ctid = element;
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
      $modalInstance.close(vm.contingent);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];