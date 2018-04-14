'use strict';

var relation_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.peopleData = [];
    vm.relationObj = {};
    vm.relationData = [];
    vm.remove = remove;
    vm.search = search;
    vm.unitData = [];
    vm.groupData = [];
    vm.reset = reset;

    initCondition();
    /**
     * 初始化查询条件
     */
    function initCondition() {
      getUnit();
      getPeople();
      getGroup();
    }
    /**
     * 查询
     */
    function search() {
      getRelationData();
    }
    /**
     * 获取用户数据
     */
    function getRelationData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.unitroleactor.pageActors.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.relationData = resp.data;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.start
      };
      vm.relationObj.unit && (obj.unitid = vm.relationObj.unit.id);
      vm.relationObj.people && (obj.userid = vm.relationObj.people.id);
      vm.relationObj.group && (obj.groupid = vm.relationObj.group.id);
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
      var addRelationDialog = $modal.open({
        template: require('./addRelation.html'),
        controller: require('./addRelation.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增用户角色',
              obj: {},
              unitData: vm.unitData,
              peopleData: vm.peopleData,
              userGroupData: vm.groupData
            };
          }
        }
      });
      addRelationDialog.result.then(function (data) {
        var obj = {};
        if (data.authObjType.authObjType == 'USER') {
          obj.objId = data.people.id;
        }
        if (data.authObjType.authObjType == 'GROUP') {
          obj.objId = data.userGroup.id;
        }
        obj.objType = data.authObjType.authObjType;
        restAPI.unitroleactor.addActor.save({
            unitId: data.unit.id,
            roleId: data.role.id
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
                message: '添加机构人员角色成功'
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
      param.authObj = {
        authObjType: param.authObjType,
        name: param.authObjTypeName
      };
      if (param.authObjType == 'USER') {
        angular.forEach(vm.peopleData, function (data) {
          if (data.id == param.authObjId) {
            param.people = data;
          }
        });
      }
      if (param.authObjType == 'GROUP') {
        angular.forEach(vm.groupData, function (data) {
          if (data.id == param.authObjId) {
            param.userGroup = data;
          }
        });
      }
      var editRelationDialog = $modal.open({
        template: require('./editRelation.html'),
        controller: require('./editRelation.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑机构人员角色',
              obj: param,
              unitData: vm.unitData,
              peopleData: vm.peopleData,
              userGroupData: vm.groupData
            };
          }
        }
      });
      editRelationDialog.result.then(function (data) {
        var obj = {};
        if (data.authObj.authObjType == 'USER') {
          obj.objId = data.people.id;
        }
        if (data.authObj.authObjType == 'GROUP') {
          obj.objId = data.userGroup.id;
        }
        obj.objType = data.authObj.authObjType;
        obj.unitId = data.unit.id;
        obj.roleId = data.role.id;
        restAPI.unitroleactor.editActor.put({
            id: data.id
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
                message: '编辑机构人员成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 获取机构
     */
    function getUnit() {
      $rootScope.loading = true;
      restAPI.unit.units.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.unitData = resp;
          search();
        });
    }
    /**
     * 获取操作人员
     */
    function getPeople() {
      restAPI.user.users.query({}, {})
        .$promise.then(function (resp) {
          vm.peopleData = resp;
        });
    }

    /**
     * 获取用户组信息
     */
    function getGroup() {
      restAPI.userGroup.usergroups.query({}, {})
        .$promise.then(function (resp) {
          vm.groupData = resp;
        });
    }
    /**
     * 删除
     * 
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
              title: '删除：' + param.unit.name,
              content: '你将要删除机构' + param.unit.name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.unitroleactor.editActor.remove({
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
                message: '删除机构人员成功'
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 重置
     */
    function reset() {
      vm.relationObj = {};
    }
  }
];

module.exports = angular.module('app.unit.relation', []).controller('relationCtrl', relation_fn);