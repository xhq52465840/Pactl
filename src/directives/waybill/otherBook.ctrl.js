'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Notification', '$modal',
	function ($scope, $modalInstance, items, restAPI, $rootScope, Notification, $modal) {
		var vm = $scope;
		var certData = angular.copy(items.certData); //做过修改的证书数据
		var oldCertData = angular.copy(items.oldCertData); //查询出来的证书数据
		vm.addCert = addCert;
		vm.cancel = cancel;
		vm.canDel = canDel;
		vm.newItems = [];
		vm.originItems = [];
		vm.remove = remove;
		vm.remove2 = remove2;
		vm.removeFile = removeFile;
		vm.removeCert = removeCert;
		vm.rows = [];
		vm.save = save;
		vm.itemObj = angular.copy(items.obj);
		vm.title = items.title;
		vm.uploadCallback = uploadCallback;
		vm.type = {
			id: 'onetime',
			name: '单次使用'
		};
		/***********/
		vm.openDialog = openDialog;

		search();

		/**
		 * 查询证书列表
		 */
		function search() {
			if (certData) {
				angular.forEach(certData, function (v, k) {
					if (v.originType === '1') {
						vm.rows.push(v);
					} else if (v.originType === '2') {
						vm.originItems.push(v);
					}
				});
			} else {
				getCertData();
			}
		}
		/**
		 * 获取证书的原始数据
		 */
		function getCertData() {
			$rootScope.loading = true;
			restAPI.preJudice.bookCheck.save({}, {
					awId: vm.itemObj.awId,
					bookType: vm.itemObj.bookType
				})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
						angular.forEach(vm.rows, function (v, k) {
							if (!v.srcArr) {
								v.srcArr = [];
							}
							angular.forEach(v.files, function (m, n) {
								if (!/[pP][dD][fF]/.test(m.suffix)) {
									v.srcArr.push(m.fileHttpPath);
								} else {
									v.fileHttpPath = m.fileHttpPath;
								}
							});
							v.originType = '1';
							v.type = vm.type;
						});
						oldCertData = angular.copy(vm.rows);
					} else {
						Notification.error({
							message: resp.msg
						});
					}
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
				progress: '',
				type: vm.type
			});
		}
		/**
		 * 删除项目
		 */
		function removeCert(data, index) {
			vm.newItems.splice(index, 1);
		}
		/**
		 * 上传文件
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
							name: v.oldName
						};
						param.fileHttpPath = v.fileHttpPath;
					} else {
						param.srcArr.push(v.fileHttpPath);
					}
					param.ids.push(v.fileId);
				});
			} else {
				Notification.error({
					message: '文件上传失败'
				});
			}
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
						data.progress = '';
						Notification.success({
							message: '文件删除成功'
						});
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
		/**
		 * 删除关联关系
		 * 
		 */
		function remove(params, index) {
			vm.rows.splice(index, 1);
		}
		/**
		 * 删除关联关系
		 * 
		 */
		function remove2(index) {
			vm.originItems.splice(index, 1);
		}
		/**
		 * 保存其他证书
		 */
		function save() {
			if (valid(vm.newItems)) {
				var data1 = angular.copy(vm.rows),
					data2 = angular.copy(vm.newItems),
					data3 = angular.copy(vm.originItems);
				Array.prototype.push.apply(data2, data3);
				Array.prototype.push.apply(data1, data2);
				$modalInstance.close({
					certData: data1,
					oldCertData: oldCertData
				});
			} else {
				Notification.error({
					message: '有数据没填写'
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
				if (!element.ids.length) {
					result = false;
					break;
				} else {
					element.originType = '2';
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
		/**
		 * 显示pdf
		 */
		function openDialog(params) {
			var pdfDialog = $modal.open({
				template: require('../../pactl/showPDF/showPDF.html'),
				controller: require('../../pactl/showPDF/showPDF.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return params;
					}
				}
			});
		}
		/**
		 * 能否删除
		 */
		function canDel() {
			if(vm.itemObj.fstatus === '0'){
				return false;
			}
			return vm.itemObj.canEdit;
		}
	}
];