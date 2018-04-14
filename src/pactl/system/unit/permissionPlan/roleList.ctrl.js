'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    var planObj = obj.obj;
    vm.add = add;
    vm.addPermission = addPermission;
    vm.cancel = cancel;
    vm.remove = remove;
    vm.roleData = [];
    vm.title = obj.title;


    getRoleById();

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
          vm.roleData = resp;
        });
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
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
              getRoleById();
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
    function addPermission(data) {
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
              obj: {}
            };
          }
        }
      });
      addPermissionDialog.result.then(function (data) {
        $rootScope.loading = true;
      }, function (resp) {

      });
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
              getRoleById();
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