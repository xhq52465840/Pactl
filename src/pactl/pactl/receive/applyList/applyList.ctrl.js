'use strict';

var applyList_fn = ['$scope', 'Page', 'restAPI', '$rootScope', '$modal', 'Auth',
  function ($scope, Page, restAPI, $rootScope, $modal, Auth) {
    var vm = $scope;
    vm.applyObj = {
      status: {
        id: '0',
        name: '未审核'
      }
    };
    vm.aDatas = [];
    vm.applyData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.salesData = [];
    vm.search = search;
    vm.statusData = [{
      id: '1',
      name: '审核完成'
    }, {
      id: '0',
      name: '未审核'
    }];
    vm.wStatusDatas = [];
    vm.informalRule = '';

    getInformalRule();

    function getInformalRule(user, token, data) {
			$rootScope.loading = true;
			restAPI.systemSet.querySingleSet.save({}, 'informalRule')
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length > 0) {
						vm.informalRule = resp.data.regVal;
					}
					getAllSales();
				});
		}

    /**
     * 获取所有的销售代理
     */
    function getAllSales() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.salesData = resp;
          wStatus();
        });
    }
    /**
     * 获取所有的运单状态
     */
    function wStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314336069737'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.wStatusDatas = resp.rows;
          aStatus();
        });
    }
    /**
     * 获取所有的安检状态
     */
    function aStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314998540410'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.aDatas = resp.rows;
          search();
        });
    }    
    /**
     * 查询
     */
    function search() {
      getApplyData();
    }
    /**
     * 获取审核数据
     */
    function getApplyData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.dataEdit.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.applyData = resp.rows;
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
      obj.oprnType = 'pactl';
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      obj.waybillNo = vm.applyObj.billNo;
      vm.applyObj.agent && (obj.agentOprnId = vm.applyObj.agent.id + '');
      vm.applyObj.status && (obj.reviewCommitFlag = vm.applyObj.status.id);
      vm.applyObj.startDate && (obj.startDate = vm.applyObj.startDate);
      vm.applyObj.endDate && (obj.endDate = vm.applyObj.endDate);
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

module.exports = angular.module('app.pactlReceive.applyList', []).controller('applyListCtrl', applyList_fn);