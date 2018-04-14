'use strict';

module.exports = ['$scope', 'restAPI', '$rootScope', '$modalInstance', 'items', 'Page', 'Notification',
	function($scope, restAPI, $rootScope, $modalInstance, items, Page, Notification) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.quotationObj = {};
		vm.goodsDescData = [];
		vm.search = search;
		vm.save = save;
		vm.changeText7 = changeText7;
		vm.showItem = {
			start: 0,
			end: 0
		};
		vm.insideSearch = insideSearch;
		vm.pageChanged = pageChanged;
		vm.page = Page.initPage();

		/**
		 * 只能输入大写和特殊字符
		 */
		function changeText7(text) {
			try {
				vm.quotationObj[text] = vm.quotationObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
				search();
			} catch (error) {
				return;
			}
		}
		/**
		 * 品名
		 */
		function search() {
			restAPI.nameAdviceManege.nameAdviceList.save({}, {
					goodsName: vm.quotationObj.goodsName
				})
				.$promise.then(function(resp) {
					if (resp.rows.length > 0) {
						vm.goodsDescData = resp.rows;
						showNamdAdvice();
					} else {
						vm.goodsDescData = resp.rows;
						showNamdAdvice();
					}
				});
		}
		function insideSearch() {
			showNamdAdvice();
		}
		function showNamdAdvice() {
			var resp = {
				rows: vm.goodsDescData,
				total: vm.goodsDescData.length
			};
			vm.showItem = {
				start: (vm.page.currentPage - 1) * vm.page.length - 1,
				end: vm.page.currentPage * vm.page.length
			};
			Page.setPage(vm.page, resp);
					
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, showNamdAdvice);
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
	}
];