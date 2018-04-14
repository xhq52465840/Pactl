'use strict';

module.exports = ['$scope', '$stateParams', 'printHtml', 'Notification','$modal',
	function ($scope, $stateParams, printHtml, Notification,$modal) {
		var vm = $scope;
		vm.idArr = [];
		vm.print = print;
		vm.awbType = $stateParams.type;
		vm.awbTypeName = {'A4':'A4运单打印',
			'FWB':'中性运单打印',
			'airLine':'航空公司运单打印'};
		vm.showPrintInstitution = showPrintInstitution;

		setData();

		function setData() {
			if ($stateParams.billNo) {
				try {
					vm.idArr = JSON.parse($stateParams.billNo);
				} catch (error) {
					Notification.error({
						message: '数据不正确'
					});
				}
			}
		}

		/**
		 * 货物申报
		 */
		function showPrintInstitution() {
			var printInstitutionDialog = $modal.open({
				template: require('./printInstitution.html'),
				controller: require('./printInstitution.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '查看打印设置说明'
						};
					}
				}
			});
			printInstitutionDialog.result.then(function () {
			});
		}

		var browser = {
			versions: function () {
				var u = navigator.userAgent, app = navigator.appVersion;
				console.log(u);
				return {//移动终端浏览器版本信息
					trident: u.indexOf('Trident') > -1, //IE内核
					presto: u.indexOf('Presto') > -1, //opera内核
					webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/)
					|| !!u.match(/AppleWebKit/), //是否为移动终端
					//ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
					iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, //是否iPad
					webApp: u.indexOf('Safari') == -1,//是否web应该程序，没有头部与底部
					google: u.indexOf('Chrome') > -1,
					weixin:u.match(/MicroMessenger/i)=="MicroMessenger"
				};
			}(),
			language: (navigator.browserLanguage || navigator.language).toLowerCase()
		};

		function nocontextmenu() {
			event.cancelBubble = true
			event.returnValue = false;
			return false;
		}
		function norightclick(e) {
			if (window.Event) {
				if (e.which == 2 || e.which == 3)
					return false;
			} else if (event.button == 2 || event.button == 3) {
				event.cancelBubble = true
				event.returnValue = false;
				return false;
			}
		}
		document.oncontextmenu = nocontextmenu; // for IE5+ 
		document.onmousedown = norightclick; // for all others 

		function print() {
			if(browser.versions.webKit) {
				window.print();
			} else {
				printHtml.print({
					top: '0',
					bottom: '0',
					left: '0',
					right: '0'
				});
			}
			// var LODOP = getLodop();
			// var strStyleCSS ='<link href="app.css" type="text/css" rel="stylesheet">';
			// var strFormHtml = strStyleCSS + '<body>' + angular.element('.fwb-print').html() + '</body>';
			// LODOP.PRINT_INIT('');
			// LODOP.SET_PRINTER_INDEX(-1);
			// // LODOP.SET_PRINT_PAGESIZE(1, 2160, 3050, '');
			// LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml);
			// LODOP.PREVIEW();
		}
	}
];