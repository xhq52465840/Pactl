'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
	function($scope, $modalInstance, restAPI, items) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.historys = items.historys;
		vm.title = items.title;

		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];