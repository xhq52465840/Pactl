'use strict';
require('../bower_components/weui/weui.min.css');
module.exports = ['$scope', '$http', '$rootScope', '$filter', '$cookieStore',
	function($scope, $http, $rootScope, $filter, $cookieStore) {
		'use strict';
		var vm = $scope;
		var token = '';
		vm.cargo = {};
		vm.btn = {
			detail: false,
			showimg: false
		}
		vm.totalObj = {
			grossWeight: 0,
			totalCount: 0
		};

		setConf();

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

		function setConf() {
			$http({
					url: '/api/wechat/wechat/js/config/',
					method: "POST",
					data: window.encodeURIComponent(window.location.href.split('#')[0])
				})
				.then(function(resp) {
					if (resp.data) {
						wx.config({
							debug: false,
							appId: resp.data.appid,
							timestamp: resp.data.timestamp,
							nonceStr: resp.data.nonceStr,
							signature: resp.data.signature,
							jsApiList: ['scanQRCode']
						});
					} else {
						alert("扫描请求失败！");
					}
				}, function(resp) {
					alert("请求失败！");
				});
		}
		/**
		 * 调用摄像头
		 */
		vm.scanQRCode = function() {
			wx.scanQRCode({
				needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success: function(res) {
					var splitData = res.resultStr.split(",");
					vm.cargo.truckBill = +splitData[1];
					vm.search(splitData[1]);
				}
			});
		}

		vm.onlyEn = function() {
				vm.cargo.truckBill = vm.cargo.truckBill.replace(/[^a-zA-Z0-9]/g, '');
			}
			/**
			 * 根据运单号查询
			 */
		vm.search = function(param) {
			if (!param) {
				alert("运单号不能为空")
			} else {
				$http({
						url: 'api/wechat/wechat/waybill/agent/truck/' + stateParams.token,
						method: "POST",
						data: {
							truckBill: param
						}
					})
					.then(function(resp) {
							if (resp.data.ok) {
								vm.btn.detail = true;
								vm.btn.showimg = false;
								vm.totalObj.grossWeight = 0;
								vm.totalObj.totalCount = 0;
								vm.cargo.simpleInfoVoList = resp.data.data.simpleInfoVoList;
								angular.forEach(vm.cargo.simpleInfoVoList, function(v, k) {
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
		}


	}
];