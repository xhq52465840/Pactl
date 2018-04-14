'use strict';

module.exports = ['$scope', 'restAPI', '$modalInstance', '$rootScope', '$modal', '$stateParams', 'Notification', 'items',
	function ($scope, restAPI, $modalInstance, $rootScope, $modal, $stateParams, Notification, items) {
		var vm = $scope;
		vm.changes = items.obj;
		vm.change = {};
		vm.cancel = cancel;
		vm.detailInfo = detailInfo;
		vm.save = save;
		vm.title = items.title;
		vm.loading = false;
		vm.wrongWaybillNo = true;
		vm.deletechanged = deletechanged;

		search();
		/**
		 * 历史运单改配查询
		 */
		function search() {
			vm.loading = true;
			restAPI.waybill.queryChHistory.save({}, {
					awId: vm.changes.awId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						if (resp.data) {
							vm.row = resp.data;
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				})
		}
		/**
		 * 点击“详细”按钮，展示详细信息
		 */
		function detailInfo() {
			if (!vm.change.waybillNo) {
				return;
			}
			if (vm.change.waybillNo === vm.changes.waybillNo) {
				return;
			}
			//vm.loading = true;
			restAPI.waybill.queryChange.save({}, {
					waybillNo: vm.change.waybillNo
				})
				.$promise.then(function (resp) {
					//vm.loading = false;
					if (resp.ok) {
						if (resp.data) {
							vm.change = resp.data;
							vm.wrongWaybillNo = false;
						} else {
							vm.wrongWaybillNo = true;
							vm.change = {
								waybillNo: vm.change.waybillNo
							};
						}
					} else {
						Notification.error({
							message: resp.msg
						});
						vm.change = {
							waybillNo: vm.change.waybillNo
						};
						vm.wrongWaybillNo = true;
					}
				})
		}
		/**
		 * 删除运单改配
		 */
		function deletechanged(awId) {
			var delDialog = $modal.open({
				template: require('../../../../remove/remove.html'),
				controller: require('../../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '取消改配运单：' + vm.row.waybillNo,
							content: '你将要取消改配运单' + vm.row.waybillNo + '。此操作不能恢复。'
						};
					}
				}
			});
			delDialog.result.then(function () {
				var obj = {};
				obj.awId = vm.changes.awId
				obj.targetAwId = awId;
				$rootScope.loading = true;
				restAPI.waybill.deletechanged.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '运单改配取消成功'
							});
							vm.row = {};
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function () {

			});
		}
		/**
		 * 保存
		 */
		function save() {
			if (!vm.change.waybillNo || vm.change.waybillNo === '') {
				Notification.error({
					message: '改配的目标运单号不能为空'
				});
				return;
			}
			if (vm.change.waybillNo === vm.changes.waybillNo) {
				Notification.error({
					message: '改配的目标运单号不能与当前运单号相同'
				});
				return;
			}
			if (vm.wrongWaybillNo) {
				Notification.error({
					message: '改配的目标运单号不正确，请重新录入运单号'
				});
				return;
			}
			$modalInstance.close(vm.change);
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}

	}
];