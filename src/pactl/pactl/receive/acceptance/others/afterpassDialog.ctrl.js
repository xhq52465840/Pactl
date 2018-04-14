'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
	function($scope, $modalInstance, items) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.details = items.details;
		vm.showDetail = showDetail;

		/**
		 * 显示报文数据
		 */
		function showDetail(param){
			param.checked = !param.checked;
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];