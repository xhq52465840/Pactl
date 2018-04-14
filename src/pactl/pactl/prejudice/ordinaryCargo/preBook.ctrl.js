'use strict';

var preBook_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams', '$state',
	function($scope, restAPI, $modal, Notification, $rootScope, $stateParams, $state) {
		var vm = $scope;
		var airCode = $stateParams.airCode;
		var destCode = $stateParams.destCode;
		vm.bookData = [];

		check();


		/**
		 * check
		 */
		function check() {
			if (!airCode || !destCode) {
				$state.go('index.indexB');
			} else {
				airCode = $stateParams.airCode;
				destCode = $stateParams.destCode;
				search();
			}
		}
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.bookRule.queryList.save({}, {
					airCode: airCode,
					destCode: destCode
				})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						var data1 = [],
							data2 = [];
						angular.forEach(resp.data, function(v, k) {
							var index = data1.indexOf(v.airCode),
								currentIndex = data2.length - 1;
							if (index < 0) {
								data1.push(v.airCode);
								currentIndex = currentIndex + 1;
								data2[currentIndex] = [];
							}
							if(v.destCode === '*') {
								v.destName = '所有';
							} else {
								v.destName = v.destCode;
							}
							data2[currentIndex].push(v);
						});
						vm.bookData = data2;
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
	}
];

module.exports = angular.module('app.pactlPrejudice.preBook', []).controller('preBookCtrl', preBook_fn);