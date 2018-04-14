'use strict';

module.exports = ['$scope', 'restAPI', '$modalInstance', '$rootScope', '$modal', 'items', 'Download', 'Notification',
	function($scope, restAPI, $modalInstance, $rootScope, $modal, items, Download, Notification) {
		var vm = $scope;
		vm.title = items.title;
		var awId = items.awId;
		var itemFWB = {};
		vm.cancel = cancel;
		vm.openDialog = openDialog;
		vm.openDialog1 = openDialog1;
		vm.showMsg = showMsg;
		vm.historysData = [];
		vm.loading = false;
		vm.imgData = [];

		search();
		searchFWB();
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.waybill.historyRecords.save({}, {
					awId: awId
				})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						var data = resp.data;
						vm.historysData = [];
						angular.forEach(data, function (v, k) {
							//debugger
							var history = {};
							history.srcArr = [];
							var flag = false;
							angular.forEach(v, function (m, n) {
								history.fileHttpPath = m.fileHttpPath;
								history.type = m.type;
								if(!history.oldName) {
									history.oldName = m.oldName;
								}
								history.remark = m.remark;
								//debugger
								if(m.type==='货物申报' || m.type==='锂电池声明'){
									history.awId = m.referenceId;
									flag=true;
								}
								if (/[pP][dD][fF]/.test(m.suffix)) {
									history.pdfPath = m.fileHttpPath;
									history.uploadDate = m.uploadDate;
									history.oldName = m.oldName;
								} else if(/[jJ][pP][eE][gG]/.test(m.suffix)) {
									history.srcArr.push(m.fileHttpPath);
								} else if(/[pP][nN][gG]/.test(m.suffix)) {
									history.uploadDate = m.uploadDate;
									history.srcArr.push(m.fileHttpPath);
								} else if(/[jJ][pP][gG]/.test(m.suffix)) {
									history.uploadDate = m.uploadDate;
									history.srcArr.push(m.fileHttpPath);
								} else {
									history.uploadDate = m.uploadDate;
									history.fileId = m.fileId;
								}
							});
							if(history.srcArr.length>0) {
								history.showType = '0';
							} else {
								history.showType = '1';
							}
							if(flag){
								history.showType = '2';
							}
							vm.historysData.push(history);
						});
					} else {
						// Notification.error({
						// 	message: resp.msg
						// });
					}

				});
		}

		function searchFWB() {
			$rootScope.loading = true;
			restAPI.waybill.historyRecordsFWB.save({}, awId)
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						vm.historysDataFEB = resp.data;
						angular.forEach(vm.historysDataFEB, function(v, k) {
							if (v.rs === 'S') {
								v.isEmail = {};
								itemFWB.destination = '';
								itemFWB.destination = v.destination.split(',');
								angular.forEach(itemFWB.destination, function(v1, k1) {
									var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
									if (!reg.test(v1)) {
										v.isEmail = false;
									} else {
										v.isEmail = true;
									}
								})
							} else if (v.rs === 'R') {
								v.isEmail = {};
								itemFWB.origin = '';
								itemFWB.origin = v.origin.split(',');
								angular.forEach(itemFWB.origin, function(v1, k1) {
									var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
									if (!reg.test(v1)) {
										v.isEmail = false;
									} else {
										v.isEmail = true;
									}
								})
							}

						});
					} else {
						// Notification.error({
						// 	message: resp.msg
						// });
					}

				});
		}
		/**
		 * 显示pdf
		 */
		function openDialog(params) {
		
			var pdfDialog = $modal.open({
				template: require('../../../../../pactl/showPDF/showPDF.html'),
				controller: require('../../../../../pactl/showPDF/showPDF.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return params;
					}
				}
			});
			
		}
		/**
		 * 显示历史纪录
		 */
		function openDialog1(params) {
			if(params.row.type=="货物申报"){
				//debugger
				var pdfDialog = $modal.open({
					template: require('../../historydeclaraction/cargoDeclaraction.html'),
					controller: require('../../historydeclaraction/cargoDeclaraction.ctrl.js'),
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						items: function() {
							return {awId: params.row.awId};
						}
					}
				});					
			}
			if(params.row.type=="锂电池声明"){
				if(params.row.uploadDate>(new Date("2018/1/1 00:00:00")).getTime()){
					var pdfDialog = $modal.open({
						template: require('../../historydeclaraction/batteryDeclaraction2018.html'),
						controller: require('../../historydeclaraction/batteryDeclaraction2018.ctrl.js'),
						size: 'lg',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							items: function() {
								return {awId: params.row.awId};
							}
						}
					});
				}else{			
					var pdfDialog = $modal.open({
						template: require('../../historydeclaraction/batteryDeclaraction2017.html'),
						controller: require('../../historydeclaraction/batteryDeclaraction2017.ctrl.js'),
						size: 'lg',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							items: function() {
								return {awId: params.row.awId};
							}
						}
					});
				}
			}
		}
		/**
		 * 显示报文信息
		 */
		function showMsg(params) {
			var msgDialog = $modal.open({
				template: require('../../../../../pactl/agent/waybill/newBill/showMsg.html'),
				controller: require('../../../../../pactl/agent/waybill/newBill/showMsg.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '报文信息',
							content: params
						};
					}
				}
			});
			msgDialog.result.then(function() {

			}, function() {

			});
			//debugger
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}

	}
];