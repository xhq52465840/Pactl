'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
	function ($scope, $modalInstance, items) {
		var vm = $scope;
		vm.authBookSerialNo = items.authBookSerialNo;
		vm.cancel = cancel;
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];