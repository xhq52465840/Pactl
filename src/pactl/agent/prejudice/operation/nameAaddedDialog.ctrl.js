'use strict';

module.exports = ['$scope', '$rootScope', 'items', '$modalInstance',
	function ($scope, $rootScope, items, $modalInstance) {
		var vm = $scope;
		vm.nameObj = angular.copy(items.obj);
		vm.nameObj.goodsRemarks = vm.nameObj.goodsRemarks || '工作原理：\n构成：\n用途：\n证书品名为什么与申报品名不一致：';
		vm.cancel = cancel;
		vm.changeText = changeText;
		vm.save = save;
		vm.wbEle = vm.nameObj.wbEle === '1';

		/**
		 * 保存
		 */
		function save() {
			if (vm.nameObj.goodsRemarks === '工作原理：\n构成：\n用途：\n证书品名为什么与申报品名不一致：') {
				vm.nameObj.goodsRemarks = '';
			}
			$modalInstance.close(vm.nameObj);
		}
		/**
		 * 关闭
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
		/**
		 * 只能输入大写和特殊字符
		 */
		function changeText(text) {
			try {
				vm.nameObj[text] = vm.nameObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
			} catch (error) {
				return;
			}
		}
	}
];