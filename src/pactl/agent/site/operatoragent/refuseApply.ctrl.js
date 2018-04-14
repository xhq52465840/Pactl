'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope','Notification',
  function ($scope, $modalInstance, items, restAPI, $rootScope,Notification) {
    var vm = $scope;
    vm.param = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = vm.param.title;
    vm.relationObj = {};

    setData();

    /**
     * 设置数据
     */
    function setData(){
      vm.relationObj.name = vm.param.obj.description;
      vm.relationObj.applyDescription = vm.param.obj.agentRelationDO.applyDescription;
    }
    /**
     * 保存
     */
    function save() {
      var obj = {};
      obj.returndescription = vm.relationObj.returndescription;
      $rootScope.loading = true;
      restAPI.operatorAgentManage.refuseApply.save({
          id: vm.param.obj.agentRelationDO.id
        }, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp && resp.status===9999) {
            Notification.error({
              message: resp.msg
            });
          } else {
            Notification.success({
              message: '退回子账户关联申请成功'
            });
            $modalInstance.close(vm.relationObj);
          }
        });
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];