'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope', 
	function($scope, $modalInstance, restAPI, items, $rootScope) {
		var vm = $scope;
		vm.save = save;
		vm.cancel = cancel;
		vm.remark = items.obj;
		/**
		 * 保存
		 */
		function save() {
			$modalInstance.close(vm.remark);
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}

	}
];