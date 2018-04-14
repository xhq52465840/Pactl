'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope', 'Notification',
	function ($scope, $modalInstance, restAPI, items, $rootScope, Notification) {
		var vm = $scope;
		vm.addCert = addCert;
		vm.cancel = cancel;
		vm.checklist = items.obj;
		vm.checklist.electricFlag = false;
		vm.checklist.totalVolume = '';
		vm.checklist.newItems = [{
			length: '',
			width: '',
			height: '',
			volume: '',
			count: ''
		}];
		vm.cancel = cancel;
		vm.count = count;
		vm.countDiff = countDiff;
		vm.removeItem = removeItem;
		vm.status = '';
		vm.save = save;
		vm.totalChange = totalChange;

		search();

		/**
		 *  查询
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.waybill.checklist.save({}, {
				awId: vm.checklist.awId
			}).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					var data = resp.data.receivingWaybill;
					vm.status = resp.data.status.wStatus;

					if(resp.data.status.pullSubFlag === '1') {
						Notification.error({
							message: '代理拉上或者拉下了分单,请先刷新数据！'
						});
					}

					vm.checklist.newItems = [];
					angular.forEach(resp.data.chargedWeightVolumeList || [], function (v, k) {
						v.height = parseInt(v.height * 100);
						v.length = parseInt(v.length * 100);
						v.width = parseInt(v.width * 100);
						vm.checklist.newItems.push(v);
					});
					vm.checklist.canTotal = (resp.data.chargedWeightVolumeList || []).length > 0;
					vm.checklist.markChecks = data.markCheck; //收单标签检查
					vm.checklist.filesChecks = data.filesCheck; //现场补交文件
					vm.checklist.ckElectricFlag = data.ckElectricFlag === '1' ? true : false;
					vm.checklist.electricFlag = data.electricFlag === '1' ? true : false; //磁检报告
					angular.forEach(vm.checklist.filesChecks, function (v, k) {
						v.checkFlag = v.checkFlag === 'true' ? true : false;
					});
					vm.checklist.agentFiles = data.agentFiles; // 代理预审文件
					angular.forEach(vm.checklist.agentFiles, function (v, k) {
						v.checkFlag = v.checkFlag === 'true' ? true : false;
					});
					if (data.rbId) {
						vm.checklist.rbId = data.rbId;
					}
					vm.checklist.cashCheck = data.cashCheck === '1' ? true : false;
					vm.checklist.showCashCheck = data.cashCheck !== '2' ? true : false;
					vm.checklist.hasLiBatteryChange = resp.data.status.hasLiBatteryChange === '1' ? true : false;
					vm.checklist.confirmLiBatteryStatement = resp.data.receivingWaybill.confirmLiBatteryStatement === '1' ? true : false;
					vm.checklist.actualWeight = data.actualWeight; //实际重量
					vm.checklist.totalVolume = data.actualVolume; //总体积
					countDiff();
					totalCount();
					totalChange();
					getRemark();
				}
			});
		}
		/**
		 * 检查清单页面展示备注
		 */
		function getRemark() {
			restAPI.remark.queryReceiveRemark.save({}, {
					awId: vm.checklist.awId
				})
				.$promise.then(function (resp) {
					vm.remarks = resp.rows || [];
				});
		}
		/**
		 * 保存
		 */
		function save() {
			if (valid()) {
				$modalInstance.close(vm.checklist);
			}
		}
		/**
		 * 校验
		 * 
		 * TODO 当校验失败时，不能提交
		 */
		function valid() {
			if (vm.checklist.trueWeight) {
				Notification.error({
					message: '实际重量填写错误'
				});
				return false;
			}
			if (vm.checklist.totalType) {
				Notification.error({
					message: '总体积填写错误'
				});
				return false;
			}
			return true;
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
		/**
		 * 添加新项目
		 */
		function addCert() {
			vm.checklist.newItems.push({
				length: '',
				width: '',
				height: '',
				volume: '',
				count: ''
			});
		}
		/**
		 * 移除体积
		 */
		function removeItem(index) {
			vm.checklist.newItems.splice(index, 1);
			totalCount();
		}
		/**
		 * 计算重量差异（实际-运单/运单）
		 */
		function countDiff() {
			if (!(vm.checklist.actualWeight + "").length) {
				vm.checklist.trueWeight = false;
			} else {
				if (!vm.checklist.trueWeight) {
					vm.checklist.diff = Math.round(+parseFloat(Math.abs((vm.checklist.actualWeight - vm.checklist.grossWeight)) / vm.checklist.grossWeight) * 10000) / 100;
				}
			}

		}
		/**
		 * 计算体积
		 */
		function count(param, text) {
			var reg = /^[0-9]+$/;
			if (text !== 'volume') {
				try {
					param[text] = param[text].replace(/[^0-9]/g, '');
					param[text] = param[text].replace(/^[0]+/g, '');
				} catch (error) {}
			}

			if (param.length.length) {
				if (reg.test(param.length)) {
					param.lenType = false;
				} else {
					param.lenType = true;
				}
			} else {
				param.lenType = false;
			}
			if (param.width.length) {
				if (reg.test(param.width)) {
					param.widType = false;
				} else {
					param.widType = true;
				}
			} else {
				param.widType = false;
			}
			if (param.height.length) {
				if (reg.test(param.height)) {
					param.heiType = false;
				} else {
					param.heiType = true;
				}
			} else {
				param.heiType = false;
			}
			totalCount();
		}
		/**
		 * 计算所有的体积
		 */
		function totalCount() {
			var cando = [];
			angular.forEach(vm.checklist.newItems, function (v, k) {
				if (k === 0) {
					vm.checklist.totalVolume = 0;
				}
				if (!v.lenType && !v.widType && !v.heiType) {
					if (v.length && v.width && v.height && v.count) {
						cando.push(k);
						v.volume = +(parseFloat(((v.length / 100) * (v.width / 100) * (v.height / 100) * (v.count))).toFixed(2));
						vm.checklist.totalVolume = +parseFloat(vm.checklist.totalVolume + v.volume).toFixed(2);
						if (vm.checklist.totalVolume) {
							vm.checklist.totalVolume1 = parseFloat(vm.checklist.totalVolume / 0.006).toFixed(1);
							vm.checklist.totalVolume2 = Math.round((vm.checklist.totalVolume1 - vm.checklist.chargeWeight) / vm.checklist.chargeWeight * 10000) / 100;
						}
					}
				} else {
					var index = cando.indexOf(k);
					if (index > -1) {
						cando.splice(index, 1);
					}
				}
			});
			if (cando.length) {
				vm.checklist.canTotal = true;
			} else {
				vm.checklist.canTotal = false;
			}
		}
		/**
		 * 总体积数据的校验
		 */
		function totalChange() {
			if (!("" + vm.checklist.totalVolume).length) {
				vm.checklist.totalType = false;
				vm.checklist.totalVolume1 = '';
				vm.checklist.totalVolume2 = '';
			} else {
				vm.checklist.totalVolume1 = parseFloat(vm.checklist.totalVolume / 0.006).toFixed(1);
				vm.checklist.totalVolume2 = Math.round((vm.checklist.totalVolume1 - vm.checklist.chargeWeight) / vm.checklist.chargeWeight * 10000) / 100;
			}
		}
	}
];