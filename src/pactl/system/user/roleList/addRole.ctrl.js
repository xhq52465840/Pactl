'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.roleData = obj.roleData;
    vm.roleListObj = obj.obj;
    vm.roleTypeData = obj.roleTypeData;
    initData();
    function  initData() {
        if(obj.obj.type){
            angular.forEach(vm.roleTypeData,function (v,k) {
                if(obj.obj.type == v.id){
                    vm.roleListObj.type = v;
                }
            });
        }
        if(obj.obj.role){
            angular.forEach(vm.roleData,function (v,k) {
                if(obj.obj.role == v.id){
                    vm.roleListObj.role = v;
                }
            });
        }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.roleListObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];