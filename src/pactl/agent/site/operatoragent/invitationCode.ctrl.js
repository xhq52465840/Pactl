'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.planData = [];
    vm.save = save;
    vm.title = obj.title;
    vm.unitObj = {};
    vm.query = query;

    setData();

    function setData(){
      restAPI.operatorAgentManage.queryInvitationCode.save({id:obj.unit},{})
          .$promise.then(function (resp) {
        vm.unitObj = resp;
      });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.unitObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function query() {
      restAPI.operatorAgentManage.queryInvitationCode.query({id:obj.unit},{})
          .$promise.then(function (resp) {
        vm.unitObj.code= resp[0].invitationCode;
      });
    }
  }
];