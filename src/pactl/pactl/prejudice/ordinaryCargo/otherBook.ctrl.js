'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$modal',
	function ($scope, $modalInstance, items, restAPI, $modal) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.loading = false;
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
			restAPI.preJudice.bookCheck.save({}, {
					awId: items.obj.awId,
					bookType: items.obj.bookType
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.certData = resp.data;
						angular.forEach(vm.certData, function (v, k) {
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