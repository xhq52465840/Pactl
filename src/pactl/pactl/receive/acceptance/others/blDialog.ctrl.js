'use strict';

module.exports = ['$scope', '$rootScope', '$modalInstance', 'items', 'restAPI', 'Notification', '$state',
	function($scope, $rootScope, $modalInstance, items, restAPI, Notification, $state) {
		var vm = $scope;
		var selected = [];
		var mainSelected = '';
		vm.awId = items.awId;
		vm.billNO = items.billNO;
		vm.checkedSon = checkedSon;
		vm.cancel = cancel;
		vm.disableSon = disableSon;
		vm.loading = false;
		vm.singleCheck1 = singleCheck1;
		vm.singleCheck2 = singleCheck2;
		vm.save1 = save1;
		vm.save2 = save2;
		vm.title = items.title;

		search();

		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.waybill.billdetailbyid.save({}, {
				awId: vm.awId,
				showAll: '1'
			}).$promise.then(function(resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					vm.parentBill = resp.data.parentBill;
					vm.rows = resp.data.rows;
					clearCheck();
					mainSelected = '';
					selected = [];
				} else {
					Notification.error({
						message: resp.msg
					});
				}
			});
		}

		/**
		 * 清空选择
		 */
		function clearCheck() {
			vm.parentBill.checked = false;
			angular.forEach(vm.rows, function(v, k) {
				v.checked = false;
			});
		}

		/**
		 * 主单单选
		 */
		function singleCheck1($e, data) {
				var checkbox = $e.target;
				data.checked = checkbox.checked;
				if (data.checked) {
					mainSelected = data.awId;
					angular.forEach(vm.rows, function(v, k) {
						v.checked = false;
						v.editable = true;
					});
				} else {
					mainSelected = '';
					angular.forEach(vm.rows, function(v, k) {
						v.checked = false;
						v.editable = false;
					});
				}
			}
			/**
			 * 检验是否选中
			 */
		function checkedSon(data) {
				if (!data) {
					return
				}
				return !!data.checked;
			}
			/**
			 * 检验是否可以选中
			 */
		function disableSon(editable, type, childBill) {
				if (type == 'childBill') {
					if (vm.parentBill.checked || vm.parentBill.returnFlag === '1' || childBill.refStatus !== '1') {
						return true;
					}
				} else {
					return !!editable;
				}
			}
			/**
			 * 分单单选
			 */
		function singleCheck2($e, data) {
				var checkbox = $e.target,
					awId = data.childBill.awId,
					index = selected.indexOf(awId);
				data.checked = checkbox.checked;
				if (data.checked) {
					if (index < 0) {
						selected.push(awId);
					}
					if (vm.rows.length - selected.length === 1) {
						angular.forEach(vm.rows, function(v, k) {
							if (!v.checked) {
								v.editable = true;
								v.checked = false;
							}
						});
					}
				} else {
					if (index > -1) {
						selected.splice(index, 1);
					}
					if (vm.rows.length - selected.length !== 1) {
						angular.forEach(vm.rows, function(v, k) {
							if (v.editable) {
								v.editable = false;
							}
						});
					}
				}
			}
			/**
			 * 主单：打印退库单/取消打印退库单----数据
			 	awId:运单ID
			 	*/
		function getData1() {
				var obj = {};
				obj.parentAwId = vm.awId;
				obj.action = "parent";
				obj.reMarks = [{
					awId: vm.awId,
					reMark: vm.parentBill.returnReMarks ? vm.parentBill.returnReMarks : ''
				}];
				return obj;
			}
			/**
			 * 分单：打印退库单/取消打印退库单----数据
			 */
		function getData2() {
				var obj = {};
				obj.parentAwId = vm.awId;
				obj.action = "child";
				obj.awIdList = [];
				obj.reMarks = [];
				// 根据选择的单号进行筛选，匹配相应的备注传给后台
				for (var i = 0; i < selected.length; i++) {
					for (var j = 0; j < vm.rows.length; j++) {
						if (vm.rows[j].childBill.awId == selected[i]) {
							var tempObj = {};
							tempObj.awId = selected[i];
							tempObj.reMark = vm.rows[j].childBill.returnReMarks;
							obj.reMarks.push(tempObj);
						}
					}
				};
				angular.forEach(selected, function(v, k) {
					if (v.length) {
						obj.awIdList.push(v);
					}
				});
				return obj;
			}
			/**
			 * 打印退库单 保存
			 * 1.首先查看数据里的主单数据是否被选中；如果选中，则打印该主单；
			 * 2.如果主单没选中，查看是否有分单被选中，如果没有分单被选中，不能打印；
			 * 3.如果有分单被选中，则打印选中的所有分单
			 */
		function save1() {
				if (mainSelected !== '' || selected.length > 0) {
					if (mainSelected !== '') {
						saveParent();
					} else {
						saveChild();
					}
				} else {
					Notification.warning({
						message: '未勾选任何项！'
					});
				}
			}
			/**
			 * 主单打印退库单 保存
			 */
		function saveParent(obj) {
				var obj = getData1();
				vm.loading = true;
				restAPI.waybill.printbill.save({}, obj)
					.$promise.then(function(resp) {
						vm.loading = false;
						if (resp.ok) {
							var urlHref = $state.href('pactlReceive.printReturn', {
								'awId': vm.awId,
								'mainSelected': mainSelected
							});
							var newWindow = window.open('about:blank', '_blank');
							newWindow.location.href = urlHref;
							Notification.success({
								message: '打印退库单成功'
							});
							vm.parentBill.editable = true;
							vm.parentBill.returnFlag = '1';

						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}
			/**
			 * 分单打印退库单 保存
			 */
		function saveChild(obj) {
				var obj = getData2();
				vm.loading = true;
				var secIds = '';
				angular.forEach(obj.awIdList, function(v, k) {
					if (secIds.length > 0) {
						secIds += ',';
					}
					secIds += v;
				});
				restAPI.waybill.printbill.save({}, obj)
					.$promise.then(function(resp) {
						vm.loading = false;
						if (resp.ok) {
							var urlHref = $state.href('pactlReceive.printReturn', {
								'awId': vm.awId,
								'secIds': secIds
							});
							var newWindow = window.open('about:blank', '_blank');
							newWindow.location.href = urlHref;
							Notification.success({
								message: '打印退库单成功'
							});
							search();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}
			/**
			 * 取消打印退库单 保存
			 */
		function save2(type) {
				if (mainSelected !== '' || selected.length > 0) {
					if (mainSelected !== '') {
						cancelParent();
					} else {
						cancelChild();
					}
				} else {
					Notification.warning({
						message: '未勾选任何项！'
					});
				}
				// if (selected.length <= 0) {
				// 	cancelParent();
				// } else {
				// 	cancelChild();
				// };
			}
			/**
			 * 主单取消打印退库单 保存
			 */
		function cancelParent(obj) {
				var obj = getData1();
				vm.loading = true;
				restAPI.waybill.cancelprintbill.save({}, obj)
					.$promise.then(function(resp) {
						vm.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '取消打印退库单成功'
							});
							search();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}
			/**
			 * 分单取消打印退库单 保存
			 */
		function cancelChild(obj) {
				var obj = getData2();
				vm.loading = true;
				restAPI.waybill.cancelprintbill.save({}, obj)
					.$promise.then(function(resp) {
						vm.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '取消打印退库单成功'
							});
							search();
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
			$modalInstance.close();
		}
	}
];