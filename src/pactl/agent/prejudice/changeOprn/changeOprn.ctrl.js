'use strict';

var changeOprn_fn = ['$scope', 'Page', 'restAPI', '$stateParams', 'Notification', '$rootScope', '$modal', 'Auth',
  function($scope, Page, restAPI, stateParams, Notification, $rootScope, $modal, Auth) {
    var vm = $scope;
    vm.auditObj = {};
    vm.auditObj.waybillNo = stateParams.waybillNo;
    vm.auditData = [];
    vm.cancelApply = cancelApply;
    vm.change = change;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.salesData = [];
    vm.search = search;
    vm.statusData = [{
      id: '0',
      name: '申请'
    }, {
      id: '1',
      name: '通过'
    }, {
      id: '2',
      name: '退回'
    }, {
      id: '3',
      name: '取消'
    }];
    vm.code = Auth.getUnitCode();

    getAllSales();

    /**
     * 获取所有的主账户
     */
    function getAllSales() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.salesData = resp;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getAuditData();
    }
    /**
     * 获取运单主账户更换审核
     */
    function getAuditData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.auditOprn.querylist.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.auditData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      if (vm.auditObj.agentSales) {
        obj.oldAgentOprnId = vm.auditObj.agentSales.id + '';
      }
      if (vm.auditObj.status) {
        obj.status = vm.auditObj.status.id;
      }
      obj.waybillNo = vm.auditObj.waybillNo;
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 修改
     * 
     */
    function change(param, status) {
      if (status === '2' && !param.remarks) {
        Notification.error({
          message: '退回需要填写原因'
        });
        return false;
      }
      var changeDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: status === '1' ? '确认更改' : '退回',
              content: '确定进行操作？'
            };
          }
        }
      });
      changeDialog.result.then(function() {
        var obj = {};
        if (status === '1') {
          obj.id = param.id;
          obj.status = status;
        } else if (status === '2') {
          obj.id = param.id;
          obj.status = status;
          obj.remarks = param.remarks;
        }
        $rootScope.loading = true;
        restAPI.auditOprn.change.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '操作成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 取消申请
     */
    function cancelApply(params) {
      var cancelDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '取消申请',
              content: '确定进行操作？'
            };
          }
        }
      });
      cancelDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.auditOprn.change.save({}, {
            id: params.id,
            status: '3'
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '操作成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
  }
];

module.exports = angular.module('app.agentPrejudice.changeOprn', []).controller('changeOprnCtrl', changeOprn_fn);