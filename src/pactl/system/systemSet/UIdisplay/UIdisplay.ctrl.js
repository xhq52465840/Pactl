'use strict';

var UIdisplay_fn = ['$scope', 'restAPI', '$rootScope', 'Notification',
	function($scope, restAPI, $rootScope, Notification) {
		var vm = $scope;
		vm.UIdisplay = {};
		vm.save = save;
		search();

		/**
		 * 查询按钮
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.UIdisplay.queryAll.save({}, {})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.UIdisplay.title = resp.data.title;
					vm.UIdisplay.content = resp.data.content;
				});
		}
		/**
		 * 保存按钮
		 */
		function save() {
			$rootScope.loading = true;
			restAPI.UIdisplay.updateDisplay.save({}, {
					'title': vm.UIdisplay.title,
					'content': vm.UIdisplay.content
				})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					Notification.success({
						message: '保存成功'
					});
				});
		}


	}
];

module.exports = angular.module('app.systemSet.UIdisplay', []).controller('UIdisplayCtrl', UIdisplay_fn);