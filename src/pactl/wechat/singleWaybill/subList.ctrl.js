'use strict';
require('../bower_components/weui/weui.min.css');
module.exports = ['$scope', '$http', '$rootScope', '$filter', '$cookieStore',
	function($scope, $http, $rootScope, $filter, $cookieStore) {
		'use strict';
		var vm = $scope;
		var waybillNo = '';
		vm.subListMainData = {};
		vm.subListSubData = [];
		vm.check = {
			subListMainData: true
		}
		vm.btn = {
			detail: false,
			showimg: false
		}

		// 获取url里的参数
		function GetRequest() {
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				var strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			};
			return theRequest;
		};
		var stateParams = GetRequest();

		/**
		 * 分单
		 */
		function subList() {
			$http({
					url: '/api/wechat/wechat/waybill/agent/books/' + $cookieStore.get('token'),
					method: "POST",
					data: {
						waybillNo: stateParams.waybillNo
					}
				})
				.then(function(resp) {
						if (resp.data.ok) {
							var data = resp.data.data;
							var tempList = [];
							vm.btn.detail = true;
							vm.btn.showimg = false;
							vm.subListMainData = data[0]; //主单
							angular.forEach(vm.subListMainData.bookWithFileList, function(m, n) {
								m.exceptPdf = [];
								angular.forEach(m.fileIdList, function(v1, k1) {
									if (v1.indexOf('jpeg') > 0) {
										m.exceptPdf.push(v1);
									}
								});
								m.exceptPdf = JSON.stringify(m.exceptPdf);
							})
							// 分单
							for (var i = 1; i < data.length; i++) {
								var subData = data[i],
									fileList = subData.bookWithFileList;
								subData.check = true;
								for (var j = 0; j < fileList.length; j++) {
									if (fileList[j].book.reBook !== '1') {
										subData.check = false;
										break;
									}
								}
								tempList.push(subData);
							}
							vm.subListSubData = tempList;
							angular.forEach($scope.subListSubData, function(v, k) {
								angular.forEach(v.bookWithFileList, function(v1, k1) {
									v1.exceptPdf = [];
									angular.forEach(v1.fileIdList, function(v2, k2) {
										if (v2.indexOf('jpeg') > 0) {
											v1.exceptPdf.push(v2);
										}
									});
									v1.exceptPdf = JSON.stringify(v1.exceptPdf);
								});
							});
						} else {
							alert(resp.data.msg);
							vm.btn.detail = false;
							vm.btn.showimg = true;
						}
					},
					function(resp) {
						// failed
						alert("请求失败！");
					});
		}
		subList();
	}
];