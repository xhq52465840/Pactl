'use strict';

var detailInfo_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams',
	function($scope, Page, restAPI, $modal, Notification, $rootScope, $stateParams) {
		var vm = $scope;
		var id = '';
		vm.add = add;
		vm.edit = edit;
		vm.page = Page.initPage();
		vm.pageChanged = pageChanged;
		vm.info = {};
		vm.remove = remove;
		vm.stationData = [];
		vm.save = save;

		check();
		/**
		 * 校验unitid是否存在，防止用户直接url进来
		 */
		function check() {
			id = $stateParams.id;
			if (id) {
				vm.info.id = id;
				getStation();
				searchStamps();
			} else {
				$state.go('securityOption.contingent');
			}
		}

		/**
		 * 获取货站
		 */
		function getStation() {
			$rootScope.loading = true;
			restAPI.cargoStation.queryAll.save({}, {})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.stationData = resp.data;
					searchById();
				});
		}
		/**
		 * 查询安检章
		 */
		function searchById() {
			$rootScope.loading = true;
			restAPI.contingent.queryById.save({}, {
				id: id
			}).$promise.then(function(resp) {
				$rootScope.loading = false;
				vm.info = resp.data;
				setData();
			});
		}
		/**
		 * 显示数据
		 */
		function setData() {
			if (vm.info.id) {
				vm.info.unitid = vm.info.unitid;
				vm.info.name = vm.info.name;
				vm.info.remark = vm.info.remark;
				if (vm.info.ctid) {
					for (var index = 0; index < vm.stationData.length; index++) {
						var element = vm.stationData[index];
						if (element.id === vm.info.ctid) {
							vm.info.ctid = element;
							break;
						}
					}
				}
			}
		}
		/**
		 *  保存
		 */
		function save() {
			$rootScope.loading = true;
			var obj = getSaveData();
			restAPI.contingent.updateContingent.save({}, obj)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.equipmentData = resp.rows;
				});
		}
		/**
		 * 获取保存数据
		 */
		function getSaveData() {
			var obj = {
				id: id, //分队ID  not null
				unitid: vm.info.unitid, //分队编号  not null
				name: vm.info.name, //分队名称 not null
				ctid: vm.info.ctid ? vm.info.ctid.id : '', //货站Id  not null
				remark: vm.info.remark,
				eMail: vm.info.eMail
			};
			return obj;
		}
		/**
		 * 根据分队ID查询安检章信息。
		 */
		function searchStamps() {
			$rootScope.loading = true;
			restAPI.contingent.queryStamps.save({}, {
				unitid: id,
				rows: vm.page.length,
				page: vm.page.currentPage
			}).$promise.then(function(resp) {
				$rootScope.loading = false;
				vm.infoData = resp.rows;
				Page.setPage(vm.page, resp);
			});
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * 新增安检章
		 */
		function add() {
			var addStampDialog = $modal.open({
				template: require('./addStampDialog.html'),
				controller: require('./addStampDialog.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '新增安检章',
							obj: {}
						};
					}
				}
			});
			addStampDialog.result.then(function(data) {
				$rootScope.loading = true;
				var obj = getAddData(data);
				restAPI.stamp.addStamps.save({}, obj)
					.$promise.then(function(resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							searchStamps();
							Notification.success({
								message: '新增安检章成功'
							});
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function(resp) {

			});
		}
		/**
		 * 新增安检章需要添加的数据
		 */
		function getAddData(data) {
			var obj = {};
			obj.unitid = id;
			obj.type = data.type.name;
			if (data.fileObj1 && data.fileObj1.id) {
				obj.normalstamp = data.fileObj1.id;
			}
			if (data.fileObj2 && data.fileObj2.id) {
				obj.logoutstamp = data.fileObj2.id;
			}
			return obj;
		}
		/**
		 * 编辑安检章
		 */
		function edit(params) {
			var editStampDialog = $modal.open({
				template: require('./addStampDialog.html'),
				controller: require('./addStampDialog.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '编辑安检章：' + params.type,
							obj: {
								unitid: id,
								type: params.type ? params.type : '',
								fileObj1: params.normalStampFiles && params.normalStampFiles.length>0 && params.normalStampFiles[0].fileHttpPath ? params.normalStampFiles[0].fileHttpPath : '',
								fileObj2: params.logoutStampFiles && params.logoutStampFiles.length>0 && params.logoutStampFiles[0].fileHttpPath ? params.logoutStampFiles[0].fileHttpPath : '',
							}
						};
					}
				}
			});
			editStampDialog.result.then(function(data) {
				var obj = getAddData(data);
				obj.id = params.id;
				// obj.unitid = id;
				// obj.type = data.type ? data.type.name : '';
				// obj.normalstamp = data.normalstamp;
				// obj.logoutstamp = data.logoutstamp;
				$rootScope.loading = true;
				restAPI.stamp.updateStamp.save({}, obj)
					.$promise.then(function(resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							searchStamps();
							Notification.success({
								message: '编辑安检章成功'
							});
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function(resp) {

			});
		}
		/**
		 * 删除
		 */
		function remove(id) {
			var delContingentDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '删除安检章',
							content: '你将要删除安检章,此操作不能恢复。'
						};
					}
				}
			});
			delContingentDialog.result.then(function() {
				$rootScope.loading = true;
				restAPI.stamp.delStamp.save({}, {
					id: id
				}).$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						searchStamps();
						Notification.success({
							message: '删除安检章成功'
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

module.exports = angular.module('app.securityOption.detailInfo', []).controller('detailInfoCtrl', detailInfo_fn);