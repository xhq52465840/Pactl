'use strict';

var preEmailNotice_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
	function($scope, Page, restAPI, $modal, Notification, $rootScope) {
		var vm = $scope;
		vm.preNoticeData = {};
		vm.add = add;
		vm.edit = edit;
		vm.remove = remove;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.search = search;
		getStation();

		/**
		 * 获取货站
		 */
		function getStation() {
			$rootScope.loading = true;
			restAPI.cargoStation.queryAll.save({}, {})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.stationData = resp.data;
					sentEmail();
					search();
				});
		}
		/**
		 * 获取所有发件箱
		 */
		function sentEmail() {
			$rootScope.loading = true;
			restAPI.systemEmail.queryAllEmails.query({}, {})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.sentEmails = resp;
				});
		}
		/**
		 * 带条件的查询
		 */
		function search(showError) {
			$rootScope.loading = true;
			restAPI.PreNoticeEmail.queryPreNoticeEmail.save({}, {
				Address: vm.preNoticeData.Address,
				freightStation: vm.preNoticeData.freightStation ? vm.preNoticeData.freightStation.id : '',
				mailTheme: vm.preNoticeData.mailTheme,
				sendMail: vm.preNoticeData.sendMail ? vm.preNoticeData.sendMail.id : '',
				rows: vm.page.length,
				page: vm.page.currentPage
			}).$promise.then(function(resp) {
				$rootScope.loading = false;
				if (resp.total !== 0) {
					vm.noticeData = resp.rows;
				} else {
					vm.noticeData = [];
					if(showError) {
						Notification.warning({
							message: '没有查到符合条件的数据'
						});
					}
				}
			});
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
			var addPreNoticeDialog = $modal.open({
				template: require('./addPreNotice.html'),
				controller: require('./addPreNotice.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '新增预审邮件提醒',
							stationData: vm.stationData,
							sentEmails: vm.sentEmails,
							obj: {}
						};
					}
				}
			});
			addPreNoticeDialog.result.then(function(data) {
				search();
			}, function(resp) {

			});
		}
		/**
		 *  编辑
		 */
		function edit(param) {
			var editPreNoticeDialog = $modal.open({
				template: require('./addPreNotice.html'),
				controller: require('./addPreNotice.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '编辑预审邮件提醒：' + param.address,
							stationData: vm.stationData,
							sentEmails: vm.sentEmails,
							obj: param
						};
					}
				}
			});
			editPreNoticeDialog.result.then(function(data) {
				search();
			}, function(resp) {

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
					items: function() {
						return {
							title: '删除：' + name,
							content: '你将要删除预审邮件提醒：' + name + '。'
						};
					}
				}
			});
			delDialog.result.then(function() {
				$rootScope.loading = true;
				restAPI.PreNoticeEmail.delPreNoticeEmail.save({}, {
						id: id
					})
					.$promise.then(function(resp) {
						if (resp.ok) {
							search();
							Notification.success({
								message: '删除预审邮件提醒成功'
							});
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function() {

			});
		}
	}
];

module.exports = angular.module('app.systemSet.preEmailNotice', []).controller('preEmailNoticeCtrl', preEmailNotice_fn);