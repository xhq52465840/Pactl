'use strict';

var agentSystem_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Auth', 'Notification', '$rootScope',
	function ($scope, Page, restAPI, $modal, Auth, Notification, $rootScope) {
		var vm = $scope;
		var id = '';
		var unitId = Auth.getUnitId() + '';
		var myUnitId = Auth.getMyUnitId() + '';
		vm.xianghq = [{name:"主账户",token:0},{name:"子账户",token:1},{name:"运单",token:2}]
		vm.xianghq1 = [{name:"主账户",token:0},{name:"运单",token:2}];
		vm.unitType = (unitId === myUnitId);
		vm.agentSystem = {};
		vm.save = save;
		vm.onlyNum = onlyNum;
		search();	
		/**
		 * 查询
		 */
		function search() {	
			$rootScope.loading = true;
			restAPI.nameAdvice.queryAgentSystem.save({}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {				
						vm.agentSystem.indexDays = resp.data.indexDays ? resp.data.indexDays : '';
						vm.agentSystem.shipmentHours = resp.data.shipmentHours ? resp.data.shipmentHours : '';
						vm.agentSystem.email = resp.data.email ? resp.data.email : '';
						vm.agentSystem.directorPhone = resp.data.directorPhone ? resp.data.directorPhone : '';
						vm.agentSystem.liPhone = resp.data.liPhone ? resp.data.liPhone : '';
						vm.agentSystem.nameAddress = resp.data.nameAddress ? resp.data.nameAddress : '';
						vm.agentSystem.addressFlag = resp.data.addressFlag ? resp.data.addressFlag : '0';
						vm.agentSystem.goodsDeclareName = resp.data.goodsDeclareName ? resp.data.goodsDeclareName : '';
						vm.agentSystem.goodsDeclarePhone = resp.data.goodsDeclarePhone ? resp.data.goodsDeclarePhone : '';
						vm.agentSystem.autograph = resp.data.autograph ? resp.data.autograph : '';
						id = resp.data.id ? resp.data.id : '';
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
		/**
		 *  update保存
		 */
		function save() {
			$rootScope.loading = true;
			restAPI.nameAdvice.updateAgentSystem.save({}, {
					'indexDays': vm.agentSystem.indexDays,
					'shipmentHours': vm.agentSystem.shipmentHours,
					'email': vm.agentSystem.email,
					'id': id ? id : '',
					'directorPhone': vm.agentSystem.directorPhone,
					'liPhone': vm.agentSystem.liPhone,
					'nameAddress': vm.agentSystem.nameAddress,
					'addressFlag': vm.agentSystem.addressFlag,
					'goodsDeclareName':vm.agentSystem.goodsDeclareName,
					'goodsDeclarePhone':vm.agentSystem.goodsDeclarePhone,
					'autograph':vm.agentSystem.autograph
				})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						search();
						Notification.success({
							message: '保存成功'
						  });
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}

		function onlyNum(param) {
			try {
				vm.agentSystem[param] = vm.agentSystem[param].replace(/[^0-9]/g, '');
			} catch (error) {
				return;
			}
		}
	}
];

module.exports = angular.module('app.agentOption.agentSystem', []).controller('agentSystemCtrl', agentSystem_fn);