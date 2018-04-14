'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI',  'Download', 'items', 'Notification',
	function ($scope, $modalInstance, restAPI, Download, items, Notification) {
		var vm = $scope;
		var selected = [];
		var checkedData = [];
		vm.cancel = cancel;
		vm.check = check;
		vm.title = items.title;
		vm.btnName = items.btnName;
		vm.itemObj = items.obj;
		vm.reasonData = angular.copy(items.reasonData);
		vm.save = save;
		vm.isCheck = isCheck;
		setData();

		function setData() {
			if (!vm.itemObj.subBillLists.subBillAuditRemarks || vm.itemObj.subBillLists.subBillAuditRemarks === '') {
				return;
			}
			var subBillAuditRemarks = vm.itemObj.subBillLists.subBillAuditRemarks.split(";");
			for (var i = 0; i < subBillAuditRemarks.length; i++) {
				var isMatch = false;
				for (var index = 0; index < vm.reasonData.length; index++) {
					var element = vm.reasonData[index];
					if (element.name === subBillAuditRemarks[i]) {
						selected.push(element.id);
						checkedData.push(element);
						isMatch = true;
						break;
					}
				}
				if (!isMatch) {
					vm.itemObj.actionComments = subBillAuditRemarks[i];
				}
			}
		}

		function isCheck(param) {
			var id = param.id;
			var index = selected.indexOf(id);
			if (index >= 0) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * 单选
		 */
		function check($e, param) {
			var checkbox = $e.target,
				id = param.id,
				index = selected.indexOf(id);
			param.checked = checkbox.checked;
			if (param.checked) {
				selected.push(id);
				checkedData.push(param);
			} else {
				selected.splice(index, 1);
				checkedData.splice(index, 1);
			}
		}
		/**
		 * 校验
		 */
		function valid() {
			var result = true;
			if (checkedData.length > 0 || vm.itemObj.actionComments) {
				result = true;
			} else {
				result = false;
			}
			return result;
		}
		/**
		 * 保存
		 */
		function save() {
			if (valid()) {
				vm.itemObj.remarkData = checkedData;
				if (vm.itemObj.actionComments) {
					vm.itemObj.remarkData.push({
						id: 'all',
						name: vm.itemObj.actionComments
					});
				}
				$modalInstance.close(vm.itemObj);
			} else {
				Notification.error({
					message: '有必填数据未填写'
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