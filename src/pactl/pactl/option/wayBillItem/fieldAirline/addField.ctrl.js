'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.airData = items.airData;
    vm.airportData = items.airportData;
    vm.canEdit = false;
    vm.countryData = items.countryData;
    vm.fieldObj = {};
    vm.fieldData = items.field;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (items.obj.field) {
        vm.canEdit = true;
        for (var index = 0; index < vm.airData.length; index++) {
          var element = vm.airData[index];
          if (element.airCode === items.obj.airline) {
            vm.fieldObj.air = element;
            break;
          }
        }
        for (var index = 0; index < vm.fieldData.length; index++) {
          var element = vm.fieldData[index];
          if (element.id === items.obj.field) {
            vm.fieldObj.field = element;
            break;
          }
        }
        for (var index = 0; index < vm.airportData.length; index++) {
          var element = vm.airportData[index];
          if (element.airportCode === items.obj.dest) {
            vm.fieldObj.dest = element;
            break;
          }
        }
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryName === items.obj.country) {
            vm.fieldObj.country = element;
            break;
          }
        }        
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