'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI',
  function ($scope, $modalInstance, items, restAPI) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.authObjTypeData = [];
    vm.cancel = cancel;
    vm.peopleData = obj.peopleData;
    vm.relationObj = obj.obj;
    vm.roleData = [];
    vm.save = save;
    vm.title = obj.title;
    vm.unitData = obj.unitData;
    vm.userGroupData = obj.userGroupData;
    vm.refushRoleData = refushRoleData;
    vm.changeAuthObj = changeAuthObj;

    initObjType();
    //getUnit();

    //getPeople();
    /**
     * 初始化对象类型
     */
    function initObjType() {
      vm.authObjTypeData = [{
        authObjType: 'USER',
        name: '用户'
      }, {
        authObjType: 'GROUP',
        name: '用户组'
      }];
    }
    /**
     * 获取机构
     */
    function getUnit() {
      restAPI.unit.units.query({}, {})
        .$promise.then(function (resp) {
          vm.unitData = resp;
        });
    }
    /**
     * 获取人员
     */
    function getPeople() {
      restAPI.unit.units.query({}, {})
        .$promise.then(function (resp) {
          vm.peopleData = resp;
        });
    }
    /**
     * 获取角色
     */
    function getRole() {
      restAPI.unit.units.query({}, {})
        .$promise.then(function (resp) {
          vm.roleData = resp;
        });
    }

    /**
     * 刷新角色
     */
    function refushRoleData() {
      vm.relationObj.role = "";
      restAPI.unitroleactor.roles.query({
          id: vm.relationObj.unit.id
        }, {})
        .$promise.then(function (resp) {
          vm.roleData = resp;
        });
    }

    /**
     * 切换用户和用户组
     */
    function changeAuthObj(obj) {
      if (obj.authObjType == 'USER') {
        vm.relationObj.userGroup = "";
        vm.hiddenuser = true;
        vm.hiddengroup = false;
      }
      if (obj.authObjType == 'GROUP') {
        vm.relationObj.people = "";
        vm.hiddenuser = false;
        vm.hiddengroup = true;
      }
    }
    /**
     * 获取用户组
     */
    function getGroup() {
      restAPI.unit.units.query({}, {})
        .$promise.then(function (resp) {
          vm.peopleData = resp;
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.relationObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];