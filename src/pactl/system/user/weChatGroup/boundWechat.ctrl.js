'use strict';

module.exports = ['$scope', 'restAPI', '$modalInstance', 'items',
  function($scope, restAPI, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.agentData = obj.agentData;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.wechat = obj.obj;

    /**
     * 根据code查询opid
     */
    if (vm.wechat.agentCode) {
      for (var index = 0; index < vm.agentData.length; index++) {
        var element = vm.agentData[index];
        if (element.code === vm.wechat.agentCode) {
          var opid = element.id;
          break;
        }
      }
      userData(opid);
    }
    /**
     * 根据机构代码opid查询用户
     */
    function userData(opid) {
      restAPI.wechat.usersByOpUnit.query({
          opid: opid
        }, {})
        .$promise.then(function(resp) {
          vm.userData = resp;
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.wechat);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];