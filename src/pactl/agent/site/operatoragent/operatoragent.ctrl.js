'use strict';

var operatoragent_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth','$state',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth,$state) {
    var vm = $scope;
    vm.applystatus = [];
    vm.add = add;
    vm.agree = agree;
    vm.agentData = [];
    vm.agentObj = {};
    vm.edit = edit;
    vm.invotationCode = invotationCode;
    vm.manageOper = manageOper;
    vm.refuse = refuse;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.reset = reset;
    vm.search = search;
    vm.unitId = Auth.getMyUnitId();
    vm.operunitid = Auth.getUnitId();
    vm.ismanager = false;
    vm.isSuper = false;

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
      getIsManager();
      getRelationData();
    }
    /**
     * 获取用户数据
     */
    function getRelationData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.operatorAgentManage.querySaleAgents.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp && resp.status===9999) {
            Notification.error({
              message: resp.data
            });
          } else {
            vm.agentData = resp.data;
            angular.forEach(vm.agentData, function (v, k) {
              v.roleText = ''
              if(v.roles && v.roles.length>0) {
                v.roleText = '';
                angular.forEach(v.roles, function (m, n) {
                  if(v.roleText.length>0) {
                    v.roleText += ',';
                  }
                  v.roleText += m.name;
                });
              }
            });
            Page.setPage(vm.page, resp);
          }
        });
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
            $state.go('index');
          }
          if(resp.isSuper == "1") {
            vm.isSuper = true;
          } else {
            vm.isSuper = false;
          }
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      vm.agentObj.unit = Auth.getUnitId();
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        rule: [
          [{
            key: 'operagentid',
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
        obj.rule.push([{
          key: k,
          op: (k === 'applystatus') ? '=' : 'like',
          value: (k === 'applystatus') ? v.status : v
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
      var addSaleAgentDialog = $modal.open({
        template: require('./addSaleAgent.html'),
        controller: require('./addSaleAgent.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加子账户',
              obj: {

              },
              isEdit:false
            };
          }
        }
      });
      addSaleAgentDialog.result.then(function (data) {
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
     * 获取操作代理状态
     */
    function getStatus() {
      vm.applystatus = [{
          name: '已启用',
          status: 1
        }, {
          name: '已冻结',
          status: 2
        }, {
          name: '已禁用',
          status: 3
        }, {
          name: '申请中',
          status: 4
        }, {
          name: '已退回',
          status: 5
        }
        /*, {
                name: '已取消申请',
                status: 6
              }*/
      ];
    }

    function edit(param) {
      var editSaleAgentDialog = $modal.open({
        template: require('./addSaleAgent.html'),
        controller: require('./addSaleAgent.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '修改子账户',
              obj: param,
              isEdit:true,
              isSuper: vm.isSuper
            };
          }
        }
      });
      editSaleAgentDialog.result.then(function (data) {
          search(); 
      }, function (resp) {

      });
    }
    /**
     * 对销售管理进行不同的操作
     * 启用、冻结、禁用、删除等操作
     *
     */
    function manageOper(type, param) {
      var title = '';
      if (type == 1) {
        title = '启用';
      }
      if (type == 4) {
        title = '审核通过';
        type = 1;
      }
      if (type == 2) {
        title = '冻结';
      }
      if (type == 3) {
        title = '禁用';
      }
      if (type == -1) {
        title = '删除';
      }
      var obj = {};
      obj.type = type;
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: title + '：子账户' + param.description,
              content: '你将要' + title + '子账户' + param.description + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.operatorAgentManage.manage.save({
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
                message: title + '子账户成功'
              });
            }
        });
      }, function () {

      });
    }

    /**
     * 同意子账户申请
     */
    function agree(param) {
      var refuseDialog = $modal.open({
        template: require('./agreeApply.html'),
        controller: require('./agreeApply.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '同意子账户申请',
              obj: param
            };
          }
        }
      });
      refuseDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.returndescription = data.returndescription;
        var r = [];
        angular.forEach(data.role, function (v, k) {
          r.push(v.id)
        });
        obj.roles = r.join(",");
        restAPI.operatorAgentManage.agreeApply.save({
            id: param.agentRelationDO.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              $rootScope.loading = false;
              Notification.success({
                message: '同意子账户申请成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 退回子账户申请
     * @param param
     */
    function refuse(param) {
      var refuseDialog = $modal.open({
        template: require('./refuseApply.html'),
        controller: require('./refuseApply.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '退回子账户申请',
              obj: param
            };
          }
        }
      });
      refuseDialog.result.then(function (data) {
          search(); 
      }, function (resp) {

      });
    }

    function invotationCode() {
      var unit = Auth.getUnitId();
      var invitationCodeDialog = $modal.open({
        template: require('./invitationCode.html'),
        controller: require('./invitationCode.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '查看/修改邀请码',
              unit: unit
            };
          }
        }
      });
      invitationCodeDialog.result.then(function (data) {
        var obj = {};
        obj.unit = unit;
        obj.invitationcode = data.code;
        $rootScope.loading = true;
        restAPI.operatorAgentManage.updateInvitationCode.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              $rootScope.loading = false;
              Notification.success({
                message: '邀请码修改成功'
              });
            }
          });
      }, function (resp) {

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

module.exports = angular.module('app.agentSite.operatoragent', []).controller('operatoragentCtrl', operatoragent_fn);