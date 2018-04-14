'use strict';

module.exports = ['$scope', '$rootScope', 'items', '$modalInstance',
	function($scope, $rootScope, items, $modalInstance) {
		var vm = $scope;
		vm.nameObj = items.obj;
		vm.cancel = cancel;
		vm.title = items.title;

		/**
		 * 关闭
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];