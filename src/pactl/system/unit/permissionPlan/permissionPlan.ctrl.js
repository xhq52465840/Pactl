'use strict';

var permissionPlan_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $state) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.planObj = {};
    vm.planData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.role = role;
    vm.search = search;
    vm.planTypeData = [];

    search();


    /**
     * 查询
     */
    function search() {
      getPlanData();
      getPalnTypeData();
    }
    /**
     * 获取方案数据
     */
    function getPlanData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.permissionscheme.pagePermissionschemes.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.planData = resp.data;
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
      angular.forEach(vm.planObj, function (v, k) {
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
      var addPlanDialog = $modal.open({
        template: require('./addPlan.html'),
        controller: require('./addPlan.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增权限方案',
              planTypeData: vm.planTypeData,
              obj: {}
            };
          }
        }
      });
      addPlanDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.description = data.description;
        obj.name = data.name;
        obj.type = data.type.id;
        restAPI.permissionscheme.permissionschemes.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '添加权限方案成功'
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
      var roleDialog = $modal.open({
        template: require('./addPlan.html'),
        controller: require('./addPlan.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑权限方案：' + param.name,
              planTypeData: vm.planTypeData,
              obj: {
                name: param.name,
                description: param.description,
                type: param.type
              }
            };
          }
        }
      });
      roleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.description = data.description;
        obj.name = data.name;
        obj.type = data.type.id;
        restAPI.permissionscheme.editPermissionscheme.put({
            id: param.id
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
                message: '编辑权限方案成功'
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
              content: '你将要删除权限方案' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.permissionscheme.editPermissionscheme.remove({
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
                message: '删除权限方案成功'
              });
            }
          });
      }, function () {

      });
    }

    function getPalnTypeData() {
      vm.planTypeData = [{
        id: 'terminal',
        name: '货站'
      }, {
        id: 'security',
        name: '安检'
      }, {
        id: 'agency',
        name: '操作代理'
      }, {
        id: 'salesAgent',
        name: '子账户'
      }];
    }
    /**
     * 角色
     */
    function role(param) {
      $state.go('unit.permissionRole', {
        id: param.id,
        name: param.name
      });
      // var roleDialog = $modal.open({
      //   template: require('./roleList.html'),
      //   controller: require('./roleList.ctrl.js'),
      //   size: 'lg',
      //   backdrop: 'static',
      //   keyboard: false,
      //   resolve: {
      //     items: function () {
      //       return {
      //         title: '添加角色：' + param.name,
      //         obj: {
      //           id: param.id + ''
      //         }
      //       };
      //     }
      //   }
      // });
    }
  }
];

module.exports = angular.module('app.unit.permissionPlan', []).controller('permissionPlanCtrl', permissionPlan_fn);