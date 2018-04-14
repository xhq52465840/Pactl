'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$modal', 'Notification', '$rootScope',
	function ($scope, $modalInstance, items, restAPI, $modal, Notification, $rootScope) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.rows = [];
		vm.changeStatus = changeStatus;
		vm.loading = false;
		vm.reasonData = items.reasonData;
		vm.saveForbidden = items.obj.saveForbidden;
		vm.save = save;
		vm.selectCargo = selectCargo;
		vm.title = items.title;
		vm.awId = items.obj.awId;
		vm.wStatusCode = items.obj.wStatusCode;
		vm.isBookTypeChange = false;
		var goodsDesc = items.obj.goodsDesc;
		var goodsNameEn = items.obj.goodsNameEn;
		var goodsNameCn = items.obj.goodsNameCn;
		vm.typeData = [{
			id: 'onetime',
			name: '单次使用'
		}, {
			id: 'sharing',
			name: '共享证书'
		}];
		/***********/
		vm.openDialog = openDialog;


		getReason();
		/**
		 * 获取退回原因
		 */
		function getReason() {
			restAPI.baseData.queryAll.save({}, {
					type: '1478056570840928'
				})
				.$promise.then(function (resp) {
					vm.reasonData = resp.rows;
					search();
				});
		}
		/**
		 * 单次证书选择普货、锂电池
		 */
		function selectCargo(param, type) {
			if(param.goodsType !== type) {
				param.status = '0';
				vm.isBookTypeChange = true;
			}
			param.goodsType = type;
		}
		/**
		 * 退回
		 */
		function changeStatus(param, type, $e) {
			vm.isPass = true;
			if (param.goodsType !== '101' && param.goodsType !== '102') {
				Notification.error({
					message: '审核前请先选择证书类型'
				});
			} else {
				restAPI.preJudice.checkBook.save({}, {
						bookNo: param.bookNo,
						ocId: param.ocId,
						airCode: items.obj.airCode,
						awId: items.obj.awId
					})
					.$promise.then(function (resp) {
						if (resp.ok) {
							if (type !== "2" && param.bookType === "sharing") {
								if (!resp.data) {
									Notification.error({
										message: '当前证书已过期或已失效，无法通过'
									});
								} else {
									param.status = type;
									vm.isBookTypeChange = true;
								}
							} else {
								param.status = type;
								vm.isBookTypeChange = true;
							}
							vm.isPass = false;
						};
					});
			}
		}
		/**
		 * 查询证书列表
		 */
		function search() {
			console.log(items);
			vm.loading = true;
			restAPI.preJudice.bookCheck.save({}, {
					awId: items.obj.awId,
					bookType: items.obj.bookType
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
						angular.forEach(vm.rows, function (v, k) {
							v.srcArr = [];
							var showName='page0'
							 var screenshotPage = v.officeInfo.screenshotPage||1
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
					}
				});
		}
		/**
		 * 保存
		 */
		function save() {
			var saveData = [],
				btnMark = [];
			angular.forEach(vm.rows, function (v, k) {
				if (v.book.status === '2') {
					if (!v.book.bookRemarks) {
						btnMark.push(v.book.bookNo);
					}
				}
				if (v.book.status === '1' || v.book.status === '2' || v.book.status === '0') {
					saveData.push({
						id: v.book.id,
						awId:v.book.awId,
						status: v.book.status,
						remarks: v.book.bookRemarks ? v.book.bookRemarks.name : '',
						goodsType: v.book.goodsType
					});
				}
			});
			var obj = {};
			obj.books = saveData;
			obj.isBookTypeChange = vm.isBookTypeChange;
			$modalInstance.close(obj);
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
				template: require('../../../showPDF/showPDF.html'),
				controller: require('../../../showPDF/showPDF.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							src: params.pdfPath,
							goodsDesc: goodsDesc,
							bookNo: params.book.bookNo,
							officeName: params.book.officeName,
							goodsNameEn: goodsNameEn,
							goodsNameCn: goodsNameCn,
							srcArr: params.srcArr
						};
					}
				}
			});
		}
	}
];