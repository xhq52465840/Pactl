'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Notification',
	function($scope, $modalInstance, items, restAPI, $rootScope, Notification) {
		var vm = $scope;
		vm.cancel = cancel;
		vm.infos = {
			unitid: items.obj.unitid,
			type: items.obj.type
		};
		vm.infos.fileObj1 = {
			url: items.obj.fileObj1 ? items.obj.fileObj1 : null
		};
		vm.infos.fileObj2 = {
			url: items.obj.fileObj2 ? items.obj.fileObj2 : null
		};
		vm.uploadCallback1 = uploadCallback1;
		vm.uploadCallback2 = uploadCallback2;
		vm.save = save;
		vm.title = items.title;

		stampType();

		/**
		 * 安检章类型
		 */
		function stampType() {
			$rootScope.loading = true;
			restAPI.stamp.queryList.save({}, {})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.stampData = resp.data;
					setData();
				});
		}
		/**
		 * 编辑窗口显示安检章类型数据
		 */
		function setData() {
			if (vm.infos.unitid) {
				for (var index = 0; index < vm.stampData.length; index++) {
					var element = vm.stampData[index];
					if (element.name === vm.infos.type) {
						vm.infos.type = element;
						break;
					}
				}
			}
		}
		/**
		 * 上传文件1
		 */
		function uploadCallback1(res, param) {
			var file = res;
			var respDt = file.data;
			if (file && file.ok) {
				vm.infos.fileObj1 = {
					id: respDt.fileId,
					url: respDt.fileHttpPath
				};
			} else {
				Notification.error({
					message: '上传失败'
				});
			}
		}
		/**
		 * 上传文件2
		 */
		function uploadCallback2(res, param) {
			var file = res;
			var respDt = file.data;
			if (file && file.ok) {
				vm.infos.fileObj2 = {
					id: respDt.fileId,
					url: respDt.fileHttpPath
				};
			} else {
				Notification.error({
					message: '上传失败'
				});
			}
		}
		/**
		 * 保存
		 */
		function save() {
			$modalInstance.close(vm.infos);
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];