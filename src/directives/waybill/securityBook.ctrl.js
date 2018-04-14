'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Notification', '$modal', '$timeout',
	function ($scope, $modalInstance, items, restAPI, $rootScope, Notification, $modal, $timeout) {
		var vm = $scope;
		vm.officeCodeData = angular.copy(items.officeCodeData);
		vm.rows = angular.copy(items.certData); //所有的安检添加证书数据
		vm.cancel = cancel;
		vm.save = save;
		vm.title = items.title;
		vm.typeData = [{
			id: 'onetime',
			name: '单次使用'
		}, {
			id: 'sharing',
			name: '共享证书'
		}];
		vm.openDialog = openDialog;
		/**
		 * 保存
		 */
		function save(item,$index) {
			$modalInstance.close({item:item,index:$index});
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
	}
];