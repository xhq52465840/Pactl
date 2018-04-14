'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$sce', '$rootScope', '$timeout',
	function($scope, $modalInstance, items, $sce, $rootScope, $timeout) {
		var vm = $scope;
		vm.activeWaybillItem = items.waybillList.length > 0 ? items.waybillList[0] : null;
		vm.cancel = cancel;
		vm.iframeCallBack = iframeCallBack;
		vm.showDetail = showDetail;
		vm.trustSrc = trustSrc;
		vm.url = '';
		vm.waybillList = items.waybillList;
		vm.title = items.title;
		showDetail(vm.activeWaybillItem);

		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}

		function showDetail(data) {
			var url = "/ylx/cn/WaybillTracking.aspx?typeId=E";
			var bill_no_1 = data.substr(0, 3);
			var bill_no_2 = data.substr(3);
			url += '&bill_no_1=' + bill_no_1;
			url += '&bill_no_2=' + bill_no_2;
			if(vm.url === url) {
				return;
			}
			vm.url = url;
			vm.activeWaybillItem = data;
			$rootScope.loading = true;
		}
		/**
		 * 
		 */
		function trustSrc(src) {
			return $sce.trustAsResourceUrl(src);
		}

		function iframeCallBack() {
			$timeout(function() {
				$rootScope.loading = false;
			}, 1000);
		}
	}
];