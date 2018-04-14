'use strict';

var stampTypes_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
	function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
		var vm = $scope;
		vm.add = add;
		vm.edit = edit;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.remove = remove;
		vm.search = search;
		vm.stampData = [];
		vm.stamp = {};


		search();
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			var obj = getCondition();
			restAPI.stamp.queryListPage.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.stampData = resp.rows;
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
				name: vm.stamp.name ? vm.stamp.name : ''
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
		 * 新增安检章类型
		 */
		function add() {
			var addStampDialog = $modal.open({
				template: require('./addStamp.html'),
				controller: require('./addStamp.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '添加安检章类型',
							obj: {}
						};
					}
				}
			});
			addStampDialog.result.then(function (data) {
				var obj = {};
				obj.name = data.name;
				obj.remark = data.remark;
				$rootScope.loading = true;
				restAPI.stamp.addStamp.save({}, obj)
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
		 * 编辑安检章类型
		 */
		function edit(params) {
			var ediStampDialog = $modal.open({
				template: require('./addStamp.html'),
				controller: require('./addStamp.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '编辑安检章类型：' + params.name,
							obj: {
								name: params.name,
								remark: params.remark,
							}
						};
					}
				}
			});
			ediStampDialog.result.then(function (data) {
				var obj = {};
				obj.id = params.id;
				obj.name = data.name;
				obj.remark = data.remark;
				$rootScope.loading = true;
				restAPI.stamp.updateStampType.save({}, obj)
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
		 * 删除安检章类型
		 */
		function remove(id, name) {
			var delContingentDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '删除安检章类型：' + name,
							content: '你将要删除安检章类型' + name + '。此操作不能恢复。'
						};
					}
				}
			});
			delContingentDialog.result.then(function () {
				$rootScope.loading = true;
				restAPI.stamp.delStampType.save({}, {
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
	}
];

module.exports = angular.module('app.securityOption.stampTypes', []).controller('stampTypesCtrl', stampTypes_fn);