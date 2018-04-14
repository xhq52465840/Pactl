'use strict';

var sentMessage_fn = ['$scope', 'Page', 'restAPI', '$rootScope', '$modal', '$state', 'Expexcel',
	function($scope, Page, restAPI, $rootScope, $modal, $state, Expexcel) {
		var vm = $scope;
		vm.allselect = allselect;
		vm.allselected = false;
		var canSelect = 0;
		vm.exportTo = exportTo;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.showDetail = showDetail;
		vm.sentInfo = {};
		vm.search = search;
		var selected = [];
		vm.singleCheck = singleCheck;


		search();

		/**
		 * 获取状态
		 */
		vm.statusData = [{
			id: 0,
			name: '未处理'
		}, {
			id: 1,
			name: '已处理'
		}];

		/**
		 * 查询按钮
		 */
		function search() {
			getCertData();
		}
		/**
		 * 获取查询数据
		 */
		function getCertData() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.message.queryList.save({}, obj)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.rows = resp.rows;
					Page.setPage(vm.page, resp);
				});
		}
		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var obj = {
				"status": (vm.sentInfo.status) ? vm.sentInfo.status.id : '',
				"startDate": vm.sentInfo.startDate,
				"endDate": vm.sentInfo.endDate,
				"type": vm.sentInfo.type,
				"origin": vm.sentInfo.origin,
				"destination": vm.sentInfo.destination,
				"subject": vm.sentInfo.subject,
				"msgid": vm.sentInfo.msgid,
				"text": vm.sentInfo.text,
				"rows": vm.page.length,
				"page": vm.page.currentPage
			};
			if (vm.sortObj && vm.sortObj.name) {
				obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
			}
			return obj;
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			vm.allselected = false;
			selected = [];
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 全选事件
		 */
		function allselect($e) {
			var checkbox = $e.target;
			selected = [];
			angular.forEach(vm.rows, function(v, k) {
				if (v.id) {
					v.checked = checkbox.checked;
					if (v.checked) {
						selected.push(v.id);
					}
				}
			});
			vm.allselected = checkbox.checked;
		}
		/**
		 * 单选
		 */
		function singleCheck($e, data) {
			var checkbox = $e.target,
				id = data.id,
				index = selected.indexOf(id);
			data.checked = checkbox.checked;
			data.checked ? selected.push(id) : selected.splice(index, 1);
			vm.allselected = (selected.length === canSelect);
		}
		/**
		 * 导出至excel
		 */
		function exportTo() {
			var obj = getCondition();
			Expexcel.exp(obj, restAPI.message.exportToexcel);
		}
		/**
		 * 点击显示报文详情
		 */
		function showDetail(params) {
			vm.data = params;
		}

	}
];

module.exports = angular.module('app.pactlAssist.sentMessage', []).controller('sentMessageCtrl', sentMessage_fn);