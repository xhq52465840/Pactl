'use strict';

var printReturn_fn = ['$scope', '$filter', 'restAPI', '$rootScope', '$stateParams', 'Notification', '$window', '$timeout',
	function ($scope, $filter, restAPI, $rootScope, $stateParams, Notification, $window, $timeout) {
		var vm = $scope;
		var awId = $stateParams.awId;
		var mainSelected = $stateParams.mainSelected;
		var selected = [];
		vm.printBill = printBill;
		vm.textInput = '';
		if ($stateParams.secIds) {
			selected = $stateParams.secIds.split(',');
		}
		var today = new Date();
		var currentDate = $filter('date')(today, 'yyyy-MM-dd');
		vm.print = {
			'totalRcpNo': 0,
			'totalWeight': 0,
			'printDate': currentDate
		};
		vm.printChildBills = [];
		search();

		function search() {
			$rootScope.loading = true;
			restAPI.waybill.billdetailbyid.save({}, {
				awId: awId,
				showAll: '1'
			}).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					vm.parentBill = resp.data.parentBill;
					vm.rows = resp.data.rows;
					if (mainSelected) {
						vm.print.totalRcpNo += +vm.parentBill.printCount;
						vm.print.totalWeight += +vm.parentBill.grossWeight;
					} else {
						var item = [],
							counter = 0;
						angular.forEach(vm.rows, function (v, k) {
							if (selected.indexOf(v.childBill.awId) >= 0) {
								item.push(v);
								if (counter % 2 !== 0) {
									vm.printChildBills.push(item);
									item = [];
								}
								counter++;
								vm.print.totalRcpNo += +v.childBill.printCount;
								vm.print.totalWeight += +v.childBill.grossWeight;
							}
							if (k === vm.rows.length - 1 && item.length > 0) {
								vm.printChildBills.push(item);
							}

						});
					}
					vm.print.agent = vm.parentBill.agentOprn;
				} else {
					Notification.error({
						message: resp.msg
					});
				}
			});
		}

		function printBill() {
			$window.print();
		}
	}
];
module.exports = angular.module('app.pactlReceive.printReturn', []).controller('printReturnCtrl', printReturn_fn);