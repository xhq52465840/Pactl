'use strict';

module.exports = ['$scope', 'restAPI', '$modalInstance', '$rootScope', '$modal', 'items', 'Download', 'Notification',
	function($scope, restAPI, $modalInstance, $rootScope, $modal, items, Download, Notification) {
		var vm = $scope;
		vm.title = items.title;
		var id = items.id;
		var itemFWB = {};
		vm.cancel = cancel;
		vm.historysData = [];
		vm.loading = false;
		vm.imgData = [];

		search();
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.user.historys.save({}, id)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp) {
						var data = resp.data;
						vm.historysData = data;
						angular.forEach(vm.historysData, function (v, k) {
							if(v.remark) {
								v.remark = v.remark.replace(/\/r\/n/g,'<br>');
							}
						});
					} else {
						// Notification.error({
						// 	message: resp.msg
						// });
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