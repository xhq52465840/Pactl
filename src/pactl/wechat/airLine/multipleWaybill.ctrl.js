'use strict';
require('../bower_components/weui/weui.min.css');
var wx = require('../bower_components/jweixin-1.0.0.js');
module.exports = ['$scope', '$http', '$rootScope', '$filter', '$cookieStore',
	function($scope, $http, $rootScope, $filter, $cookieStore) {
		'use strict';
		var vm = $scope;
		var token = '';
		vm.multiple = {};
		//默认选择明天的日期
		vm.multiple.fltDate = $filter('date')(new Date().getTime() + 86400000, 'yyyy-MM-dd');
		vm.btn = {
			detail: false,
			showimg: false
		}
		vm.totalObj = {
			grossWeight: 0,
			totalCount: 0
		};
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
		$cookieStore.put('token', stateParams.token);

		/**
		 * 获取航空公司
		 */
		var getAircode = function() {
			$http({
					url: 'api/wechat/wechat/waybill/airline/getAirline/' + stateParams.token,
					method: "GET"
				})
				.then(function(resp) {
						if (resp.data.ok) {
							vm.airCode = resp.data.data.agentSales;
						} else {
							alert(resp.data.msg);
						}
					},
					function(resp) {
						// failed
						alert("请求失败！");
					});
		};
		getAircode();
		/**
		 * 获取所有的销售代理
		 */
		// var getSalesData = function() {
		// 	$http({
		// 			url: 'api/wechat/wechat/waybill/airline/getAgent/' + stateParams.token,
		// 			method: "GET"
		// 		})
		// 		.then(function(resp) {
		// 				if (resp.data.ok) {
		// 					vm.salesData = resp.data.data;
		// 				} else {
		// 					alert(resp.data.msg);
		// 				}
		// 			},
		// 			function(resp) {
		// 				// failed
		// 				alert("请求失败！");
		// 			});
		// };
		// getSalesData();
		/**
		 * 查询
		 */
		vm.search = function() {
			$http({
					url: 'api/wechat/wechat/waybill/airline/waybillInfoList/' + stateParams.token,
					method: "POST",
					data: {
						flightNo: vm.multiple.flightNo,
						fltDate: vm.multiple.fltDate,
						agentSalesId: vm.multiple.agentSalesId ? vm.multiple.agentSalesId : ''
					}
				})
				.then(function(resp) {
						if (resp.data.ok) {
							vm.btn.detail = true;
							vm.btn.showimg = false;
							vm.totalObj.grossWeight = 0;
							vm.totalObj.totalCount = 0;
							vm.multiple.multipleData = resp.data.data;
							angular.forEach(vm.multiple.multipleData, function(v, k) {
								vm.totalObj.grossWeight += v.grossWeight || 0;
								vm.totalObj.totalCount += v.totalCount || 0;
							})
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
		vm.reset = function() {
			vm.multiple.flightNo = '';
			vm.multiple.fltDate = $filter('date')(new Date().getTime() + 86400000, 'yyyy-MM-dd');
			vm.multiple.agentSalesId = '';
			vm.btn.detail = false;
		}

	}
];