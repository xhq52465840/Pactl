'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    vm.catalogAddrData = angular.copy(items.catalogAddrData);
    vm.msgTypeData = angular.copy(items.msgTypeData);
    vm.cancel = cancel;
    vm.ipObj1 = {};
    vm.IpData1=angular.copy(items.IpData1);
    vm.save = save;
    vm.title = items.title;
    vm.ipObj1.accessIp=vm.IpData1;
    vm.remark=angular.copy(items.IpBeizhu);
    vm.ipId=angular.copy(items.IpId)
    vm.ipObj1.remark=vm.remark;
    vm.ipObj1.accessId=vm.ipId
    setData();
    vm.airPortObj = angular.copy(items.obj);
    vm.cancel = cancel;
    vm.currencyData = angular.copy(items.currencyData);
    /**
     * 显示数据
     */
    
    function setData() {
      if (vm.IpData1) {
        for (var index = 0; index < vm.IpData1.length; index++) {
          var element = vm.IpData1[index];
          if (vm.IpData1 === element.id) {
            vm.IpData1 = element;
            break;
          }
        }
      }
      if (vm.remark) {
        for (var index = 0; index < vm.remark.length; index++) {
          var element = vm.remark[index];
          if (vm.remark === element.id) {
            vm.remark = element;
            break;
          }
        }
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.ipObj1);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];