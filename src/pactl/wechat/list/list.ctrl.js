'use strict';
require('../bower_components/weui/weui.min.css');
module.exports = ['$scope', '$http', '$timeout', '$window',
	function($scope, $http, $timeout, $window) {
		var alId = '';
		var selectedItem = [];
		var selectedItemIds = [];
		var firstInit = true;
		var searchCondition;
		$scope.displayDialog = {
			loadBusy: false, //是否请求数据
			hasBarcode: false, //弹框二维码 
			hasNoagent: false, //弹框内的下拉机构
			noMoreData: false,
			lables: false,
			dataList: false
		}
		var pageInit = {
			page: 1,
			rows: 10
		};
		$scope.bindingData = {};

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
		// stateParams.token = "oyX8puPJXWHxUbR_wWnZq8w0Lx94";// 90：陈水斌的token
		// stateParams.token = "oQkpcv9ejXRgdu7BySOObyxdQ2Q0"; //:889：我的token
		var returnValue = "";
		var init = function() {
			getUnits(isUnit); // 查询是否有默认机构
		};
		// 查询是否有默认机构
		var isUnit = function() {
			$http.get("api/wechat/wechat/agent/getDefault/" + stateParams.token).then(function(resp) {
				if (resp.data.success) {
					if (resp.data.agentId) {
						$scope.displayDialog.hasNoagent = false;
						for (var i = 0; i < $scope.agentList.length; i++) {
							if ($scope.agentList[i].id == resp.data.agentId) {
								$scope.agentTitle = $scope.agentList[i];
								getCurUnitsAll();
							}
						}
					} else {
						// 没有值时弹窗
						$scope.displayDialog.hasNoagent = true;
					}
				} else {
					alert('您未绑定代理用户，请进入账号管理中进行代理用户绑定！');
					wx.closeWindow();
				}
			}, function(err) {});
		};
		// 获取当前机构所有列表
		var getCurUnitsAll = function(callback) {
			$http.get("api/wechat/wechat/certificate/agentlabellist/" + stateParams.token).then(function(resp) {
				$scope.agentLabel = resp.data.data;
				callback && callback();
			}, function(err) {});
		};
		// 查询所有的标签列表
		var getAgentlabelList = function() {
			$http.get("api/wechat/wechat/certificate/agentlabellist/" + stateParams.token).then(function(resp) {
				if (resp.data.data) {
					if (resp.data.data.length > 0) {
						var tempList = [];
						tempList.push({
							name: '不限'
						});
						for (var i = 0; i < resp.data.data.length; i++) {
							tempList.push(resp.data.data[i]);
						};
						$scope.agentLabel = tempList;
					};
				}
			}, function(err) {
				alert('标签加载失败');
			});
		};
		$scope.agentTitle = {}; //顶部的下拉机构
		$scope.searchListData = []; //表单数据
		$scope.agentLabel = []; //标签数据
		// 没有默认的机构时，弹框，下拉选中机构
		$scope.selectAgentInit = function() {
			$http.get("api/wechat/wechat/agent/updateDefault/" + stateParams.token + "?agentId=" + $scope.agentId).then(function(resp) {
				if (resp.data.success) {
					$scope.displayDialog.hasNoagent = false;
					isUnit();
				}
			}, function(err) {});
		};
		// 选中弹窗中某个机构时，重新请求默认的标签
		$scope.selectAgent = function(params) {
			$http.get("api/wechat/wechat/agent/updateDefault/" + stateParams.token + "?agentId=" + params.id).then(function(resp) {
				if (resp.data.success) {
					$scope.displayDialog.hasNoagent = false;
					$scope.selectedItems = [];
					selectedItem = [];
					selectedItemIds = []
					$scope.bookNo = '';
					getAgentlabelList();
				}
			}, function(err) {});
		};
		/**
		 * 查询代理的所有机构（初始化页面调用）
		 */
		function getUnits(callback) {
			$http.get("api/wechat/wechat/agent/listMyUnits/" + stateParams.token).then(function(resp) {
				$scope.agentList = resp.data.units;
				callback && callback();
			}, function(err) {});
		};

		function getAlid() {
			var arr = [];
			angular.forEach(selectedItem, function(v, k) {
				arr.push(v.id);
			});
			return arr.join(';');
		}
		//滚动查询列表
		$scope.scrollList = function() {
			var bookNo = $scope.bookNo,
				alId = getAlid(),
				condition;
			if (!alId && !bookNo) {
				if (firstInit) {
					firstInit = false;
					return;
				}
				alert('查询条件:标签和证书编号二选一');
				$scope.displayDialog.dataList = false;
				return;
			}

			condition = {
				accreditFlag: "107", //证书状态(固定值，必选)
				alId: getAlid(), //标签id（可选项）
				bookNo: $scope.bookNo //证书编号（必选）
			};
			//条件相同的也要查询
			// if (angular.equals(condition, searchCondition)) {
			// 	return;
			// } else {
			$scope.displayDialog.loadBusy = true;
			$scope.displayDialog.noMoreData = false;
			$scope.displayDialog.dataList = true;
			$scope.searchListData = [];
			pageInit = {
				page: 1,
				rows: 10
			};
			// }
			$http.post("api/wechat/wechat/certificate/queryList/" + stateParams.token, angular.extend({},
				condition, pageInit)).then(function(resp) {
				$scope.displayDialog.loadBusy = false;
				searchCondition = condition;
				if (resp.data.success) {
					if (!resp.data.data) {
						$scope.displayDialog.noMoreData = true;
					} else {
						pageInit.page++;
						$scope.searchListData = resp.data.data;
						angular.forEach($scope.searchListData, function(v, k) {
							v.exceptPdf = [];
							angular.forEach(v.pFileRelations, function(v1, k1) {
								if (!/[pP][dD][fF]/.test(v1.suffix)) {
									v.exceptPdf.push(v1.fileHttpPath);
								}
							})
							v.exceptPdf = JSON.stringify(v.exceptPdf);
						});
					}
				} else {
					$scope.displayDialog.noMoreData = true;
				}
			}, function(err) {
				alert('获取列表数据失败，请重试.');
			});
		}
		$scope.watchPDF = function(param) {
			window.location.href = param.fileHttpPath;

		};
		//获取二维码
		$scope.watchCode = function(pOfficeInfo, pAgentShareBook) {
			$http.get("api/wechat/wechat/certificate/getBarCode/" + pAgentShareBook.bookNo).then(function(resp) {
				if (resp.data.success) {
					$scope.displayDialog.hasBarcode = true;
					$scope.barCode = 'data:image/jpeg;base64,' + resp.data.data;
					$scope.pOfficeInfo = pOfficeInfo;
					$scope.pAgentShareBook = pAgentShareBook; //货物类型,锂用红色，其他用绿色
				}
			}, function(err) {});
		};
		//关闭弹出框
		$scope.cancel = function() {
			$scope.displayDialog.hasBarcode = false;
			$scope.displayDialog.hasNoagent = false;
			$scope.labelObj.showLabel = false;
		}
		$scope.paused = function() {
			return $scope.displayDialog.loadBusy || $scope.displayDialog.noMoreData;
		}
		$scope.labelObj = {
			showLabel: false
		}
		$scope.focusInput = function() {
				$scope.labelObj.showLabel = true;
			}
			/**
			 * 弹框界面，默认选中样式,选择标签
			 */
		$scope.select = function(data) {
			data.checked = !data.checked;
			if (data.checked) {
				data.bgk = {
					'background-color': data.style,
					'color': '#fff'
				};
				selectedItem.push({
					id: data.id,
					name: data.name,
					style: data.style
				});
				selectedItemIds.push(data.id);
			} else {
				data.bgk = {
					'color': data.style,
					'background-color': '#fff'
				};
				var index = selectedItemIds.indexOf(data.id);
				selectedItem.splice(index, 1);
				selectedItemIds.splice(index, 1);
			}
		}
		$scope.ok = function(data) {
			$scope.selectedItems = angular.copy(selectedItem);
			$scope.labelObj.showLabel = false;
		}
		init();
	}
];