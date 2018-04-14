'use strict';

module.exports = ['$scope', '$rootScope', 'restAPI', '$modalInstance', 'items', '$modal', 'Notification',
	function ($scope, $rootScope, restAPI, $modalInstance, items, $modal, Notification) {
		var vm = $scope;
		var obj = angular.copy(items);
		vm.cancel = cancel;
		vm.salesData = obj.salesData;
		vm.airData = obj.airData;
		vm.itemObj = {
			check: {
				agentAble: false
			},
			agentCode: []
		};
		vm.save = save;
		vm.title = obj.title;

		setData();
		/**
		 * 显示数据
		 */
		function setData() {
			if (obj.obj.id) {
				vm.itemObj.showWord = obj.obj.showWord;
				if (obj.obj.airCode) {
					for (var index = 0; index < vm.airData.length; index++) {
						var element = vm.airData[index];
						if (obj.obj.airCode === element.airCode) {
							vm.itemObj.airCode = element;
							break;
						}
					}
				}
				if (obj.obj.agentCode === '所有') {
					vm.itemObj.check.agentAble = true;
				} else {
					if (obj.obj.agentCode) {
						var agentCode = obj.obj.agentCode.split('|');
						angular.forEach(agentCode, function (v, k) {
							for (var index = 0; index < vm.salesData.length; index++) {
								var element = vm.salesData[index];
								if (v === element.code) {
									vm.itemObj.agentCode.push(element);
									break;
								}
							}
						});
					}
				}
				vm.itemObj.id = obj.obj.id;
				vm.itemObj.delFlag = obj.obj.delFlag;
			}
		}
		/**
		 * 保存
		 */
		function save() {
			var data = vm.itemObj;
			//航空公司 2选 1
			if (!data.airCode || data.airCode === '') {
				Notification.error({
					message: '请填写航空公司'
				});
				return;
			}
			//代理人 2 选1
			if ((!data.agentCode || data.agentCode.length === 0) && !data.check.agentAble) {
				Notification.error({
					message: '请填写代理人或选择所有'
				});
				return;
			}

			var obj = {};
			if (!data.check.agentAble) {
				var agentCode = [];
				if (data.agentCode.length) {
					angular.forEach(data.agentCode, function (v, k) {
						agentCode.push(v.code);
					});
				}
				obj.agentCode = agentCode.join('|');
			} else {
				obj.agentCode = '0';
			}

			obj.airCode = data.airCode.airCode;
			obj.showWord = data.showWord;
			if (data.id) {
				obj.id = data.id;
				obj.delFlag = data.delFlag;
			}

			$rootScope.loading = true;
			restAPI.officialRule.updateList.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: vm.title + '成功'
						});
						$modalInstance.close(vm.itemObj);
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