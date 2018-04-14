'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', '$modal',
	function ($scope, $modalInstance, items, restAPI, $rootScope, $modal) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.rows = [];
		vm.title = items.title;
		/***********/
		vm.openDialog = openDialog;
		vm.loading = false;

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
							srcArr: params.srcArr
						};
					}
				}
			});
		}
	}
];