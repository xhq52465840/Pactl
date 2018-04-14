'use strict';

var roleList_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.roleListObj = {};
    vm.roleListData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.remove = remove;
    vm.roleTypeData = [];
    vm.roleData = [];
    getRoleTypeData();


    getRoleData();

    /**
     * 获取所有的角色列表
     */
    function getRoleData() {
      $rootScope.loading = true;
      restAPI.grantRole.roles.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleData = resp;
          search();
        });      
    }

    /**
     * 查询
     */
    function search() {
      getRoleListData();
    }
    /**
     * 获取角色数据
     */
    function getRoleListData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.grantRole.pageGrantRoles.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleListData = resp.data;
          angular.forEach(vm.roleListData,function (v,k) {
              if(v.role){
                angular.forEach(vm.roleData,function (m,n) {
                    if(v.role == m.id){
                        v.role = m;
                    }
                });
              }
          });
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
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      angular.forEach(vm.roleListObj, function (v, k) {
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
              roleTypeData: vm.roleTypeData,
              roleData: vm.roleData,
              obj: {}
            };
          }
        }
      });
      addRoleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.roleId = data.role.id;
        obj.type = data.type.id;
        restAPI.grantRole.addGrantRoles.save({}, JSON.stringify(obj))
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
     * 修改
     */
    function edit(param) {
      var roleName = '';
      if(param.role && param.role.name) {
        roleName = param.role.name;
      }
      var addRoleDialog = $modal.open({
        template: require('./addRole.html'),
        controller: require('./addRole.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '修改角色'+roleName,
              roleTypeData: vm.roleTypeData,
              roleData: vm.roleData,
              obj: param
            };
          }
        }
      });
      addRoleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.roleId = data.role.id;
        obj.id = data.id;
        obj.type = data.type.id;
        restAPI.grantRole.addGrantRoles.save({}, JSON.stringify(obj))
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '修改角色成功'
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
      var roleName = '';
      if(param.role && param.role.name) {
        roleName = param.role.name;
      }
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + roleName,
              content: '你将要删除角色' + roleName + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.grantRole.editGrantRole.remove({
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
                message: '删除角色成功'
              });
            }
          });
      }, function () {

      });
    }

    function getRoleTypeData() {
      vm.roleTypeData = [{
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

  }
];

module.exports = angular.module('app.user.roleList', []).controller('roleListCtrl', roleList_fn);