'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', '$modal', 'Notification',
	function ($scope, $modalInstance, items, restAPI, $rootScope, $modal, Notification) {
		var vm = $scope;
		vm.addSe = addSe;
		vm.cancel = cancel;
		vm.rows = [];
		vm.title = items.title;
		vm.item = angular.copy(items.obj);
		vm.typeData = [{
			id: 'onetime',
			name: '单次使用'
		}, {
			id: 'sharing',
			name: '共享证书'
		}];
		/***********/
		vm.loading = false;
		vm.openDialog = openDialog;
		vm.save = save;
		vm.isChildBill = vm.item.isChildBill;

		search();

		/**
		 * 查询证书列表
		 */
		function search() {
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
					}
				});
		}

		function addSe($e, param, parentawId) {
			vm.loading = true;
			restAPI.waybill.addSe.save({}, {
				id: param.id,
				status: $e.target.checked ? '1' : '0',
				awId: parentawId
			}).$promise.then(function (resp) {
				if (resp.ok) {
					Notification.success({
						message: $e.target.checked ? '确认适用本运单' : '未确认是否适用本运单'
					});
					param.status = $e.target.checked ? '1' : '0';
					vm.loading = false;
				} else {
					Notification.error({
						message: resp.msg
					});
					vm.loading = false;
				}
			});
		}
		/**
		 * 保存
		 */
		function save() {
			$modalInstance.close(vm.rows);
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
						return params;
					}
				}
			});
		}
	}
];