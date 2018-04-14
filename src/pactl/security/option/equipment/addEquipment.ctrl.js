'use strict';

module.exports = ['$scope', '$modalInstance', 'items','Notification',
  function ($scope, $modalInstance, items,Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.equipmentObj = {};
    vm.machineData = angular.copy(obj.machineData);
    vm.save = save;
    vm.stationData = obj.stationData;
    vm.cancel = cancel;
    vm.setCt = setCt;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.id) {
        vm.equipmentObj.id = obj.obj.id;
        vm.equipmentObj.name = obj.obj.name;
        vm.equipmentObj.mac = obj.obj.mac;
        vm.equipmentObj.remark = obj.obj.remark;
        if(obj.obj.machine){
          for (var index = 0; index < vm.machineData.length; index++) {
            var element = vm.machineData[index];
            for (var j = 0; j < vm.stationData.length; j++) {
              var e = vm.stationData[j];
              if(e.id === element.ctid){
                element.name = e.name+'-'+element.name;
              }
            }
            if(element.id === obj.obj.machine){
              vm.equipmentObj.machine = element;
              break;
            }
          }
        } 

        if(vm.equipmentObj.machine){
          for (var index = 0; index < vm.stationData.length; index++) {
            var element = vm.stationData[index];
            if(element.id === vm.equipmentObj.machine.ctid){
              vm.equipmentObj.ct = element;
              break;
            }
          }
        } else {
          vm.equipmentObj.ct = {};
        }

      }
    }

    function setCt() {
      if(vm.equipmentObj.machine){
        for (var index = 0; index < vm.stationData.length; index++) {
          var element = vm.stationData[index];
          if(element.id === vm.equipmentObj.machine.ctid){
            vm.equipmentObj.ct = element;
            break;
          }
        }
      } else {
        vm.equipmentObj.ct = {};
      }
    }
    /**
     * 保存
     */
    function save() {
      if(!vm.equipmentObj.ct.id) {
        Notification.error({
            message: '你选择的安检机没有维护对应的货站，请先维护！'
        });
      } else {
        $modalInstance.close(vm.equipmentObj);
      }
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];