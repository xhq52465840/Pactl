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
			showimg : false
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
		// stateParams.token = "oyX8puPJXWHxUbR_wWnZq8w0Lx94";

		/**
		 * 分单
		 */
		function subList() {
			$http({
					url: '/api/wechat/wechat/waybill/airline/books/' +  $cookieStore.get('token'),
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
							vm.subListMainData = data[0];
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
							$scope.subListSubData = tempList;
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
		/**
		 * 查看证书PDF
		 */
		vm.watchPDF = function(param) {
			window.location.href = param;
		};


	}
];