'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'Download', 'items', 'Notification',
	function ($scope, $modalInstance, restAPI, Download, items, Notification) {
		var vm = $scope;
		var selected = [];
		var checkedData = [];
		vm.cancel = cancel;
		vm.check = check;
		vm.downloadFile = downloadFile;
		vm.title = items.title;
		vm.btnName = items.btnName;
		vm.itemObj = items.obj;
		vm.uploadCallback = uploadCallback;
		vm.removeFile = removeFile;
		vm.reasonData = items.PassReasonData;
		vm.save = save;

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
		 * 上传文件
		 */
		function uploadCallback(res, param) {
			param.fileObj = res;
			var file = res;
			var respDt = file.data;
			if (file && file.ok) {
				vm.itemObj.fileObj = {
					id: respDt.fileId,
					name: respDt.oldName,
					newName: respDt.oldName.substring(0, 10) + (respDt.oldName.length > 10 ? '...' : '')
				}
			} else {
				Notification.error({
					message: '上传失败'
				});
			}
		}
		/**
		 * 删除文件
		 */
		function removeFile(id) {
			restAPI.file.removeFile.save({}, {
					fileId: id
				})
				.$promise.then(function (resp) {
					if (resp.ok) {
						vm.itemObj.fileObj = null;
						vm.itemObj.progress = '';
						Notification.success({
							message: '文件删除成功'
						});
					} else {
						Notification.error({
							message: '文件删除失败'
						});
					}
				});
		}
		/**
		 * 下载文件
		 */
		function downloadFile(id) {
			Download.downloadFile(id, restAPI.file.downloadFile);
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