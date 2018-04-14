'use strict';

var reply_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$state', '$stateParams', 'Download', '$rootScope',
	function($scope, restAPI, $modal, Notification, $state, $stateParams, Download, $rootScope) {
		var vm = $scope;
		var goodsId = '';
		var selected = [];
		var selectedItem = [];
		vm.afterforbid = false;
		vm.afterenabled = true;
		vm.getAirPortData = getAirPortData;
		vm.confirm = confirm;
		vm.disableBtn = disableBtn;
		vm.downloadFile = downloadFile;
		// vm.search_historys = search_historys;
		vm.enabled = enabled;
		vm.forbid = forbid;
		vm.history = '';
		vm.opHis = opHis;
		vm.productExplain = productExplain;
		vm.refer = {};
		vm.removeFile = removeFile;
		vm.select = select;
		vm.scrollBottom = scrollBottom;
		vm.selectNoCert = false;
		vm.sent = sent;
		vm.btn = {
			close1: false,
			close2: false
		};
		check();

		/**
		 * 检测id
		 */
		function check() {
			goodsId = $stateParams.goodsId;
			if (goodsId) {
				vm.refer.goodsId = goodsId;
				getStatus();
			} else {
				$state.go('pactlAssist.nameAdvice');
			}
		}
		/**
		 * 获取状态
		 */
		function getStatus() {
			$rootScope.loading = true;
			restAPI.baseData.queryAll.save({}, {
					type: '1476067968303634'
				})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.statusData = resp.rows;
					searchGoodId();
				});
		}
		/**
		 * 获取查询条件
		 */
		function getCertData(data) {
			restAPI.pactlAdvice.editAdviceSet.save({}, {
					"namesEn": data,
					"ngoodsId": $stateParams.goodsId
				})
				.$promise.then(function(resp) {
					vm.history = resp.rows || [];
					angular.forEach(vm.history, function(v, k) {
						if (v.pGoodsAdvice.airLines) {
							var airLine = v.pGoodsAdvice.airLines.split(';');
							v.pGoodsAdvice.airLines = airLine[0] + ' ' + airLine[1] + ' ' + airLine[2];
						};
					});
				});
		}
		/**
		 * 点击历史记录时再去查询数据，防止用户操作后，拿到的还是旧的数据
		 */
		function search_historys(data) {
			$rootScope.loading = true;
			restAPI.goodsId.historys.save({}, {
					"sourceKey": goodsId,
					"model": ' PACTLGOODSHIS'
				})
				.$promise.then(function(resp) {
					vm.historys = resp.rows;
					$rootScope.loading = false;
					if (data == 'opHis') {
						openHistorys();
					}
				});
		};
		/**
		 * 打开历史
		 */
		function openHistorys() {
			var delDialog = $modal.open({
				template: require('./opHistory.html'),
				controller: require('./opHistory.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '操作历史',
							historys: vm.historys
						};
					}
				}
			});
		};
		/**
		 * 操作历史点击事件
		 */
		function opHis() {
			// 点击操作历史时去请求历史记录
			search_historys('opHis');
		};
		/**
		 * 获取数据
		 */
		function searchGoodId() {
			search_historys();
			$rootScope.loading = true;
			restAPI.goodsId.goodsIdSet.save({}, {
					goodsId: goodsId
				})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						if (resp.data.pGoodsAdvice.productDesc) {
							var val = JSON.parse(resp.data.pGoodsAdvice.productDesc);
							if (val === '') {
								vm.productDesc = false;
							} else {
								vm.productDesc = true;
							}
						}
						setLeftData(resp)
						setRightData(resp);
						getAirPortData(resp);
					} else {
						Notification.error({
							message: '查询异常:' + resp.msg
						});
						$state.go('pactlAssist.nameAdvice');
					}
				});
		}
		/**
		 * 根据id获取货代信息
		 */
		function getUnitById(id) {
			restAPI.operAgent.agentDetail.get({
					id: id
				})
				.$promise.then(function(resp) {
					vm.agentSalesEnname = resp.ename;
				});
		}
		/**
		 * 显示左边数据
		 */
		function setLeftData(resp) {
			var data = resp.data.pGoodsAdvice,
				files = resp.data.fileRelation;
			vm.refer.status = data.status;
			vm.agentSales = resp.data.pGoodsAdvice.agentSales
			getUnitById(vm.agentSales)
			showStausColor(data);
			var airLine = data.airLines.split(';');
			vm.refer.airLines = airLine[0] + ' ' + airLine[1] + ' ' + airLine[2];
			vm.refer.dest = data.dest;
			vm.refer.namesEn = data.namesEn;
			vm.refer.namesCn = data.namesCn;
			getCertData(data.namesEn);
			for (var i = 0; i < files.length; i++) {
				if (files[i].type == 'type') {
					vm.refer.remoteFiles = {
						newName: files[i].oldName,
						id: files[i].fileId,
					}
				} else {
					vm.refer.remoteFiles1 = {
						newName: files[i].oldName,
						id: files[i].fileId,
					}
				}
			}
			vm.results = data.result ? JSON.parse(data.result) : [];
			resultType(data.result);
			if (data.status === '103' || data.status === '104') {
				vm.btn.close1 = vm.refer.remoteFiles;
				vm.btn.close2 = vm.refer.remoteFiles1;
			} else {
				vm.btn.close1 = false;
				vm.btn.close2 = false;
			}
		}
		/**
		 * 获取机场数据
		 */
		function getAirPortData(code) {
			restAPI.airPort.queryList.save({}, {
					airportCode: vm.refer.dest
				})
				.$promise.then(function(resp) {
					vm.airPortData = resp.rows[0];
				});
		}
		/**
		 * 显示状态颜色
		 */
		function showStausColor(data) {
			if (data.status === '103') {
				vm.ask = true;
			}
			if (data.status === '104') {
				vm.answer = true;
			}
			if (data.status === '105') {
				vm.quotable = true;
			}
			if (data.status === '106') {
				vm.forbidden = true;
			}
		}
		/**
		 * 获取结论类型
		 */
		function resultType(item) {
			selected = [];
			selectedItem = [];
			var item = item ? JSON.parse(item) : [];
			restAPI.baseData.queryAll.save({}, {
					"type": "1476096570708556"
				})
				.$promise.then(function(resp) {
					var data = resp.rows,
						len = data.length;
					for (var i = 0; i < len; i++) {
						var id = data[i].id,
							dataObj = data[i];
						if (id === '101') {
							dataObj.condition = true;
						}
						if (id === '102') {
							dataObj.backletter = true;
							dataObj.name = '在品名补充中需详细描述';
						}
						if (id === '103') {
							dataObj.other = true;
						}
						if (id === '104') {
							dataObj.unpack = true;
						}
						if (id === '105') {
							dataObj.dangerous = true;
						}
						if (id === '106') {
							dataObj.needless = true;
						}
						if (id === 'all') {
							dataObj.other = true;
						}
						for (var j = 0; j < item.length; j++) {
							var itemId = item[j].id,
								itemName = item[j].name;
							if (itemId === 'all') {
								vm.refer.other = itemName;
							}
							if (itemId === id) {
								if (id === '106') {
									vm.selectNoCert = true;
								}
								selected.push(itemId);
								selectedItem.push({
									id: itemId,
									name: itemName
								});
								dataObj.checked = true;
							}
						}
					}
					vm.resultTypes = data;
				})
		}
		/**
		 * 显示右边数据
		 */
		function setRightData(resp) {
			var records = resp.data.pGoodsKnowsAnswers,
				data = [],
				j = 0,
				index = false;
			for (var i = 0; i < records.length; i++) {
				if (records[i].contents) {
					data[j] = data[j] || [];
				}
				if (records[i].type === '1') {
					if (index) {
						j++;
						data[j] = [];
						index = false;
					}
					data[j] && data[j].push(records[i]);
				} else {
					if (!index) {
						index = true;
					}
					data[j] && data[j].push(records[i]);
				}
			}
			vm.records = data;
		}
		/**
		 * 选择结论
		 */
		function select(data) {
			vm.selectNoCert = false;
			data.checked = !data.checked;
			if (data.id === '106') {
				selected = [];
				selectedItem = [];
				if (data.checked) {
					vm.selectNoCert = true;
					selected.push(data.id);
					selectedItem.push({
						id: data.id,
						name: data.name
					});
				}
			} else {
				if (data.checked) {
					vm.selectNoCert = false;
					selected.push(data.id);
					selectedItem.push({
						id: data.id,
						name: data.name
					});
				} else {
					var index = selected.indexOf(data.id);
					selected.splice(index, 1);
					selectedItem.splice(index, 1);
				}
			}
		}
		/**
		 * 发送回复
		 */
		function sent() {
			$rootScope.loading = true;
			if (!vm.content) {
				Notification.error({
					message: '回复内容不能为空！'
				});
				$rootScope.loading = false;
				return;
			};
			restAPI.refer.referSet.save({}, {
					goodsId: goodsId,
					type: "2",
					contents: vm.content
				})
				.$promise.then(function(resp) {
					$rootScope.loading = false;
					vm.content = null;
					searchGoodId();
				})
		}
		/**
		 * 停用
		 */
		function forbid(param) {
			if (vm.refer.status == '106') {
				Notification.warning({
					message: '当前状态已经是禁用状态!'
				});
				vm.stop = true;
				return;
			}
			var delDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '禁用：' + vm.refer.goodsId,
							content: '你将要禁用品名咨询' + vm.refer.goodsId + '?'
						};
					}
				}
			});
			delDialog.result.then(function() {
				restAPI.refer.forbidden.save({}, {
					goodsId: vm.refer.goodsId,
					status: '106'
				}).$promise.then(function(resp) {
					if (resp.ok) {
						Notification.success({
							message: '禁用品名咨询成功'
						});
						vm.afterforbid = true;
						vm.afterenabled = false;
						vm.disabled = true;
						vm.stop = true;
						searchGoodId();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function() {

			})
		}
		/**
		 * 启用
		 */
		function enabled(param) {
			var enDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function() {
						return {
							title: '启用：' + vm.refer.goodsId,
							content: '你将要启用品名咨询' + vm.refer.goodsId + '?'
						};
					}
				}
			});
			enDialog.result.then(function() {
				restAPI.refer.forbidden.save({}, {
					goodsId: vm.refer.goodsId,
					status: '105'
				}).$promise.then(function(resp) {
					if (resp.ok) {
						Notification.success({
							message: '启用品名咨询成功'
						});
						vm.afterenabled = true;
						vm.afterforbid = false;
						searchGoodId();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function() {

			})
		}
		/**
		 * 下载文件
		 */
		function downloadFile(id) {
			Download.downloadFile(id, restAPI.file.downloadFile);
		}
		/**
		 * 删除文件
		 */
		function removeFile(id, type) {
			restAPI.file.removeFile.save({}, {
					fileId: id
				})
				.$promise.then(function(resp) {
					if (resp.ok) {
						if (type === 'type') {
							vm.refer.remoteFiles = null;
							vm.btn.close1 = false;
						} else if (type === 'othertype') {
							vm.refer.remoteFiles1 = null;
							vm.btn.close2 = false;
						}
						Notification.success({
							message: '文件删除成功'
						});
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
		/**
		 * 咨询结果确认
		 */
		function confirm() {
			$rootScope.loading = true;
			var data = angular.copy(selectedItem);
			if (vm.refer.other) {
				data.push({
					id: 'all',
					name: vm.refer.other
				});
			};
			if (goodsId) {
				$rootScope.loading = false;
				restAPI.goodsId.goodsIdResult.save({}, {
						"goodsId": goodsId,
						"result": JSON.stringify(data)
					})
					.$promise.then(function(resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '咨询结果确认成功'
							});
							searchGoodId();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					})
			}
		}

		function disableBtn(data) {
			if (vm.selectNoCert && data.id !== '106') {
				vm.refer.other = '';
				data.checked = false;
			}
			return vm.selectNoCert && data.id !== '106';
		}

		function productExplain() {
			$state.go("pactlAssist.online", {
				goodsId: goodsId,
				userType: "PACTL"
			});
		}

		/*让滚动条滚动到底部*/
		function scrollBottom() {
			var scr = $.find('.border2');
			if (scr.length > 0) {
				var border = scr[0];
				border.scrollTop = border.scrollHeight;
			}
		}
	}
];

module.exports = angular.module('app.pactlAssist.reply', []).controller('replyCtrl', reply_fn);