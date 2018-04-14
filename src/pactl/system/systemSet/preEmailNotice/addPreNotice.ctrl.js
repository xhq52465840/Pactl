'use strict';

module.exports = ['$scope', '$rootScope', 'restAPI', '$modalInstance', 'items', '$modal', 'Notification',
	function($scope, $rootScope, restAPI, $modalInstance, items, $modal, Notification) {
		var vm = $scope;
		var obj = angular.copy(items);
		vm.cancel = cancel;
		vm.stationData = obj.stationData;
		vm.sentEmails = obj.sentEmails;
		vm.preNoticeData = obj.obj;
		vm.sentTest = sentTest;
		vm.save = save;
		vm.title = obj.title;

		setData();
		/**
		 * 显示数据
		 */
		function setData() {
			if (obj.obj.id) {
				for (var index = 0; index < vm.stationData.length; index++) {
					var element1 = vm.stationData[index];
					if (element1.id === obj.obj.freightStation) {
						vm.preNoticeData.freightStation = element1;
						break;
					}
				}
				for (var index = 0; index < vm.sentEmails.length; index++) {
					var element2 = vm.sentEmails[index];
					if (element2.id === +obj.obj.sendMail) {
						vm.preNoticeData.sendMail = element2;
						break;
					}
				}
			}
		}
		/**
		 * 发送测试邮件
		 */
		function sentTest() {
			$rootScope.loading = true;
			restAPI.PreNoticeEmail.testPreNoticeEmail.save({}, $.param({
					mailId: vm.preNoticeData.sendMail.id,
					toAddress: vm.preNoticeData.address,
					subject: vm.preNoticeData.mailTheme,
					text: vm.preNoticeData.sendContent
				}))
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: resp.msg
						});
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
		/**
		 * 保存
		 */
		function save() {
			var data = vm.preNoticeData;
			var obj = {};
			obj.address = data.address;
			obj.sendContent = data.sendContent;
			obj.freightStation = data.freightStation.id;
			obj.mailTheme = data.mailTheme;
			obj.noOneRemTime = data.noOneRemTime;
			obj.sendMail = data.sendMail.id;
			if(data.id) {
				obj.id = data.id;
			}
			
			$rootScope.loading = true;
			restAPI.PreNoticeEmail.updatePreNoticeEmail.save({}, obj)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: vm.title+'成功'
						});
						$modalInstance.close(vm.preNoticeData);
					} else {
						Notification.error({
							message: resp.msg
						});
					}
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