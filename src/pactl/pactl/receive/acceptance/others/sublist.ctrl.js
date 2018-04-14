'use strict';

var sublist_fn = ['$scope', 'restAPI', '$rootScope', '$stateParams', 'Notification', '$window',
	function($scope, restAPI, $rootScope, $stateParams, Notification, $window) {
		var vm = $scope;
		vm.waybillNo = $stateParams.waybillNo;
		vm.rows = [];

		search();

		function search() {
			restAPI.bill.ckwbinfo.save({}, {
					awId: vm.waybillNo,
					type: "0"
				})
				.$promise.then(function(resp) {
					vm.rows = [];
					if (resp.ok && resp.data) {
						if(isArray(resp.data)) {
							vm.rows = resp.data;
							// vm.pAirWaybillInfo = resp.data.pAirWaybillInfo;
							// vm.airWayBillInfoVos = resp.data.airWayBillInfoVos;
						} else {
							vm.rows[0] = resp.data;
							// vm.pAirWaybillInfo = resp.data.pAirWaybillInfo;
							// vm.airWayBillInfoVos = resp.data.airWayBillInfoVos;
						}
					} else {
						Notification.error({
							message: '没有符合查询条件的运单'
						});
					}
				});
		}

		function isArray(arr){
			return typeof arr == "object" && arr.constructor == Array;
		}
	}
];

module.exports = angular.module('app.pactlPrejudice.sublist', []).controller('sublistCtrl', sublist_fn);