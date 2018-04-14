'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function ($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.airData = obj.airData;
    vm.cancel = cancel;
    vm.ruleObj = obj.obj;
    vm.save = save;
    vm.stationData = obj.stationData;
    vm.title = obj.title;

    setData();

    /**
     * 根据传的数据做显示
     */
    function setData() {
      if(obj.obj.percentage>=0){
        for (var index = 0; index < vm.airData.length; index++) {
          var element = vm.airData[index];
          if(obj.obj.fltCode === element.airCode){
            vm.ruleObj.airLine = element;
            break;
          }
        }
        for (var index = 0; index < vm.stationData.length; index++) {
          var element = vm.stationData[index];
          if(obj.obj.goodsStation === element.id){
            vm.ruleObj.goodsStation = element;
            break;
          }
        }
        vm.ruleObj.percentage = obj.obj.percentage;
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.ruleObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];