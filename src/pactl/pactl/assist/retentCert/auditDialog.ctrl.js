'use strict';

module.exports = ['$scope', '$modalInstance', 'Notification', 'items',
	function ($scope, $modalInstance, Notification, items) {
		var vm = $scope;
		vm.year = items.year;
		vm.auditObj = {};
		vm.cancel = cancel;
		vm.openDate = openDate;
		vm.save = save;
		vm.validDate = {
			time: '',
			time1: ''
		};

		setData();

		/**
		 * 显示默认日期
		 */
		function setData() {
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			if (year === +vm.year) {
				vm.auditObj.validilyStart = vm.year + seperator1 + month + seperator1 + strDate;
				vm.auditObj.validilyEnd = vm.year + seperator1 + '12' + seperator1 + '31';
			} else {
				vm.auditObj.validilyStart = vm.year + seperator1 + '01' + seperator1 + '01';
				vm.auditObj.validilyEnd = vm.year + seperator1 + '12' + seperator1 + '31';
			}
			vm.validDate.time = vm.auditObj.validilyStart;
			vm.validDate.time1 = vm.auditObj.validilyEnd;
		}
		/**
		 * 保存
		 */
		function save() {
			if (vm.auditObj.validilyStart && vm.auditObj.validilyEnd) {
				if (vm.auditObj.validilyEnd < vm.auditObj.validilyStart) {
					Notification.error({
						message: '结束日期大于开始日期!'
					});
				} else {
					$modalInstance.close(vm.auditObj);
				}
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
		/**
		 * 日期弹出框
		 */
		function openDate(pika, type) {
			if (type === 'time') {
				pika.gotoDate(new Date(vm.validDate.time));
			} else if (type === 'time1') {
				pika.gotoDate(new Date(vm.validDate.time1));
			}
		}
	}
];