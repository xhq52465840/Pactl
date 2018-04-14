'use strict';

module.exports = ['$scope', '$modalInstance', '$state', 'items', 'restAPI', 'Notification', '$modal', '$rootScope',
	function ($scope, $modalInstance, $state, items, restAPI, Notification, $modal, $rootScope) {
		var vm = $scope;
		vm.addCert = addCert;
		vm.bookCallback = bookCallback;
		vm.cancel = cancel;
		vm.itemObj = angular.copy(items.obj);
		vm.newItems = [];
		vm.officeCodeData = [];
		vm.onSelectCallback = onSelectCallback;
		vm.openDialog = openDialog;
		vm.uploadCallback = uploadCallback;
		vm.remove = remove;
		vm.removeFile = removeFile;
		vm.removeCert = removeCert;
		vm.rows = [];
		vm.save = save;
		vm.showBatteryDeclaraction = showBatteryDeclaraction;
		vm.needSaveData = items.needSaveData;
		vm.statusData = [{
			id: '0',
			name: '未选'
		}, {
			id: '1',
			name: '通过'
		}, {
			id: '2',
			name: '退回'
		}];
		vm.title = items.title;
		vm.typeData = [{
			id: 'onetime',
			name: '单次使用'
		}, {
			id: 'sharing',
			name: '共享证书'
		}];
		/***********/
		getOffice();

		/**
		 * 获取鉴定机构
		 */
		function getOffice() {
			$rootScope.loading = true;
			restAPI.officeInfo.queryAll.save({}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.officeCodeData = resp.rows;
					search();
				});
		}
		/**
		 * 查询证书列表
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.preJudice.bookCheck.save({}, {
					awId: items.obj.awId,
					bookType: items.obj.bookType
				})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
						angular.forEach(vm.rows, function (v, k) {
							v.srcArr = [];
							var showName = 'page0';
					        var screenshotPage = v.officeInfo.screenshotPage
					        if(screenshotPage<(v.files.length)){
				            	showName = "page"+(screenshotPage-1)
				            };
							angular.forEach(v.files, function (m, n) {
								if (!/[pP][dD][fF]/.test(m.suffix)) {
									if (m.oldName === showName) {
										v.filePath = m.fileHttpPath;
										v.imgShow = false;
										v.style1 = {
											width: (v.officeInfo && v.officeInfo.wides || 0) + 'px',
											height: (v.officeInfo && v.officeInfo.lengths || 0) + 'px',
											position: 'absolute',
											zoom: 1,
											'z-index': 1001,
											top: '55px',
											left: '-340px',
											overflow: 'hidden'
										};
										v.style2 = {
											position: 'absolute',
											'z-index': 1000,
											width: '879px',
											height: '1242px',
											top: (v.officeInfo && v.officeInfo.yAxle || 0) + 'px',
											left: (v.officeInfo && v.officeInfo.xAxle || 0) + 'px'
										};
									}
									v.srcArr.push(m.fileHttpPath);
								} else {
									v.pdfPath = m.fileHttpPath;
								}
							});
						});
					};
				});
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
						return params;
					}
				}
			});
		}
		/**
		 * 添加新项目
		 */
		function addCert() {
			vm.newItems.push({
				type: vm.typeData[0],
				officeCode: '',
				bookNo: '',
				files: [],
				ids: [],
				uploadable: true,
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
		 * 删除文件
		 */
		function removeFile(param, bookCallBackAfterRemoveFile, data) {
			restAPI.file.removeFile.save({}, {
					fileId: param.fileObj.id
				})
				.$promise.then(function (resp) {
					if (resp.ok) {
						param.fileObj = null;
						param.pdfPath = null;
						param.progress = '';
						Notification.success({
							message: '文件删除成功'
						});
						if (bookCallBackAfterRemoveFile) {
							bookCallBackAfterRemoveFile(param, data);
						}
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
			$rootScope.loading = true;
			restAPI.preJudice.removeBooks.save({}, {
					id: params.book.id
				})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
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
		 * 选择机构时校验证书类型
		 */
		function onSelectCallback(params, item) {
			if (items.obj.bookType === 'book') {
				if (item) {
					getBookType(item);
				}
			}
		}
		/**
		 * 填写证书编号时
		 */
		function bookCallback(item) {
			if (items.obj.bookType === 'book') {
				if (item.bookNo && item.officeCode) {
					getBookType(item);
				}
			}
		}

		function bookCallBackAfterRemoveFile(param, data) {
			param.type = {
				id: 'sharing',
				name: '共享证书'
			};
			param.uploadable = true;
			angular.forEach(data, function (v, k) {
				if (k === 0) {
					param.bookId = v.pAgentShareBook.bookId;
					param.srcArr = [];
					param.ids = [];
					angular.forEach(v.pFileRelations, function (m, n) {
						if (!/[pP][dD][fF]/.test(m.suffix)) {
							param.srcArr.push(m.fileHttpPath);
						} else {
							param.fileObj = {
								id: m.fileId,
								name: m.oldName
							};
							param.pdfPath = m.fileHttpPath;
						}
						param.ids.push(m.fileId);
					});
				}
			});
		}
		/**
		 * 获取证书类型---根据鉴定机构和证书编号
		 *  
		 */
		function getBookType(param) {
			if (!param.officeCode) {
				param.uploadable = true;
				if (param.type.id !== 'onetime') {
					param.type = {
						id: 'onetime',
						name: '单次使用'
					};
					param.fileObj = null;
					param.files = null;
					param.pdfPath = null;
					param.goodsType = null;
				}
				return;
			}
			restAPI.preJudice.queryBookType.save({}, {
					ocId: param.officeCode.ocId,
					bookNo: param.bookNo,
					agentOprnId: items.obj.agentOprnId,
					airCode: items.obj.carrier1
				})
				.$promise.then(function (resp) {
					if (resp.ok) {
						if (resp.data[0]) {
							if(resp.data[0].pAgentShareBook) {
								param.goodsType = resp.data[0].pAgentShareBook.goodsType
							}
							if (resp.data[0].returnStatus === '100') {
								Notification.error({
									message: '证书已停用，请重新选择证书！'
								});
								reSetFile(param);
							} else if (resp.data[0].returnStatus === '102') {
								Notification.error({
									message: '证书已过期，请重新选择证书！'
								});
								reSetFile(param);
							} else if (resp.data[0].returnStatus === '105') {
								Notification.error({
									message: resp.data[0].returnReason
								});
								reSetFile(param);
							} else if (resp.data[0].returnStatus === '101') {
								param.uploadable = true;
								if (param.type.id !== 'onetime') {
									param.type = {
										id: 'onetime',
										name: '单次使用'
									};
									param.fileObj = null;
									param.files = null;
									param.pdfPath = null;
									param.goodsType = null;
								}
							} else if (!resp.data[0].returnStatus) {
								if (param.type.id === 'onetime') {
									if (param.fileObj && param.fileObj.id) {
										removeFile(param, bookCallBackAfterRemoveFile, resp.data);
									} else {
										bookCallBackAfterRemoveFile(param, resp.data);
									}
								} else {
									bookCallBackAfterRemoveFile(param, resp.data);
								}
							}
						} else {
							param.uploadable = true;
							if (param.type.id !== 'onetime') {
								param.type = {
									id: 'onetime',
									name: '单次使用'
								};
								param.fileObj = null;
								param.files = null;
								param.pdfPath = null;
								param.goodsType = null;
							}
						}
					} else if (!resp.ok) {
						param.uploadable = true;
						if (param.type.id !== 'onetime') {
							param.type = {
								id: 'onetime',
								name: '单次使用'
							};
							param.fileObj = null;
							param.files = null;
							param.pdfPath = null;
							param.goodsType = null;
						}
					} else if (resp.status === 9999) {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}

		function reSetFile(param) {
			param.uploadable = false;
			if (param.type.id !== 'onetime') {
				param.fileObj = null;
				param.files = null;
				param.pdfPath = null;
				param.goodsType = null;
			} else {
				if (param.fileObj && param.fileObj.id) {
					removeFile(param);
				}
			}
		}
		/**
		 * 保存
		 */
		function save() {
			for (var i = 0; i < vm.newItems.length; i++) {
				if (!vm.newItems[i].bookNo || !vm.newItems[i].fileObj || !vm.newItems[i].officeCode) {
					var error = '';
					if (!vm.newItems[i].bookNo) {
						error = '请填写证书编号';
					} else if (!vm.newItems[i].fileObj) {
						error = '请为证书' + vm.newItems[i].bookNo + '上传证书电子档';
					} else if (!vm.newItems[i].officeCode) {
						error = '请填写证书' + vm.newItems[i].bookNo + '的鉴定机构';
					}
					Notification.error({
						message: error
					});
					return false;
				}
			}
			if (vm.needSaveData) {
				var arrObj = [];
				angular.forEach(vm.newItems || {}, function (v, k) {
					if (v.type.id === 'sharing') {
						arrObj.push({
							book: {
								awId: vm.itemObj.awId,
								bookType: v.type.id,
								bookCheckType: vm.itemObj.bookType,
								bookNo: v.bookNo,
								ocId: v.officeCode.ocId,
								officeCode: v.officeCode.officeCode,
								officeName: v.officeCode.shortName,
								bookId: v.bookId,
								goodsType: v.goodsType
							},
							fileIdList: v.fileObj.ids
						});
					} else if (v.type.id === 'onetime') {
						arrObj.push({
							book: {
								awId: vm.itemObj.awId,
								bookType: v.type.id,
								bookCheckType: vm.itemObj.bookType,
								bookNo: v.bookNo,
								ocId: v.officeCode.ocId,
								officeCode: v.officeCode.officeCode,
								officeName: v.officeCode.shortName
							},
							fileIdList: v.fileObj.ids
						});
					} else {
						arrObj = '';
					}
				});
				$rootScope.loading = true;
				restAPI.preJudice.addbooks.save({}, arrObj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.status === 9999) {
							Notification.error({
								message: resp.msg
							});
						} else {
							$modalInstance.close(vm.newItems);
						}
					});
			} else {
				$modalInstance.close(vm.newItems);
			}
		}
		/**
		 * 校验数据
		 */
		function valid(params) {
			var result = true;
			for (var index = 0; index < params.length; index++) {
				var element = params[index];
				if (!(element.bookNo && element.ids.length && element.officeCode)) {
					result = false;
					break;
				}
			}
			return result;
		}
		/**
		 * 锂电池
		 */
		function showBatteryDeclaraction() {
			var batteryDeclaractionDialog = $modal.open({
				template: require('../declaraction/batteryDeclaraction.html'),
				controller: require('../declaraction/batteryDeclaraction.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '锂电池',
							awId: vm.itemObj.parentAwId ? vm.itemObj.parentAwId : vm.itemObj.awId,
							waybillNo: vm.itemObj.waybillNo,
							editAble: vm.itemObj.editAble,
							airCode: items.obj.carrier1
						};
					}
				}
			});
			batteryDeclaractionDialog.result.then(function (resp) {
				vm.itemObj.eliFlag = resp.eliFlag;
				vm.itemObj.elmFlag = resp.elmFlag;
				$state.reload();
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