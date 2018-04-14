'use strict';

var testMessage_fn = ['$scope', 'Page', 'restAPI', '$rootScope', '$modal', '$state', 'Expexcel',
	function($scope, Page, restAPI, $rootScope, $modal, $state, Expexcel) {
		var vm = $scope;
		vm.sentInfo = {};
		vm.search = search;
		/**
		 * 查询按钮
		 */
		function search() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.message.testMessage.save({}, obj)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if(resp.msg) {
						vm.data = resp.msg;
					} else {
						vm.data = resp.data;
					}
				});
		}
		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var obj = {
				origin: vm.sentInfo.origin,
				type: vm.sentInfo.type,
				text: vm.sentInfo.text
			};
			return obj;
		}

	}
];

module.exports = angular.module('app.pactlAssist.testMessage', []).controller('testMessageCtrl', testMessage_fn);