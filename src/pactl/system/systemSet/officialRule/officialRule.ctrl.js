'use strict';

var officialRule_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
	function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
		var vm = $scope;
		vm.OfficialRuleData = {};
		vm.salesData = [];
		vm.airData = [];
		vm.add = add;
		vm.edit = edit;
		vm.remove = remove;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.search = search;
		vm.itemObj = {};
		vm.general = {
			data1: {}
		};
		vm.save = save;
		getAirData();

		/**
		 * 获取航空公司
		 */
		function getAirData() {
			$rootScope.loading = true;
			restAPI.airData.queryAll.save({}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.airData = resp.data;
					getAgentData();
				});
		}
		/**
		 * 获取代理人
		 */
		function getAgentData() {
			$rootScope.loading = true;
			restAPI.agent.listOper.query({}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.salesData = resp;
					searchOptions();
				});
		}

		/**
     * 通用查询
     */
		function searchOptions() {
			$rootScope.loading = true;
			restAPI.systemSet.queryList.save({}, $.param({
				regKeySeq: "SYSYEM_SETTINGS_BUSINESS_PARAM"
			})).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					angular.forEach(resp.data, function (v, k) {
						if (v.regKey === 'informalRule') {
							vm.general.data1 = {
								regVal: v.regVal,
								regKey: v.regKey,
								id: v.id,
								valType: v.valType,
								unitId: v.unitId,
								parentId: v.parentId
							};
						}
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
		 * 带条件的查询
		 */
		function search(showError) {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.officialRule.queryList.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.total !== 0) {
						vm.OfficialRuleData = resp.rows;
						angular.forEach(vm.OfficialRuleData, function (v, k) {
							v.agentCode = v.agentCode === '0' ? '所有' : v.agentCode;
						});
						Page.setPage(vm.page, resp);
					} else {
						vm.OfficialRuleData = [];
						if (showError) {
							Notification.warning({
								message: '没有查到符合条件的数据'
							});
						}
					}
				});
		}

		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var obj = {
				rows: vm.page.length,
				page: vm.page.currentPage
			};
			if (vm.sortObj && vm.sortObj.name) {
				obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
			}
			if (vm.itemObj.airId) {
				obj.airCode = vm.itemObj.airId.airCode;
			}
			if (vm.itemObj.agentSales) {
				obj.agentCode = vm.itemObj.agentSales.code;
			}
			return obj;
		}

		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 新增
		 */
		function add() {
			var addOfficialRuleDialog = $modal.open({
				template: require('./addOfficialRule.html'),
				controller: require('./addOfficialRule.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '新增正式运单规则',
							salesData: vm.salesData,
							airData: vm.airData,
							obj: {}
						};
					}
				}
			});
			addOfficialRuleDialog.result.then(function (data) {
				search();
			}, function (resp) {

			});
		}
		/**
		 *  编辑
		 */
		function edit(param) {
			var editOfficialRuleDialog = $modal.open({
				template: require('./addOfficialRule.html'),
				controller: require('./addOfficialRule.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '编辑正式运单规则：' + param.airCode,
							salesData: vm.salesData,
							airData: vm.airData,
							obj: param
						};
					}
				}
			});
			editOfficialRuleDialog.result.then(function (data) {
				search();
			}, function (resp) {

			});
		}
		/**
		 * 删除
		 */
		function remove(id, name) {
			var delDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '删除：' + name,
							content: '你将要删除正式运单规则：' + name + '。'
						};
					}
				}
			});
			delDialog.result.then(function () {
				$rootScope.loading = true;
				restAPI.officialRule.delList.save({}, {
					id: id
				})
					.$promise.then(function (resp) {
						if (resp.ok) {
							search();
							Notification.success({
								message: '删除正式运单规则成功'
							});
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
		 *  update保存选项
		 */
		function save() {
			// var error = verification();
			// if (error) {
			// 	Notification.error({
			// 		message: error
			// 	});
			// 	return false;
			// }
			var data = [],
				obj1 = angular.copy(vm.general.data1);
			data.push(obj1);
			$rootScope.loading = true;
			restAPI.systemSet.updateList.save({}, data)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '更新成功'
						});
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
	}
];

module.exports = angular.module('app.systemSet.officialRule', []).controller('officialRuleCtrl', officialRule_fn);