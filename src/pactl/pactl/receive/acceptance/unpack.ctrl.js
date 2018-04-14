		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI', 'Download', 'Notification',
			function($scope, $modalInstance, items, $rootScope, restAPI, Download, Notification) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.pass = pass;
				vm.uploadCallback = uploadCallback;
				vm.removeFile = removeFile;
				vm.itemObj = {};//items.obj;
				vm.title = items.title;
				vm.downloadFile = downloadFile;
				/**
				 * 开箱检查通过、不通过
				 */
				function pass(type) {
						vm.itemObj.type = type;
						$modalInstance.close(vm.itemObj);
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
				 * 下载文件
				 */
				function downloadFile(id) {
					Download.downloadFile(id, restAPI.file.downloadFile);
				}
					/**
					 * 删除文件
					 */
				function removeFile(data) {
						restAPI.file.removeFile.save({}, {
								fileId: data.fileObj.id
							})
							.$promise.then(function(resp) {
								if (resp.ok) {
									data.fileObj = null;
									data.pdfPath = null;
									data.progress = '';
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
					 * 取消
					 */
				function cancel() {
					$modalInstance.dismiss('cancel');
				}

			}
		];