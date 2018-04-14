'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI','Notification','$rootScope', 'Auth',
  function ($scope, $modalInstance, items, restAPI,Notification,$rootScope, Auth) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.planData = [];
    vm.roleData = [];
    vm.save = save;
    vm.title = obj.title;
    vm.uploadCallback = uploadCallback;
    vm.unitObj = {};
    vm.unitObj.file = {};
    vm.unitObj.fileObj = {};
    vm.changeText = changeText;
    vm.isEdit = obj.isEdit;
    vm.isSuper = obj.isSuper;
    vm.unitType = obj.obj.unitType;

    /**
     * 只能输入大写和特殊字符
     */
    function changeText(text) {
      try {
        vm.unitObj[text] = vm.unitObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }

    getPlan();

    /**
     * 获取权限方案
     */
    function getPlan() {
      $rootScope.loading = true;
      restAPI.permissionscheme.permissionschemesbytype.save({}, {
          types: 'salesAgent'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.planData = resp.data;
          getRoleData();
        });
    }
    /**
     * 获取角色数据
     */
    function getRoleData() {
      $rootScope.loading = true;
      restAPI.role.opagentRolesByType.query({
          id: Auth.getUnitId(),
          type:'salesAgent'
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleData = resp;
          setData();
        });
    }
    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.id) {
        vm.isedit = true;
        vm.unitObj.code = obj.obj.code;
        vm.unitObj.name = obj.obj.name;
        vm.unitObj.ename = obj.obj.ename;
        vm.unitObj.aliase = obj.obj.aliase;
        vm.unitObj.id = obj.obj.id;
        vm.unitObj.operunit = Auth.getUnitId();
        if (obj.obj.unitSchemeDO.length) {
          vm.unitObj.plan = [];
          var plan = [];
          angular.forEach(obj.obj.unitSchemeDO, function (v, k) {
            plan.push(v.pScheme.id);
          });
          angular.forEach(vm.planData, function (v, k) {
            if (plan.indexOf(v.id) > -1) {
              vm.unitObj.plan.push(v);
            }
          });
        }
        if (obj.obj.roles.length) {
          vm.unitObj.role = [];
          var role = [];
          angular.forEach(obj.obj.roles, function (v, k) {
            role.push(v.id);
          });
          angular.forEach(vm.roleData, function (v, k) {
            if (role.indexOf(v.id) > -1) {
              vm.unitObj.role.push(v);
            }
          });
        }
        vm.unitObj.description = obj.obj.description;
        vm.unitObj.sort = obj.obj.sort;
        vm.unitObj.isvalid = obj.obj.isvalid;
        if (obj.obj.avatar) {
          vm.unitObj.fileObj = {
            id: obj.obj.avatar,
            url: obj.obj.avatarUrl
          };
        }
        if (obj.obj.unitPropertyDO.length) {
          angular.forEach(obj.obj.unitPropertyDO, function (v, k) {
            if (v.propName == 'IATACode') {
              vm.unitObj.IATACode = v.propValue;
            }
          });
        }
      } else {
        vm.isedit = false;
      }
    }
     /**
     * 获取新增的数据
     *
     */
    function getAddData(data) {
      var obj = {};
      obj.avatar = data.fileObj && data.fileObj.id;
      obj.code = data.code;
      obj.name = data.name;
      obj.ename = data.ename;
      obj.unitType = 'salesAgent';
      obj.isvalid = '1';
      obj.plan = [];
      angular.forEach(data.plan, function (v, k) {
        obj.plan.push(v.id)
      });
      obj.plan = obj.plan.join(',');
      obj.role = [];
      angular.forEach(data.role, function (v, k) {
        obj.role.push(v.id)
      });
      obj.role = obj.role.join(',');
      obj.description = data.description;
      obj.sort = data.sort;
      obj.unitprop = [];
      obj.unitprop.push({
        propname: 'IATACode',
        propvalue: data.IATACode
      });
      obj.operunit = Auth.getUnitId();
      return obj;
    }
    /**
     * 保存
     */
    function save() {
      if(vm.isedit) {
        var obj = getAddData(vm.unitObj);
        $rootScope.loading = true;
        restAPI.operatorAgentManage.updateSaleUnit.put({
            id: vm.unitObj.id,
            unit: vm.unitObj.operunit
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              Notification.success({
                message: '修改销售代理成功'
              });
              $modalInstance.close(vm.unitObj);
            }
          });
      } else {
        var obj = getAddData(vm.unitObj);
        obj.unit = Auth.getUnitId();
        $rootScope.loading = true;
        restAPI.operAgent.addoperagents.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              Notification.success({
                message: '添加销售代理成功'
              });
              $modalInstance.close(vm.unitObj);
            }
          });
      }
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 上传图片
     * 
     * @param {any} params 
     */
    function uploadCallback(res, param) {
      var file = res;
      vm.unitObj.fileObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }
  }
];