'use strict';

var shipmentWaybil_fn = ['$scope', 'Page', 'restAPI', '$rootScope', '$modal', '$state',
	function($scope, Page, restAPI, $rootScope, $modal, $state) {
		var vm = $scope;
		vm.onlyEn = onlyEn;
		vm.onlyNum3 = onlyNum3;
		vm.onlyNum8 = onlyNum8;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.refer = {};
		vm.search = search;

		// search();
		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var obj = {
				"page": vm.page.currentPage,
				"rows": vm.page.length,
				"goodsDesc": vm.refer.goodsDesc ? vm.refer.goodsDesc : ''
			};
			return obj;
		}
		/**
		 * 查询按钮
		 */
		function search() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.nameAdvice.shippingview.save({}, obj)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.rowCollection = resp.rows;
					Page.setPage(vm.page, resp);
				});
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 不能输入中文
		 */
		function onlyEn() {
			try {
				vm.refer.goodsDesc = vm.refer.goodsDesc.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
			} catch (error) {
				return;
			}
		}
		/**
		 * 只能输入数字-
		 */
		function onlyNum3() {
			try {
				vm.refer.waybillNo1 = vm.refer.waybillNo1.replace(/[^0-9-]/g, '').toUpperCase();
			} catch (error) {
				return;
			}
		}

		function onlyNum8() {
			try {
				vm.refer.waybillNo2 = vm.refer.waybillNo2.replace(/[^0-9-]/g, '').toUpperCase();
			} catch (error) {
				return;
			}
		}

	}
];

module.exports = angular.module('app.agentAssist.shipmentWaybil', []).controller('shipmentWaybilCtrl', shipmentWaybil_fn);