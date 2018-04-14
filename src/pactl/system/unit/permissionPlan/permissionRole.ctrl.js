'use strict';

var permissionRole_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams',
  function ($scope, restAPI, $modal, Notification, $rootScope, $stateParams) {
    var vm = $scope;
    var planObj = {
      id: '',
      name: ''
    }
    vm.add = add;
    vm.addPermission = addPermission;
    vm.remove = remove;
    vm.roleData = [];
    vm.title = '';

    check();
    /**
     * 检测id
     */
    function check() {
      planObj.id = $stateParams.id;
      planObj.name = $stateParams.name;
      vm.title = $stateParams.name;
      if (planObj.id && planObj.name) {
        search();
      } else {
        $state.go('unit.permissionPlan');
      }
    }
    /**
     * 查询
     */
    function search() {
      getRoleById();
    }
    /**
     * 根据权限来获取相关角色
     */
    function getRoleById() {
      $rootScope.loading = true;
      restAPI.permissionscheme.rolePermissionSchemes.query({
          id: planObj.id
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleData = resp || [];
        });
    }
    /**
     * 添加角色
     */
    function add() {
      var data = [];
      angular.forEach(vm.roleData, function (v, k) {
        data.push(v.id);
      });
      var addRoleDialog = $modal.open({
        template: require('./addRole.html'),
        controller: require('./addRole.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加角色',
              obj: {
                data: data
              }
            };
          }
        }
      });
      addRoleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = getRoleData(data);
        restAPI.permissionscheme.grantRoleToPermissionSchemes.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '添加角色成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 保存相关角色
     */
    function getRoleData(data) {
      var obj = {
        roleIds: [],
        permissionSchemeId: planObj.id
      };
      angular.forEach(data.role, function (v, k) {
        obj.roleIds.push(v.id);
      });
      return obj;
    }
    /**
     * 添加权限
     */
    function addPermission(item) {
      var oldPermission = getOldPermission(item);
      var addPermissionDialog = $modal.open({
        template: require('./addPermission.html'),
        controller: require('./addPermission.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加权限集',
              oldPermission: oldPermission
            };
          }
        }
      });
      addPermissionDialog.result.then(function (data) {
        var obj = getAddPermissionData(item.id, data);
        $rootScope.loading = true;
        restAPI.permissionscheme.additems.save({
            id: planObj.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '添加权限集成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 添加权限集需要的数据
     */
    function getAddPermissionData(id, data) {
      var obj = {};
      obj.objId = id + '';
      obj.objType = 'R';
      obj.items = [];
      angular.forEach(data.set, function (v, k) {
        obj.items.push(v.id);
      });
      return obj;
    }
    /**
     * 获取已存在的权限集
     */
    function getOldPermission(params) {
      var permission1 = [];
      var permission2 = [];
      angular.forEach(params.permissions, function (v, k) {
        permission1.push(v.permissionSet.id);
      });
      angular.forEach(params.permissionSchemeItemDo, function (v, k) {
        permission2.push(v.permissionSet.id);
      });
      return {
        permission1: permission1,
        permission2: permission2
      };
    }
    /**
     * 删除
     */
    function remove(data) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + data.name,
              content: '你将要删除角色' + data.name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        var obj = {};
        obj.roleId = data.id;
        obj.permissionSchemeId = planObj.id;
        restAPI.role.delRolePermission.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '删除角色成功'
              });
            }
          });
      }, function () {

      });
    }
  }
];

module.exports = angular.module('app.unit.permissionRole', []).controller('permissionRoleCtrl', permissionRole_fn);