'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Notification', '$modal', '$timeout',
	function ($scope, $modalInstance, items, restAPI, $rootScope, Notification, $modal, $timeout) {
		var vm = $scope;
		var certData = angular.copy(items.certData); //所有的证书数据
		var oldCertData = angular.copy(items.oldCertData); //被删除的证书
		vm.applyBookData = angular.copy(items.applyBookData);
		vm.addCert = addCert;
		vm.bookCallback = bookCallback;
		vm.cancel = cancel;
		vm.canDel = canDel;
		vm.itemObj = angular.copy(items.obj);
		vm.newItems = [];
		vm.originItems = [];
		vm.officeCodeData = [];
		vm.onSelectCallback = onSelectCallback;
		vm.remove = remove;
		vm.remove2 = remove2;
		vm.removeFile = removeFile;
		vm.removeCert = removeCert;
		vm.rows = [];
		vm.save = save;
		vm.title = items.title;
		vm.typeData = [{
			id: 'onetime',
			name: '单次使用'
		}, {
			id: 'sharing',
			name: '共享证书'
		}];
		vm.uploadCallback = uploadCallback;
		/***********/
		vm.openDialog = openDialog;
		vm.selectCargo = selectCargo;
		vm.canSubCertEdit = vm.itemObj.canSubCertEdit;
		vm.masterAwId = vm.itemObj.masterAwId;
		vm.masterRows = [];
		vm.selectMasterCert = selectMasterCert;
		vm.removeMasterCert = removeMasterCert;

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
					console.log(vm.officeCodeData)
					if(vm.applyBookData && vm.applyBookData.length>0) {
						angular.forEach(vm.applyBookData, function (v,k) {
							angular.forEach(vm.officeCodeData, function (m,n) {
								if(v.book.ocId == m.ocId && v.book.officeCode == m.officeCode) {	
									v.book.officeInfo = m;
								}
							});
						});
					}
					angular.forEach(vm.applyBookData, function (v, k) {
						v.srcArr1 = [];
						 var showName = 'page0';
				            var screenshotPage = v.book.officeInfo.screenshotPage
				            if(screenshotPage<(v.files.length)){
				            	showName = "page"+(screenshotPage-1)
				            };
				            
						angular.forEach(v.files, function (m, n) {
							if (!/[pP][dD][fF]/.test(m.suffix)) {
								if (m.oldName === showName) {
									v.filePath = m.fileHttpPath;
									v.imgShow = false;
									v.style1 = {
										width: (v.book.officeInfo && v.book.officeInfo.wides || 0) + 'px',
										height: (v.book.officeInfo && v.book.officeInfo.lengths || 0) + 'px',
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
										top: (v.book.officeInfo && v.book.officeInfo.yAxle || 0) + 'px',
										left: (v.book.officeInfo && v.book.officeInfo.xAxle || 0) + 'px'
									};
								}
								v.srcArr1.push(m.fileHttpPath);
							} else {
								v.pdfPath = m.fileHttpPath;
							}
							v.originType = '1';
						});
					});
					search();
				});
		}
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
				if(vm.canSubCertEdit) {
					getMasterCertData();
				}
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
								v.originType = '1';
							});
						});
						if(vm.canSubCertEdit) {
							getMasterCertData();
						}
					//	console.log(vm.rows)
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
				//console.log(vm.applyBookData)
		}


		/**
		 * 选择主单的证书,选择以后 将证书从主单证书中删除，添加到新证书中
		 * @param {*} params 
		 * @param {*} item 
		 */
		function selectMasterCert() {
			var bookDialog = $modal.open({
				template: require('./securityBook.html'),
				controller: require('./securityBook.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '可选择的安检添加证书',
							certData: vm.masterRows,
							officeCodeData : vm.officeCodeData
						};
					}
				}
			});
			bookDialog.result.then(function (data) {
				vm.newItems.push(data.item);
				vm.masterRows.splice(data.index,1);
			}, function (resp) {

			});
		}

		function removeMasterCert(item, $index) {
			vm.masterRows.push(item);
			removeCert(item, $index);
		}

		/**
		 * 获取证书的原始数据
		 */
		function getMasterCertData() {
			$rootScope.loading = true;
			restAPI.preJudice.bookCheck.save({}, {
					awId: vm.masterAwId,
					bookType: items.obj.bookType
				})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						vm.masterRows = [];
						var rows = resp.data;
						angular.forEach(rows, function (v, k) {
							v.srcArr = [];
							var ids = [];
							var fileObj = null;
							 var showName = 'page0';
					            var screenshotPage = v.officeInfo.screenshotPage
					            if(screenshotPage<(v.files.length)){
					            	showName = "page"+(screenshotPage-1)
					            };
							angular.forEach(v.files, function (m, n) {
								ids.push(m.fileId);
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
									fileObj = m;
								}
								v.originType = '1';
								v.awId = items.obj.awId;
							});
							var row = {};
							row.bookId = v.book.bookId;
							row.bookNo = v.book.bookNo;
							row.deviceId = v.book.deviceId;
							row.officeCode = v.officeInfo;
							row.fileHttpPath = v.filePath;
							row.pdfPath = v.pdfPath;
							row.originType = '1';
							row.style1 = v.style1;
							row.style2 = v.style2;
							row.imgShow = v.imgShow;
							row.fileObj = fileObj;
							row.files = v.files;
							row.goodsType = v.book.goodsType;
							row.ids = ids;
							row.srcArr = v.srcArr;
							row.type = vm.typeData[1];
							row.status = '1';

							var isRepetition = false;
							angular.forEach(vm.rows, function (q, r) {
								if (q.book.bookId === row.bookId) {
									isRepetition = true;
								} 
								if (q.book.bookNo === row.bookNo && q.book.officeCode === row.officeCode) {
									isRepetition = true;
								} 
							});

							angular.forEach(vm.originItems, function (q, r) {
								if (q.bookId === row.bookId) {
									isRepetition = true;
								} 
								if (q.bookNo === row.bookNo && q.officeCode.officeCode === row.officeCode) {
									isRepetition = true;
								} 
							});

							angular.forEach(vm.applyBookData, function (q, r) {
								if (q.book.bookId === row.bookId) {
									isRepetition = true;
								} 
								if (q.book.bookNo === row.bookNo && q.book.officeCode.officeCode === row.officeCode) {
									isRepetition = true;
								} 
							});

							
							if(!isRepetition) {
								vm.masterRows.push(row);
							}
						});
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}

		function selectCargo(param, type) {
			param.goodsType = type;
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
				progress: '',
				uploadable:true
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
			var file = res;
			param.srcArr = [];
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
					message: 文件上传失败
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
						param.fileHttpPath = null;
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
			if (!oldCertData) {
				oldCertData = [];
			}
			oldCertData.push(params);
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
		 * 选择机构时校验证书类型
		 */
		function onSelectCallback(params, item) {
			if (items.obj.bookType === 'book') {
				if (item.bookNo) {
					getBookType(item);
				}
			}
		}
		/**
		 * 填写证书编号时
		 */
		var time1 = null;
		function bookCallback(item) {
			if (time1) {
				$timeout.cancel(time1);
			}
			time1 = $timeout(function () {
				if (items.obj.bookType === 'book') {
					if (item.bookNo && item.officeCode) {
						getBookType(item);
					}
				}
			}, 500);
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
					param.files = [];
					param.srcArr = [];
					param.ids = [];
					angular.forEach(v.pFileRelations, function (m, n) {
						if (!/[pP][dD][fF]/.test(m.suffix)) {
							param.files.push({
								image: m.fileHttpPath
							});
							param.srcArr.push(m.fileHttpPath);
						} else {
							param.fileObj = {
								id: m.fileId,
								name: m.oldName
							};
							param.fileHttpPath = m.fileHttpPath;
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
					param.fileHttpPath = null;
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
							} else if(resp.data[0].returnStatus === '105'){
								Notification.error({
									message: resp.data[0].returnReason
								});
								reSetFile(param);
							}else if (resp.data[0].returnStatus === '101') {
								param.uploadable = true;
								if (param.type.id !== 'onetime') {
									param.type = {
										id: 'onetime',
										name: '单次使用'
									};
									param.fileObj = null;
									param.files = null;
									param.fileHttpPath = null;
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
								param.fileHttpPath = null;
								param.goodsType = null;
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
							param.fileHttpPath = null;
							param.goodsType = null;
						}
					}
				});
		}

		function reSetFile(param) {
			param.uploadable = false;
			if (param.type.id !== 'onetime') {
				param.fileObj = null;
				param.files = null;
				param.fileHttpPath = null;
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
				if (!vm.newItems[i].bookNo || !vm.newItems[i].fileObj || !vm.newItems[i].officeCode || !vm.newItems[i].goodsType) {
					var error = '';
					if (!vm.newItems[i].bookNo) {
						error = '请填写证书编号';
					} else if (!vm.newItems[i].fileObj) {
						error = '请为证书' + vm.newItems[i].bookNo + '上传证书电子档';
					} else if (!vm.newItems[i].officeCode) {
						error = '请填写证书' + vm.newItems[i].bookNo + '的鉴定机构';
					} else if(!vm.newItems[i].goodsType) {
						error = '请选择证书' + vm.newItems[i].bookNo + '的货物类型';
					}
					Notification.error({
						message: error
					});
					return false;
				}
			}
			if (valid(vm.newItems)) {
				var data1 = [];
				angular.forEach(vm.rows, function (v, k) {
					if (v.originType === '1') {
						data1.push(v);
					} 
				});
				var	data2 = angular.copy(vm.newItems),
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
				if (!(element.bookNo && element.ids.length && element.officeCode)) {
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
			if (vm.itemObj.fstatus === '0') {
				return false;
			}
			return vm.itemObj.canEdit;
		}
	}
];