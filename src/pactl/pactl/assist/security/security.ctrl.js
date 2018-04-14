'use strict';

var security_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth', '$state', '$filter',
	function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth, $state, $filter) {
		var vm = $scope;
		vm.billObj = {};
		vm.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
		vm.save = save;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.search = getWaybillview;
		vm.billviewData = [];
		vm.cancelCheckreturn = cancelCheckreturn;
		vm.options = {
			hour: [],
			minute: []
		};
		for (var i = 0; i < 24; i++) {
			if (i < 10) {
				vm.options.hour.push('0' + i);
			} else {
				vm.options.hour.push(i);
			};
		};
		for (var i = 0; i < 60; i++) {
			if (i < 10) {
				vm.options.minute.push('0' + i);
			} else {
				vm.options.minute.push(i);
			};
		};
		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var waybillNo = null;
			if (vm.billObj.srh_no && vm.billObj.srh_code) {
				waybillNo = vm.billObj.srh_code + vm.billObj.srh_no;
			};
			var obj = {
				waybillNo: waybillNo,
				carrier1: vm.billObj.carrier1,
				agentOprnId: vm.billObj.agentOprnId ? vm.billObj.agentOprnId.id : null,
				rows: vm.page.length,
				page: vm.page.currentPage
			};
			return obj;
		}
		/**
		 * 获取页面数据
		 */
		function getWaybillview() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.security.getDate.save({}, obj).$promise.then(function (resp) {
				$rootScope.loading = false;
				vm.billviewData = resp.rows || [];
				angular.forEach(vm.billviewData, function (v, k) {
					if(v.returnTime) {
					  var returnTime = new Date(v.returnTime);
					  v.returnTime = $filter('date')(returnTime, 'yyyy-MM-dd');
					  v.hour = parseInt($filter('date')(returnTime, 'HH'));
					  v.minute = parseInt($filter('date')(returnTime, 'mm'));
					}
					if(v.returnCount && v.returnCount !== '') {
						v.returnCount = parseInt(v.returnCount);
					}
				  });
				Page.setPage(vm.page, resp);
			});
		};
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, getWaybillview);
		};
		/**
		 * 获取操作代理
		 */
		function getAgentData() {
			$rootScope.loading = true;
			restAPI.agent.listOper.query({}, {}).$promise.then(function (resp) {
				$rootScope.loading = false;
				vm.agentSalesData = resp;
				vm.agentSalesData.push({
					code: '所有',
					id: null
				})
				getWaybillview();
			});
		};
		getAgentData();
		/**
		 * 保存
		 */
		function save() {
			var changeData = [];
			for (var i = 0; i < vm.billviewData.length; i++) {
				if (vm.billviewData[i].isChange) {
					if (vm.billviewData[i].returnCount !== vm.billviewData[i].rcpNo) {
						Notification.error({
							message: '退运件数必须和件数相同'
						});
						return
					} 
					if(!vm.billviewData[i].returnName) {
						Notification.error({
							message: '退运操作员必须填写'
						});
						return
					}
					if(!vm.billviewData[i].returnTime || (!vm.billviewData[i].hour &&　vm.billviewData[i].hour!==0) || (!vm.billviewData[i].minute && vm.billviewData[i].minute!==0)) {
						Notification.error({
							message: '请填写完整的退运时间'
						});
						return
					}
					if(vm.billviewData[i].hour && (vm.billviewData[i].hour>23 || vm.billviewData[i].hour<0)) {
						Notification.error({
							message: '小时填写不正确'
						});
						return
					}
					if(vm.billviewData[i].minute && (vm.billviewData[i].minute>59 || vm.billviewData[i].minute<0)) {
						Notification.error({
							message: '分钟填写不正确'
						});
						return
					}
					changeData.push(vm.billviewData[i]);
				}
			};
			if (changeData.length == 0) {
				Notification.error({
					message: '没有可保存的数据,请补充相应的数据后在点击保存'
				});
				return
			};
			var savelog = $modal.open({
				template: require('./saveSecurity.html'),
				controller: require('./saveSecurity.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '请确认是否退运以下货物',
							refundData: changeData
						};
					}
				}
			});
			savelog.result.then(function (data) {
				if (data.length > 0) {
					var saveData = [];
					for (var i = 0; i < data.length; i++) {
						var hour = ""+data[i].hour;
						if(hour.length==1)  {
							hour = "0"+hour;
						}
						var minute = ""+data[i].minute;
						if(minute.length==1)  {
							minute = "0"+minute;
						}
						var dateStr = (data[i].returnTime + ' ' + hour + ":" + minute + ":00").replace(/-/g,  "/");
						var returnTime = new Date(dateStr).getTime();
						var obj = {
							"awId": data[i].awId, // 运单id
							"waybillNo": data[i].waybillNo, // 运单号
							"returnName": data[i].returnName, // 退运单姓名
							"returnTime": returnTime, // 退运时间
							"returnCount": data[i].returnCount
						};
						saveData.push(obj);
					};
					restAPI.security.saveWaybillview.save({}, saveData).$promise.then(function (resp) {
						if (resp.ok) {
							Notification.success({
								message: '保存成功'
							});
							$state.reload();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
				} else {
					return
				}
			}, function () {});

		}

		function cancelCheckreturn(item) {
			var delDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
				  items: function () {
					return {
					  title: '撤销安保部门退运：' + item.waybillNo,
					  content: '你将要撤消运单号为：' + item.waybillNo + '的安保部退运，请确认。'
					};
				  }
				}
			  });
			  delDialog.result.then(function () {
				$rootScope.loading = true;
				var saveData = [];
				var obj = {
					"awId": item.awId
				};
				saveData.push(obj);
				restAPI.security.cancelWaybillview.save({}, saveData).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '撤销成功'
						});
						getWaybillview();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			  }, function () {
		
			  });
		}

		$scope.$watch('billObj.srh_code', function (newVal, oldVal) {
			if (newVal) {
				newVal = newVal.replace(/[^0-9]/g, '');
				if (newVal.length < 3) {
				$scope.billObj.srh_code = newVal.substr(0, 3);
				} else if (newVal.length === 3) {
				$scope.billObj.srh_code = newVal.substr(0, 3);
				angular.element('#srh_no').focus();
				} else if (newVal.length > 3) {
				$scope.billObj.srh_code = newVal.substr(0, 3);
				$scope.billObj.srh_no = newVal.substr(3);
				angular.element('#srh_no').focus();
				}
			}
			});
		$scope.$watch('billObj.srh_no', function (newVal, oldVal) {
			if (angular.isString(newVal)) {
				newVal = newVal.replace(/[^0-9]/g, '');
				if (newVal.length) {
				$scope.billObj.srh_no = newVal.substr(0, 8);
				} else {
				if (oldVal && oldVal.length > 0 && newVal.length === 0) {
					angular.element('#srh_code').focus();
				} else {
					$scope.billObj.srh_no = newVal;
				}
				}
			}
		});


	}
];

module.exports = angular.module('app.pactlAssist.security', []).controller('securityCtrl', security_fn);