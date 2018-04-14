'use strict';

var role_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.roleObj = {};
    vm.roleData = [];
    vm.remove = remove;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.permission = permission;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getRoleData();
    }
    /**
     * 获取角色数据
     */
    function getRoleData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.role.pageRoles.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleData = resp.data;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        rule: []
      };
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      angular.forEach(vm.roleObj, function (v, k) {
        obj.rule.push([{
          key: k,
          op: 'like',
          value: v
        }]);
      });
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新增
     */
    function add() {
      var addRoleDialog = $modal.open({
        template: require('./addRole.html'),
        controller: require('./addRole.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增角色',
              obj: {},
              isedit: false
            };
          }
        }
      });
      addRoleDialog.result.then(function (data) {
        var obj = {};
        $rootScope.loading = true;
        var permissionSetIds = [];
        angular.forEach(data.permission, function (v, k) {
          permissionSetIds.push(v.id);
        });
        obj.permissionSetIds = permissionSetIds.join(',') + '';
        obj.name = data.name;
        obj.description = data.description;
        restAPI.role.addRoles.save({}, obj)
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
     * 编辑
     */
    function edit(param) {
      var editRoleDialog = $modal.open({
        template: require('./addRole.html'),
        controller: require('./addRole.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑角色：' + param.name,
              obj: {
                name: param.name,
                description: param.description
              },
              isedit: true
            };
          }
        }
      });
      editRoleDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.role.editRole.put({
            id: param.id
          }, data)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '编辑角色成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除角色：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.role.editRole.remove({
            id: id
          }, {})
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
    /**
     * 权限集合
     */
    function permission(param) {
      var data = [];
      angular.forEach(param.permissions, function (v, k) {
        data.push(v.permissionSet.id);
      });
      var addPermissionDialog = $modal.open({
        template: require('./addSet.html'),
        controller: require('./addSet.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '关联权限集合',
              data: data
            };
          }
        }
      });
      addPermissionDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = getPermissionData(param.id, data.permission);
        restAPI.role.grantPermissionSetsToRole.save({}, $.param(obj))
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '关联权限集合成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 需要保存的数据
     */
    function getPermissionData(id, param) {
      var obj = {};
      obj.roleId = id;
      obj.permissionSetIds = [];
      angular.forEach(param, function (v, k) {
        obj.permissionSetIds.push(v.id);
      });
      obj.permissionSetIds = obj.permissionSetIds.join(',') + '';
      return obj;
    }
  }
];

module.exports = angular.module('app.user.role', []).controller('roleCtrl', role_fn);