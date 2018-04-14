'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'IsIe', '$modal', 'Notification', '$rootScope',
	function ($scope, $modalInstance, items, restAPI, IsIe, $modal, Notification, $rootScope) {
		var vm = $scope;
		vm.addCert = addCert;
		vm.cancel = cancel;
		vm.loading = false;
		vm.newItems = [];
		vm.uploadCallback = uploadCallback;
		vm.remove = remove;
		vm.removeFile = removeFile;
		vm.removeCert = removeCert;
		vm.rows = [];
		vm.save = save;
		vm.item = angular.copy(items.obj);
		vm.title = items.title;
		vm.openDialog = openDialog;
		/***********/

		search();

		/**
		 * 查询证书列表
		 */
		function search() {
			restAPI.preJudice.bookCheck.save({}, {
					awId: vm.item.awId,
					bookType: vm.item.bookType
				})
				.$promise.then(function (resp) {
					if (resp.ok) {
						vm.rows = resp.data;
						angular.forEach(vm.rows, function (v, k) {
							v.srcArr = [];
							angular.forEach(v.files, function (m, n) {
								if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
									v.pdfPath = m.fileHttpPath;
								} else {
									v.srcArr.push(m.fileHttpPath);
								}
							});
						});
					};
				});
		}
		/**
		 * 添加新项目
		 */
		function addCert() {
			vm.newItems.push({
				bookComment: '',
				files: [],
				ids: [],
				progress: ''
			});
		}
		/**
		 * 删除项目
		 */
		function removeCert(data, index) {
			vm.newItems.splice(index, 1);
		}
		/**
		 * 上传回调
		 * 
		 * @param {any} param 
		 */
		function uploadCallback(res, param) {
			param.srcArr = [];
			var file = res;
			if (file && file.ok) {
				angular.forEach(file.data, function (v, k) {
					if (v.suffix && /[pP][dD][fF]/.test(v.suffix)) {
						param.fileObj = {
							id: v.fileId,
							name: v.oldName,
							newName: v.oldName.substring(0, 10) + (v.oldName.length > 10 ? '...' : '')
						};
						param.pdfPath = v.fileHttpPath;
					} else {
						param.srcArr.push(v.fileHttpPath);
					}
					if (!param.fileObj.ids) {
						param.fileObj.ids = [];
					}
					param.fileObj.ids.push(v.fileId);
				});
			} else {
				Notification.error({
					message: '文件上传失败'
				});
			}
		}
		/**
		 * 显示pdf
		 */
		function openDialog(params) {
			var pdfDialog = $modal.open({
				template: require('../../../showPDF/showPDF.html'),
				controller: require('../../../showPDF/showPDF.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							src: params.pdfPath,
							srcArr: params.srcArr
						};
					}
				}
			});
		}
		/**
		 * 删除文件
		 */
		function removeFile(data) {
			restAPI.file.removeFile.save({}, {
					fileId: data.fileObj.id
				})
				.$promise.then(function (resp) {
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
		 * 删除关联关系
		 * 
		 */
		function remove(params, index) {
			vm.loading = true;
			restAPI.preJudice.removeBooks.save({}, {
					id: params.book.id
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.rows.splice(index, 1);
						Notification.success({
							message: '证书关联关系删除成功'
						});
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
		/**
		 * 保存
		 */
		function save() {
			if (vm.newItems.length) {
				if (valid(vm.newItems)) {
					$modalInstance.close(vm.newItems);
				} else {
					Notification.error({
						message: '有数据没填写'
					});
				}
			} else {
				Notification.error({
					message: '未添加数据'
				});
			}
		}
		/**
		 * 校验数据
		 */
		function valid(params) {
			var result = true;
			for (var index = 0; index < params.length; index++) {
				var element = params[index];
				if (!(element.fileObj && element.fileObj.ids.length)) {
					result = false;
					break;
				}
			}
			return result;
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];