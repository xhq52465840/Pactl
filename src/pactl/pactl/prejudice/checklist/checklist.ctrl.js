'use strict';

var checklist_fn = ['$scope', 'restAPI', 'Page', '$rootScope', '$modal', '$stateParams', 'Notification', '$state',
	function ($scope, restAPI, Page, $rootScope, $modal, $stateParams, Notification, $state) {
		var vm = $scope;
		vm.check = {};
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.search = search;

		getAgentData();
		search();
		/**
		 * 获取操作代理
		 */
		function getAgentData() {
			$rootScope.loading = true;
			restAPI.agent.listOper.query({}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.agentSalesData = resp;
				});
		}
		/**
		 * 获取状态
		 */
		vm.statusData = [{
			id: '',
			name: '全部'
		}, {
			id: '0',
			name: '待查'
		}, {
			id: '2',
			name: '完成'
		}];
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.preJudice.queryList.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						vm.rows = resp.rows;
						Page.setPage(vm.page, resp);
					} else {
						showNoResult();
					}
				});
		}
		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var obj = {
				rows: vm.page.length,
				page: vm.page.currentPage,
				status: (!vm.check.status || vm.check.status.id === '102') ? '' : vm.check.status.id,
				agentOprn: vm.check.agentSales && vm.check.agentSales.code,
				waybillNo: vm.check.waybillNo
			}
			return obj;
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 当没有数据时
		 */
		function showNoResult() {
			Notification.error({
				message: '未找到任何数据'
			});
			$state.go('index');
		}

	}
];

module.exports = angular.module('app.pactlPrejudice.checklist', []).controller('checklistCtrl', checklist_fn);