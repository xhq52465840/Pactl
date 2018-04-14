'use strict';
require('../bower_components/weui/weui.min.css');
module.exports = ['$scope', '$http', '$rootScope', '$filter',
	function($scope, $http, $rootScope, $filter) {
		'use strict';
		var vm = $scope;
		vm.barcodeData = {};
		vm.btn = {
			detail: false,
			showimg: false
		}

		vm.onlyEn = function() {
				vm.barcodeData.barcode = vm.barcodeData.barcode.replace(/[^a-zA-Z0-9]/g, '');
			}
			/**
			 * 根据运单号查询
			 */
		vm.search = function() {
			if (!vm.barcodeData.barcode) {
				alert('请输入内容后再操作！');
			} else {
				$http({
						url: 'api/wechat/wechat/waybill/agent/barCode',
						method: "POST",
						data: vm.barcodeData.barcode
					})
					.then(function(resp) {
							if (resp.data.ok) {
								vm.btn.detail = true;
								vm.btn.showimg = false;
								vm.outBarcode = resp.data.data.inBarCode;
								vm.barCode = 'data:image/jpeg;base64,' + resp.data.data.barCode;
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

		function judge() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			vm.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
			vm.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		}
		judge();

		// vm.showCol = function($e) {
		// 	angular.element($e.target).addClass('showCol2');
		// 	vm.btn.portrait = true;
		// 	vm.btn.landscape = false;
		// }


	}
];