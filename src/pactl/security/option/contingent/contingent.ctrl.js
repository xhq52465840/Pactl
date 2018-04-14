'use strict';

var contingent_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
	function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
		var vm = $scope;
		vm.add = add;
		vm.del = del;
		vm.edit = edit;
		vm.contingent = {};
		vm.equipmentData = [];
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.search = search;
		vm.stationData = [];
		vm.ableSatatus = ableSatatus;

		getStation();

		/**
		 * 获取货站
		 */
		function getStation() {
			$rootScope.loading = true;
			restAPI.cargoStation.queryAll.save({}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.stationData = resp.data;
					search();
				});
		}
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.contingent.queryList.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.equipmentData = resp.rows;
					Page.setPage(vm.page, resp);
				});
		}
		/**
		 * 获取查询条件
		 */
		function getCondition() {
			var obj = {
				rows: vm.page.length,
				page: vm.page.currentPage,
				unitid: vm.contingent.unitid ? vm.contingent.unitid : '', //分队编号
				name: vm.contingent.name ? vm.contingent.name : '', //分队名称
				ctid: vm.contingent.ctid ? vm.contingent.ctid.id : '' //货站Id
			};
			return obj;
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 新增分队信息
		 */
		function add() {
			var addContingentDialog = $modal.open({
				template: require('./addContingent.html'),
				controller: require('./addContingent.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '添加分队信息',
							stationData: vm.stationData,
							obj: {}
						};
					}
				}
			});
			addContingentDialog.result.then(function (data) {
				var obj = {};
				obj.unitid = data.unitid;
				obj.name = data.name;
				obj.ctid = data.ctid.id;
				obj.remark = data.remark;
				obj.eMail = data.eMail;
				$rootScope.loading = true;
				restAPI.contingent.addContingent.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							search();
							Notification.success({
								message: '添加分队信息成功'
							});
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * 编辑
		 */
		function edit(params) {
			var editContingentDialog = $modal.open({
				template: require('./addContingent.html'),
				controller: require('./addContingent.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '编辑分队信息：' + params.name,
							stationData: vm.stationData,
							obj: {
								id: params.id,
								unitid: params.unitid,
								name: params.name,
								ctid: params.ctid,
								remark: params.remark,
								status: params.status,
								eMail: params.eMail
							}
						};
					}
				}
			});
			editContingentDialog.result.then(function (data) {
				var obj = {};
				obj.id = data.id;
				obj.unitid = data.unitid;
				obj.name = data.name;
				obj.ctid = data.ctid.id;
				obj.remark = data.remark;
				obj.status = data.status;
				obj.eMail = data.eMail;
				$rootScope.loading = true;
				restAPI.contingent.updateContingent.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							search();
							Notification.success({
								message: '编辑分队信息成功'
							});
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * 删除
		 */
		function del(id, name) {
			var delContingentDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '删除分队信息：' + name,
							content: '你将要删除分队信息' + name + '。此操作不能恢复。'
						};
					}
				}
			});
			delContingentDialog.result.then(function () {
				$rootScope.loading = true;
				restAPI.contingent.delContingent.save({}, {
					id: id
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						search();
						Notification.success({
							message: '删除设备成功'
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
		 * 启用/禁用
		 * 
		 */
		function ableSatatus(id, status) {
			restAPI.contingent.updateStatus.save({}, {
				id: id,
				status: status
			})
				.$promise.then(function (resp) {
					if (resp.ok) {
						search();
						Notification.success({
							message: '操作成功'
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

module.exports = angular.module('app.securityOption.contingent', []).controller('contingentCtrl', contingent_fn);