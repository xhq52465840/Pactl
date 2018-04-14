'use strict';

var inspectList_fn = ['$scope', '$rootScope', 'restAPI', 'Page',
  function($scope, $rootScope, restAPI, Page) {
    var vm = $scope;
    vm.agentSalesData = [];
    vm.changeNum = changeNum;
    vm.billData = [];
    vm.billObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.reset = reset;
    vm.informalRule = '';
    vm.statusData = [{
      id: '0',
      name: '待查'
    }, {
      id: '2',
      name: '完成'
    }, {
      id: '3',
      name: '退回'
    },{
      id: '*',
      name: '所有'
    }];

    getInformalRule();

    function getInformalRule(user, token, data) {
      $rootScope.loading = true;
      restAPI.systemSet.querySingleSet.save({}, 'informalRule')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length > 0) {
            vm.informalRule = resp.data.regVal;
          }
        });
    }

    getAgentData();
    search();

    /**
     * 获取操作代理
     */
    function getAgentData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.agentSalesData = resp;
        });
    }
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.preJudice.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.billData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }

    /**
     * 重置
     */
    function reset() {
      vm.billObj.status = null;
      vm.billObj.agentOprn = null;
      vm.billObj.waybillNo = null;
      search();
    }

    /**
     * 只能输入数字
     * 
     * @param {any} text
     */
    function changeNum(text) {
      try {
        var abc = vm.billObj[text].replace(/[^0-9]/g, '');
        vm.billObj[text] = abc.substring(0, 11);
      } catch (error) {}
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.billObj.status) {
        obj.status = vm.billObj.status.id;
      }
      if (vm.billObj.agentOprn) {
        obj.agentOprn = vm.billObj.agentOprn.code;
      }
      obj.waybillNo = vm.billObj.waybillNo;
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
  }
];

module.exports = angular.module('app.pactlPrejudice.inspectList', []).controller('inspectListCtrl', inspectList_fn);