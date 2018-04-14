'use strict';

var userGroup_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $state) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.userGroupObj = {};
    vm.userGroupData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.showUser = showUser;

    search();

    /**
     * 查询
     */
    function search() {
      getUserGroupData();
    }
    /**
     * 获取用户组数据
     */
    function getUserGroupData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.userGroup.pageUserGroups.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.userGroupData = resp.data;
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
      angular.forEach(vm.userGroupObj, function (v, k) {
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
      var addUserGroupDialog = $modal.open({
        template: require('./addUserGroup.html'),
        controller: require('./addUserGroup.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增用户组',
              obj: {}
            };
          }
        }
      });
      addUserGroupDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.userGroup.usergroups.save({}, data)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '添加用户组成功'
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
      var editUserGroupDialog = $modal.open({
        template: require('./addUserGroup.html'),
        controller: require('./addUserGroup.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑用户组：' + param.name,
              obj: {
                name: param.name
              }
            };
          }
        }
      });
      editUserGroupDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.userGroup.editUserGroups.put({
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
                message: '编辑用户组成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 删除
     */
    function remove(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除用户组：' + param.name,
              content: '你将要删除用户组：' + param.name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.userGroup.delUserGroups.remove({
            id: param.id
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
                message: '删除用户组成功'
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 显示用户详情
     */
    function showUser(data) {
      $state.go('user.user', {
        userGroup: data.id
      });
    }
  }
];

module.exports = angular.module('app.user.userGroup', []).controller('userGroupCtrl', userGroup_fn);