'use strict';
var sublistPrint_fn = ['$scope', 'restAPI', '$rootScope', '$stateParams', 'Notification', '$window', '$timeout', 'printHtml',
	function($scope, restAPI, $rootScope, $stateParams, Notification, $window, $timeout, printHtml) {
		var vm = $scope;
		vm.waybillNo = $stateParams.waybillNo;
		vm.showPage = showPage;
		search();
		vm.rows = [];

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
						$timeout(function() {
							print();
						}, 1000);
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

		function print() {
			printHtml.print({
				top: '0.2',
				bottom: '0.2',
				left: '0.2',
				right: '0.2'
			});
		}
		// var preHeight = 0;
		// function showPage(row, index) {
		// 	if (index === 0) {
		// 		preHeight = 0
		// 	}
		// 	var $el = document.getElementById('printPage' + index);
		// 	var totalHeight = $el.getBoundingClientRect().top + $el.offsetHeight + document.body.scrollTop;
		// 	var height = totalHeight % 794;
		// 	if (preHeight) {
		// 		height = (totalHeight - preHeight) % 794;
		// 	}
		// 	if (794 - height < 300) {
		// 		preHeight = height;
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// }
		var preElHeight = 0;

		function showPage(item,index) {
			if (index === 0) {
				preElHeight = 0;
			}
			var $el = document.getElementById('printPage' + index);
			var height = $el.getBoundingClientRect().top + $el.offsetHeight + (document.body.scrollTop || document.documentElement.scrollTop);
			var eldata = item.airWayBillInfoVos[index];
			var $preEL, preHeight, preIndex, preData;

			if (index > 0) {
				preIndex = index - 1;
				$preEL = document.getElementById('printPage' + preIndex);
				preHeight = $preEL.getBoundingClientRect().top + $el.offsetHeight + (document.body.scrollTop || document.documentElement.scrollTop);
				height = $el.offsetHeight + preHeight;
				preData = item.airWayBillInfoVos[preIndex];
			}
			if (preElHeight) {
				height = height - preElHeight;
			}
			if (height > 700) {
				if (preIndex > -1) {
					item.airWayBillInfoVos[preIndex].showLine = true;
				}
				if (preHeight) {
					preElHeight = preHeight;
				} else {
					preElHeight = height;
				}
			}
		}
	}
];
module.exports = angular.module('app.pactlPrejudice.sublistPrint', []).controller('sublistPrintCtrl', sublistPrint_fn);