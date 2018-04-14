'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Auth',
  function ($scope, $modalInstance, items, restAPI, Auth) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.agentData = [];
    vm.cancel = cancel;
    vm.roleData = [];
    vm.save = save;
    vm.title = obj.title;
    vm.userObj = obj.obj;
    vm.changeRole = changeRole;
    vm.checkAccount = checkAccount;
    vm.checkaccount = false;
    vm.unit = {};
    vm.getUnit = getUnit;
    initData();

    /**
     * 初始化查询条件
     */
    function initData() {
      getAgentData();
    }

    function getUnit(param) {
      vm.unit = param;
    }

    function initUnit() {
      restAPI.agentuserManage.queryunits.save({
          id: Auth.getMyUnitId()
        }, {})
        .$promise.then(function (resp) {
          vm.unit = resp.unit;
        });
    }
    /**
     * 获取机构
     */
    function getAgentData() {
      restAPI.agentuserManage.queryunits.save({
          id: Auth.getUnitId()
        }, {})
        .$promise.then(function (resp) {
          vm.agentData = resp.wmUnits;
        });
    }

    /**
     * 获取角色
     */
    function changeRole(param) {
      getUnit(param);
      vm.userObj.roles = '';
      if(vm.userObj.dept.id == Auth.getMyUnitId()){
          restAPI.unitroleactor.roles.query({
              id: vm.userObj.dept.id
          }, {})
              .$promise.then(function (resp) {
              vm.roleData = resp;
          });
      }else{
        restAPI.unitroleactor.saleroles.query({
          id: Auth.getMyUnitId(),
          saleunitid : vm.userObj.dept.id
        }, {})
            .$promise.then(function (resp) {
            vm.roleData = resp;
        });
      }
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

    /**
     * 校验用户名
     */
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
  }
];