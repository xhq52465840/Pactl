'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope','Notification','Auth',
  function ($scope, $modalInstance, items, restAPI, $rootScope,Notification,Auth) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.title = obj.title;
    vm.applyObj = {};
    vm.submit = submit;
    /**
     * 保存
     */
    function submit() {
      $rootScope.loading = true;
        restAPI.saleAgent.applyoperagents.save({
            id: Auth.getMyUnitId()
        }, vm.applyObj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp && resp.status===9999) {
            Notification.error({
              message: resp.msg
            });
          } else if(resp && !resp.ok) {
            Notification.error({
              message: resp.msg
            });
          }else {
            Notification.success({
              message: '申请关联新的主账户成功'
            });
            $modalInstance.close(vm.applyObj);
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