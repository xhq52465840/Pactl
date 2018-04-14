'use strict';
require('../bower_components/weui/weui.min.css');
module.exports = ['$scope', '$http', '$rootScope', '$filter', '$cookieStore',
	function($scope, $http, $rootScope, $filter, $cookieStore) {
		'use strict';
		var vm = $scope;
		var token = '';
		vm.single = {};
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

		function getUrlParam() {
			var stateParams = GetRequest();
			token = stateParams.token;
			token && $cookieStore.put('token', stateParams.token);
			if (stateParams.token) {
				token = stateParams.token;
				$cookieStore.put('token', stateParams.token);
			} else {
				token = $cookieStore.get('token');
				vm.single.waybillNo = stateParams.waybillNo;
				vm.search(vm.single.waybillNo);
			}
		}

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
					vm.single.waybillNo = +splitData[1];
					vm.search(splitData[1]);
				}
			});
		}

		/**
		 * 根据运单号查询
		 */
		vm.search = function(param) {
			$http({
					url: '/api/wechat/wechat/waybill/airline/waybillInfo/' + token,
					method: "POST",
					data: {
						waybillNo: param
					}
				})
				.then(function(resp) {
						if (resp.data.ok) {
							vm.btn.detail = true;
							vm.btn.showimg = false;
							vm.single.localCheck = resp.data.data.localCheck;
							vm.single.subWayBill = resp.data.data.subWayBill;
							vm.single.waybillStatus = resp.data.data.waybillStatus;
							vm.single.waybillInfo = resp.data.data.waybillInfo;
							vm.barCode = 'data:image/jpeg;base64,' + resp.data.data.waybillInfo.barCode;
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
		getUrlParam();
		setConf();

	}
];