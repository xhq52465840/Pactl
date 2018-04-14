'use strict';

module.exports = ['$scope', 'items', '$modalInstance', 'Notification', '$filter',
	function ($scope, items, $modalInstance, Notification, $filter) {
		var vm = $scope;
		vm.auditObj = angular.copy(items);
		vm.cancel = cancel;
		vm.save = save;
		setData();

		function setData() {
			vm.auditObj.validilyStart = $filter('date')(vm.auditObj.validilyStart, 'yyyy-MM-dd');
			vm.auditObj.validilyEnd = $filter('date')(vm.auditObj.validilyEnd, 'yyyy-MM-dd');
		}
		/**
		 * 保存
		 */
		function save() {
			if (vm.auditObj.validilyStart && vm.auditObj.validilyEnd) {
				$modalInstance.close(vm.auditObj);
			} else {
				Notification.error({
					message: '请填写日期!'
				});
			}
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];