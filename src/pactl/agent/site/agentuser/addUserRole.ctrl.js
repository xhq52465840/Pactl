'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI','Auth',
  function ($scope, $modalInstance, items, restAPI,Auth) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.relationObj = obj.obj;
    vm.roleData = [];
    vm.save = save;
    vm.title = obj.title;
    vm.refushRoleData = refushRoleData;

    initObjType();

    /**
     * 初始化对象类型
     */
    function initObjType() {
      vm.relationObj.authObjType = '用户';
      refushRoleData();
    }

    /**
     * 刷新角色
     */
    function refushRoleData() {
      vm.relationObj.role = "";
      if(Auth.getUnitId()!=Auth.getMyUnitId()){
          restAPI.unitroleactor.saleroles.query({
              id: Auth.getUnitId(), //vm.relationObj.unitDO.id
              saleunitid:Auth.getMyUnitId()
          }, {})
              .$promise.then(function (resp) {
              vm.roleData = resp;
              setData();
          });
      }else{
          restAPI.role.opagentRoles.query({
              id: Auth.getUnitId() //vm.relationObj.unitDO.id
          }, {})
              .$promise.then(function (resp) {
              vm.roleData = resp;
              setData();
          });
      }

    }

    function  setData() {
        if (obj.obj.roleDOs && obj.obj.roleDOs.length) {
            vm.relationObj.role = [];
            var role = [];
            angular.forEach(obj.obj.roleDOs, function (v, k) {
                role.push(v.id);
            });
            angular.forEach(vm.roleData, function (v, k) {
                if (role.indexOf(v.id) > -1) {
                    vm.relationObj.role.push(v);
                }
            });
        }
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