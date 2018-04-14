'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Auth',
  function ($scope, $modalInstance, items, restAPI, Auth) {
    var vm = $scope;
    var obj = items;
    vm.agentData = obj.agentData;
    vm.cancel = cancel;
    vm.checkAccount = checkAccount;
    vm.save = save;
    vm.title = obj.title;
    vm.uploadCallback = uploadCallback;
    vm.userObj = obj.obj;
    vm.userObj.file = {};
    vm.userObj.fileObj = {};
    vm.userGroupData = obj.userGroupData;
    vm.checkaccount = false;
    vm.unit = {};
    vm.getUnit = getUnit;
    vm.getUnitRole = getUnitRole;
    vm.roleData = [];
    //initUnit();

    function getUnitRole(param){
      vm.unit = param;

      restAPI.role.allOpagentRoles.query({
        id: vm.userObj.dept.id
      }, {}).$promise.then(function (resp) {
            vm.roleData = resp;
      });
    }

    function initUnit() {
      restAPI.agentuserManage.queryunits.save({
          id: Auth.getMyUnitId()
        }, {})
        .$promise.then(function (resp) {
          vm.unit = resp.unit;
        });
    }

    function getUnit(param) {
      vm.unit = param;
      getUnitRole(param);
    }
    /**
     * 保存
     */
    function save() {
      vm.userObj.account = vm.unit.code + vm.userObj.account;
      $modalInstance.close(vm.userObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function checkAccount() {
      var resp = restAPI.user.checkaccount.get({
        account: vm.userObj.account
      }, {}).$promise.then(function (data) {
        if (!data.result) {
          vm.checkaccount = false;
        } else {
          vm.checkaccount = true;
        }
      });
    }
    /**
     * 上传图片
     * 
     * @param {any} params 
     */
    function uploadCallback(res, param) {
      var file = res;
      vm.userObj.fileObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }
  }
];