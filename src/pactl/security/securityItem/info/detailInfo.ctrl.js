'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', '$modal', 'Notification',
	function($scope, $modalInstance, items, restAPI, $rootScope, $modal, Notification) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.rows = [];
		vm.item = angular.copy(items);
		/***********/
		vm.loading = false;

		search();

		/**
		 * 查询证书列表
		 */
		function search() {
			vm.loading = true;
			restAPI.reCheck.reCheckdetail.save({}, {
					awId: items.awId
				})
				.$promise.then(function(resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
					}
				});
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];