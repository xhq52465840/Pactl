'use strict';

var saleagent_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth) {
    var vm = $scope;
    vm.applystatus = [];
    vm.add = add;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.agentObj = {};
    vm.agentData = [];
    vm.search = search;
    vm.reset = reset;
    vm.applyOper = applyOper;
    vm.ismanager = false;
    vm.isSuper = false;

    initCondition();
    search();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getStatus();
      getIsManager();
    }

    function getIsManager() {
      var user = Auth.getUser();
      restAPI.saleAgent.queryUserIsManager.get({
          deptId: user.myunit,
          userid: user.userid
        }, {})
        .$promise.then(function (resp) {
          if (resp.result == "1") {
            vm.ismanager = true;
          } else {
            vm.ismanager = false;
          }
          if(resp.isSuper == "1") {
            vm.isSuper = true;
          } else {
            vm.isSuper = false;
          }
        });
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
      restAPI.saleAgent.queryOperAgents.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentData = resp.data;
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
        rule: [
          [{
            key: 'saleagentid',
            op: '=',
            value: Auth.getMyUnitId()
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
            op: (k === 'applystatus') ? '=' : 'like',
            value: (k === 'applystatus') ? v.status : v
          }]);
        }
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
      var addOperAgentDialog = $modal.open({
        template: require('./applyNewOperAgent.html'),
        controller: require('./applyNewOperAgent.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '申请关联新的主账户',
              obj: {

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
     * 获取主账户状态
     */
    function getStatus() {
      vm.applystatus = [{
          name: '有效',
          status: 1
        }, {
          name: '冻结',
          status: 2
        }, {
          name: '禁用',
          status: 3
        }, {
          name: '申请中',
          status: 4
        }, {
          name: '退回',
          status: 5
        }
        /*, {
                name: '取消申请',
                status: 6
              }*/
      ];
    }

    /**
     * 重新申请/取消申请
     *
     */
    function applyOper(type, param) {
      var title = '';
      var obj = {};
      if (type == 4) {
        title = '重新申请';
        obj.type = '4';
      } else if (type == 6) {
        title = '取消申请';
        obj.type = '6';
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
              title: title + ':关联主账户' + param.description,
              content: '你将要' + title + '关联主账户' + param.description + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.saleAgent.operatorlinkagents.save({
          id: param.agentRelationDO.id
        }, obj).$promise.then(function (resp) {
          if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: title + '关联主账户成功'
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

module.exports = angular.module('app.agentSite.saleagent', []).controller('saleagentCtrl', saleagent_fn);