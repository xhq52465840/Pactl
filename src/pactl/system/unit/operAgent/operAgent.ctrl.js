'use strict';

var operAgent_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.agentStatusData = [];
    vm.add = add;
    vm.disabled = disabled;
    vm.enabled = enabled;
    vm.edit = edit;
    //vm.page = Page.initPage();
    //vm.pageChanged = pageChanged;
    vm.agentObj = {};
    vm.agentData = [];
    vm.remove = remove;
    vm.search = search;
    vm.reset = reset;
    vm.typeData = [];
    vm.showItem = {
			start: 0,
			end: 0
		};
    vm.insideSearch = insideSearch;
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();

    initCondition();
    search();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getStatus();
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
      restAPI.operAgent.listoperagents.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp.data) {
            vm.agentData = resp.data;
            angular.forEach(vm.agentData, function (v, k) {
              //处理角色
              v.roleText = ''
              if(v.unitRoleAddDO && v.unitRoleAddDO.length>0) {
                angular.forEach(v.unitRoleAddDO, function (m, n) {
                  if(v.roleText.length>0) {
                    v.roleText += ',';
                  }
                  v.roleText += m.role.name;
                });
              }
              //处理管理员
              v.unitmanagerText = ''
              if(v.unitmanager && v.unitmanager.length>0) {
                angular.forEach(v.unitmanager, function (m, n) {
                  if(v.unitmanagerText.length>0) {
                    v.unitmanagerText += ',';
                  }
                  v.unitmanagerText += m.user.fullname;
                });
              }
            });

            var resp = {
              rows: vm.agentData,
              total: vm.agentData.length
            };
            vm.showItem = {
              start: (vm.page.currentPage - 1) * vm.page.length - 1,
              end: vm.page.currentPage * vm.page.length
            };
            Page.setPage(vm.page, resp);
          }        
        });


      // $rootScope.loading = true;
      // restAPI.unit.listEname.query({unitId:vm.unitObj.id},{})
      //   .$promise.then(function (resp) {
      //     $rootScope.loading = false;
      //     if(resp.length && resp.length>0) {
      //       vm.unitEnData = resp;
      //       var resp = {
      //         rows: vm.unitEnData,
      //         total: vm.unitEnData.length
      //       };
      //       vm.showItem = {
      //         start: (vm.page.currentPage - 1) * vm.page.length - 1,
      //         end: vm.page.currentPage * vm.page.length
      //       };
      //       Page.setPage(vm.page, resp);
      //     }
      // });
    }

    function showRelationData() {
        var resp = {
          rows: vm.agentData,
          total: vm.agentData.length
        };
        vm.showItem = {
          start: (vm.page.currentPage - 1) * vm.page.length - 1,
          end: vm.page.currentPage * vm.page.length
        };
        Page.setPage(vm.page, resp);
                  
    }
    
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        rule: [
          [{
            key: 'unitType',
            op: '=',
            value: 'agency'
          }]
        ]
      };
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      angular.forEach(vm.agentObj, function (v, k) {
        if (v) {
          obj.rule.push([{
            key: k,
            op: (k === 'isvalid') ? '=' : 'like',
            value: (k === 'isvalid') ? v.code : v
          }]);
        }
      });
      return obj;
    }

    function insideSearch() {
      showRelationData();
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, showRelationData);
    }
    /**
     * 新增
     */
    function add() {
      var addOperAgentDialog = $modal.open({
        template: require('./addOperAgent.html'),
        controller: require('./addOperAgent.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增操作代理',
              obj: {
                iscashcommissionn: "1"
              }
            };
          }
        }
      });
      addOperAgentDialog.result.then(function (data) {
        search();
      }, function (resp) {

      });
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
      obj.aliase = data.aliase;
      obj.unitType = 'agency';
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
        propname: 'reportemail',
        propvalue: data.reportemail
      });
      obj.unitprop.push({
        propname: 'linkphone',
        propvalue: data.linkphone
      });
      obj.unitprop.push({
        propname: 'linkpeople',
        propvalue: data.linkpeople
      });
      obj.unitprop.push({
        propname: 'IATACode',
        propvalue: data.IATACode
      });
      obj.unitprop.push({
        propname: 'iscashcommissionn',
        propvalue: data.iscashcommissionn
      });
      return obj;
    }
    /**
     * 编辑
     */
    function edit(param) {
      var editUnitDialog = $modal.open({
        template: require('./addOperAgent.html'),
        controller: require('./addOperAgent.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑操作代理',
              obj: param
            };
          }
        }
      });
      editUnitDialog.result.then(function (data) {
          search();
      }, function (resp) {

      });
    }
    /**
     * 获取操作代理状态
     */
    function getStatus() {
      vm.agentStatusData = [{
        name: '有效',
        code: true
      }, {
        name: '无效',
        code: false
      }];
    }
    /**
     * 禁用操作代理
     *
     */
    function disabled(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '禁用：' + param.description,
              content: '你将要禁用操作代理' + param.description + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        var obj = {};
        obj.isvalid = "0";
        restAPI.operAgent.disabledUnit.save({
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
                message: '禁用操作代理成功'
              });
            }
          });
      }, function () {

      });
    }

    /**
     * 启用操作代理
     *
     */
    function enabled(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '启用：' + param.description,
              content: '你将要启用操作代理' + param.description + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        var obj = {};
        obj.isvalid = "1";
        restAPI.operAgent.disabledUnit.save({
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
                message: '启用操作代理成功'
              });
            }
          });
      }, function () {

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
              title: '删除：' + param.description,
              content: '你将要删除操作代理' + param.description + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.operAgent.editoperagents.remove({
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
                message: '删除操作代理成功'
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
      vm.agentObj = {};
      search();
    }
  }
];

module.exports = angular.module('app.unit.operAgent', []).controller('operAgentCtrl', operAgent_fn);