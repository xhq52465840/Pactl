'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$modal', 'Notification',
	function($scope, $modalInstance, items, restAPI, $modal, Notification) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.loading = false;
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
		/***********/
		vm.openDialog = openDialog;

		search();

		/**
		 * 查询证书列表
		 */
		function search() {
			vm.loading = true;
			restAPI.preJudice.queryAllBooks.save({}, {
					awId: items.awId
				})
				.$promise.then(function(resp) {
					vm.loading = false;
					if (resp.total) {
						vm.rows = resp.rows;
						angular.forEach(vm.rows, function (v, k) {
							v.srcArr = [];
							 var showName = 'page0';
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
					};
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