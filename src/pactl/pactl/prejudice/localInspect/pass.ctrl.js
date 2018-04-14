'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'Download', 'items', 'Notification',
	function ($scope, $modalInstance, restAPI, Download, items, Notification) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.title = items.title;
		vm.btnName = items.btnName;
		vm.itemObj = items.obj;
		vm.uploadCallback = uploadCallback;
		vm.downloadFile = downloadFile;
		vm.removeFile = removeFile;
		vm.save = save;

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
		 * 下载文件
		 */
		function downloadFile(id) {
			Download.downloadFile(id, restAPI.file.downloadFile);
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
		 * 保存
		 */
		function save() {
			$modalInstance.close(vm.itemObj);
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];