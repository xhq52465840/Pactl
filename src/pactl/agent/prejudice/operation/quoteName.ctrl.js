'use strict';

module.exports = ['$scope', 'restAPI', '$rootScope', '$modalInstance', 'items', 'Page','Notification',
	function ($scope, restAPI, $rootScope, $modalInstance, items, Page, Notification) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.quotationObj = angular.copy(items.obj);
		vm.quotationObj.myself = true;
		vm.quotationData = [];
		vm.search = search;
		vm.save = save;
		vm.upperName = upperName;

		//search();
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			var obj = getCondition();
			var error = check(obj);
			if(error) {
				Notification.error({
					message: error
				});
				return;
			}
			restAPI.preJudice.agenQname.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.quotationData = resp.rows;
					angular.forEach(vm.quotationData || [], function (v, k) {
						var data = [];
						try {
							data = JSON.parse(v.booksType);
						} catch (error) {
							data = [];
						}
						v.booksType = data;
					});
					Page.setPage(vm.page, resp);
				});
		}

		function check(obj) {
			if(!obj.namesEn && !obj.wayBillNo && !obj.subWayBillNo) {
				return "品名,主单号,分单号 请至少输入一个";
			} else {
				return false;
			}
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
			obj.namesEn = vm.quotationObj.namesEn;
			obj.wayBillNo = vm.quotationObj.wayBillNo;
			obj.subWayBillNo = vm.quotationObj.subWayBillNo;
			obj.myself = vm.quotationObj.myself ? '1' : '0';
			return obj;
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 引用
		 */
		function save(param) {
			$modalInstance.close(param);
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
		/**
		 * 品名只能输入大写
		 */
		function upperName() {
			vm.quotationObj.namesEn = vm.quotationObj.namesEn.toUpperCase();
		}
	}
];