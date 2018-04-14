'use strict';

var pre_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams', 'Auth', '$state', '$document',
	function ($scope, Page, restAPI, $modal, Notification, $rootScope, $stateParams, Auth, $state, $document) {
		var vm = $scope;
		var awId = '';
		vm.airData = [];
		vm.addNameAdvice = addNameAdvice; //引用品名咨询
		vm.agency = false; //修改主账户
		vm.commit = commit;
		vm.downBtn = downBtn;
		vm.upBtn = upBtn;
		vm.edit = edit;
		vm.editAble = false;
		vm.editSale = editSale;
		vm.editOprn = editOprn;
		vm.insideSearch = insideSearch;
		vm.pageChanged = pageChanged;
		vm.page = Page.initPage();
		vm.reback = reback;
		vm.removeNameAdvice = removeNameAdvice; //删除品名咨询
		vm.nameAadded = nameAadded;
		vm.notShowCargoDeclare = false;
		vm.pullTo = pullTo;
		vm.pullDown = pullDown;
		vm.pre = {};
		vm.pres = [];
		vm.progressObj = ''; //右侧进度
		vm.save = save;
		vm.search = search;
		vm.searchBook = searchBook;
		vm.showNameAdvice = showNameAdvice; //查看品名咨询
		vm.showItem = {
			start: 0,
			end: 0
		};
		vm.ckEleStatus = ckEleStatus;
		vm.showCargoDeclaraction = showCargoDeclaraction;
		vm.showBatteryDeclaraction = showBatteryDeclaraction;
		vm.totalObj = {
			totalCount: 0,
			packages: 0,
			weight: 0
		};
		vm.editELM = editELM;
		vm.editELI = editELI;
		vm.aftercom = false;
		vm.afterback = false;
		vm.datas = 0;
		vm.showPrejudicePre = showPrejudicePre;
		vm.obj = {};
		vm.checkTypeData = [];
		vm.airlineAllowPullDown = false;
		vm.allowChangeAgent = false;
		vm.informalRule = '';
		
		getPermission();
	
		function getPermission() {
			$rootScope.loading = true;
			restAPI.permission.getPermission.query({
			tokens: Auth.getUser().token,
			unitid: Auth.getUser().unit,
			resId: '888004'
			}, {})
			.$promise.then(function (resp) {
				$rootScope.loading = false;
				vm.allowChangeAgent = false;
				if (resp && resp.length && resp.length > 0) {
				angular.forEach(resp, function (v, k) {
					if (v.resId === '888004') {
					vm.allowChangeAgent = true;
					}
				});
				} 
				getInformalRule();
			});
		}

		function getInformalRule(user,token,data) {
			$rootScope.loading = true;
			restAPI.systemSet.querySingleSet.save({},'informalRule')
			  .$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length>0) {
				  vm.informalRule = resp.data.regVal;
				}
				check();
			  });
		  }

		/**
		 * 检测awId
		 */
		function check() {
			awId = $stateParams.awId;
			if (awId) {
				getData();
			} else {
				$state.go('agentPrejudice.operation');
			}
		}
		/**
		 * 获取数据
		 */
		function getData() {
			search();
			getCargoDeclare();
		}
		/**
		 * 危险品dangerFlag显示红色，有证书蓝色，无证书绿色  没有的时候显示图标
		 * 0 危险品，1 普货有证书  2  普货无证书
		 * 锂电池声明:ELI,ELM  标签颜色为蓝色,没有的时候显示 图标
		 * 货物申报
		 */
		function getCargoDeclare() {
			restAPI.declare.cargoDeclare.save({}, {
					awId: awId
				})
				.$promise.then(function (resp) {
					if (resp.ok && resp.data && resp.data.cargoDeclare) {
						vm.showCargoDeclare = resp.data.cargoDeclare;
					} else {
						vm.notShowCargoDeclare = true;
					}
				});
		}
		$scope.$watch('progressObj', function (newVal, oldVal) {
			if (newVal) {
				getBattaryDeclare();
			}
		});
		/**
		 * 锂电池
		 */
		function getBattaryDeclare() {
			if (vm.progressObj.eli.flag === "true" || vm.progressObj.elm.flag === "true") {
				vm.showBattaryDeclare = false;
			} else {
				vm.showBattaryDeclare = true;
			}
		}
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			restAPI.bill.billAudit2.save({}, {
				awId: awId
			}).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					if (Auth.getUnitId() === Auth.getMyUnitId()) {
						vm.agency = true;
					} else {
						vm.agency = false;
					}
					setData(resp.data);
					searchType(resp.data.pAirWaybillInfo.awId);
					moveSearch();
					returncount();
					upBtn(resp.data, vm.pAirWaybillStatus);
					downBtn(resp.data, vm.pAirWaybillStatus, vm.queryFirstStatus);
					changeWaybillSearch();
				} else {
					Notification.error({
						message: resp.msg
					});
					$state.go('index');
				}
			})
		}

		/**
		 * 查询锂电池类型：ELI显示勾选对应的 965,966或者967ELM显示勾选对应的 968,969或者970
		 */
		function searchType(param) {
			vm.loading = true;
			restAPI.declare.battaryDeclare.save({}, {
					awId: param
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.pre.eli = '';
						vm.pre.elm = '';
						vm.pre.eli += resp.data && resp.data.eliIiOnly === '1' ? '<div class="eliOrElm"> 965 </div>' : '';
						vm.pre.eli += resp.data && resp.data.eliIiPack === '1' ? '<div class="eliOrElm"> 966 </div>' : '';
						vm.pre.eli += resp.data && resp.data.eliRelation === '1' ? '<div class="eliOrElm"> 967 </div>' : '';
						vm.pre.elm += resp.data && resp.data.elmIiOnly === '1' ? '<div class="eliOrElm"> 968 </div>' : '';
						vm.pre.elm += resp.data && resp.data.elmIiPack === '1' ? '<div class="eliOrElm"> 969 </div>' : '';
						vm.pre.elm += resp.data && resp.data.elmRelation === '1' ? '<div class="eliOrElm"> 970 </div>' : '';
					}
				});
		}
		/**
		 * 空侧迁转查询
		 */
		function moveSearch() {
			vm.loading = true;
			restAPI.waybill.queryMove.save({}, {
					awId: vm.pre.awId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					vm.rows = resp.data;
					var moveAmount = 0;
					if (vm.rows.length > 0) {
						for (var i = 0; i < vm.rows.length; i++) {
							moveAmount += parseInt(vm.rows[i].pieces);
						}
					}
					vm.moveAmount = moveAmount;
				});
		}
		/**
		 * 查询退关件数
		 */
		function returncount() {
			vm.loading = true;
			restAPI.waybill.returncount.save({}, {
					awId: vm.pre.awId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					vm.datas = resp.data;
				});
		}
		/**
		 * 显示数据
		 * pAirWaybillStatus.aStatus 安检状态
		 * 安检状态：
		 *  安检：
		 *       不可安检：210
		 *       可安检：211
		 *       安检中：200
		 *       安检通过 :201
		 *       安检扣押：202
		 * pAirWaybillStatus.wStatus 运单状态
		 * 		未提交： 000
		 *		预审：
		 *						已提交：100
		 *						预审通过：101
		 *						预审退回：102
		 *		收单：
		 *						收单完成：301
		 *						收单不通过：302
		 *			已出运信息：
		 *			有出运信息：401
		 * 点击“提交安检”后，出现“撤回安检”按钮，“安检中”之后的状态既不能点击“提交安检”，也不能点击“撤回安检”按钮
		 *
		 *
		 * 提交之后按钮变为----撤回预审
		 */
		function setData(params) {
			vm.pAirWaybillStatus = params.pAirWaybillStatus;
			vm.queryFirstStatus = params.queryFirstStatus;
			vm.airlineAllowPullDown = params.airlineAllowPullDown;
			vm.pre = params.pAirWaybillInfo;
			vm.pre.div = '<div class="pre-name">' + (vm.pre.goodsNameEn ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + vm.pre.goodsNameEn + '</div></div>' : '') + (vm.pre.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + vm.pre.goodsNameCn + '</div></div>' : '') + (vm.pre.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + vm.pre.goodsRemarks + '</pre></div>' : '') + '</div>';
			vm.pre.agentSalesId && getUnitById(vm.pre.agentSalesId);
			vm.pAirWaybillbooks = params.pAirWaybillbooks;
			vm.pres = params.pAirWaybillDetails || [];
			angular.forEach(vm.pres, function (v, k) {
				v.subAirWaybillInfo.goodsNameEn = v.subAirWaybillInfo.remark;
				vm.eliORelm = false;
				var holdCode = v.subAirWaybillInfo.holdCode || '';
				if (holdCode) {
					if (vm.eliORelm) {
						return
					} else if ((holdCode.split(',').indexOf('ELI') > -1) || (holdCode.split(',').indexOf('ELM') > -1)) {
						vm.eliORelm = true;
					} else {
						vm.eliORelm = false;
					}
					v.holdCodeELI = holdCode.split(',').indexOf('ELI') > -1;
					v.holdCodeELM = holdCode.split(',').indexOf('ELM') > -1;
				}
				v.div = '<div class="pre-name">' + (v.subAirWaybillInfo.goodsNameEn ? '<div><div class="pre-enTitle">补充英文:</div> <div class="pre-enValue">' + v.subAirWaybillInfo.goodsNameEn + '</div></div>' : '') + (v.subAirWaybillInfo.goodsNameCn ? '<div><div class="pre-enTitle">补充中文:</div> <div class="pre-enValue">' + v.subAirWaybillInfo.goodsNameCn + '</div></div>' : '') + (v.subAirWaybillInfo.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + v.subAirWaybillInfo.goodsRemarks + '</pre></div>' : '') + '</div>';

			})
			vm.pAirWaybillStatus = params.pAirWaybillStatus;
			vm.queryFirstStatus = params.queryFirstStatus;
			//状态为000 或者 102时，可修改
			if (params.pAirWaybillStatus.wStatus === '000' || params.pAirWaybillStatus.wStatus === '102') {
				vm.editAble = true;
				vm.afterback = true;
				vm.aftercom = false;
			}
			//只要安检状态==='210/211' && wstatus ="100/101"撤回预审 按钮显示
			if ((params.pAirWaybillStatus.aStatus === '210' || params.pAirWaybillStatus.aStatus === '211') && (params.pAirWaybillStatus.wStatus === '100' || params.pAirWaybillStatus.wStatus === '101')) {
				vm.afterback = false;
				vm.aftercom = true;
			}
			//“安检中”之后的状态(只要安检状态==='200/201/202'，)既不能点击“提交安检”，也不能点击“撤回安检”按钮
			if (params.pAirWaybillStatus.aStatus === '200' || params.pAirWaybillStatus.aStatus === '201' || params.pAirWaybillStatus.aStatus === '202') {
				vm.afterback = true;
				vm.aftercom = true;
			}
			showSublist(params);
		}
		/**
		 * 根据id获取agent信息
		 */
		function getUnitById(id) {
			restAPI.operAgent.agentDetail.get({
					id: id
				})
				.$promise.then(function (resp) {
					vm.pre.agentSalesEnname = resp.ename;
				});
		}
		/**
		 * 分页变化
		 */
		function insideSearch() {
			showSublist();
		}
		/**
		 * 显示分单信息
		 */
		function showSublist() {
			var resp = {
				rows: vm.pres,
				total: vm.pres.length
			};
			vm.showItem = {
				start: (vm.page.currentPage - 1) * vm.page.length - 1,
				end: vm.page.currentPage * vm.page.length
			};
			vm.totalObj.packages = 0;
			vm.totalObj.weight = 0;
			vm.totalObj.totalCount = 0;
			angular.forEach(vm.pres, function (v, k) {
				if (v.subAirWaybillInfo.refStatus !== '1') {
					vm.totalObj.totalCount++;
					vm.totalObj.packages += v.subAirWaybillInfo.rcpNo || 0;
					vm.totalObj.weight += v.subAirWaybillInfo.grossWeight || 0;
				};
			});
			Page.setPage(vm.page, resp);
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, showSublist);
		}
		/**
		 * 保存航空公司二字码
		 */
		function save() {
			$rootScope.loading = true;
			restAPI.preJudice.ediAirline.save({}, {
				awId: awId,
				carrier1: vm.pre.carrier1 ? vm.pre.carrier1.airCode : ''
			}).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					Notification.success({
						message: '保存成功'
					});
				} else {
					Notification.error({
						message: resp.msg
					});
				}
				search();
			});
		}
		/**
		 * 主单、分单的品名补充
		 */
		function nameAadded(param, wStatus) {
			var goodsNameEn = '';
			var wbEle = '0';
			if (param.type === '0') {
				goodsNameEn = param.goodsNameEn;
			} else {
				goodsNameEn = param.remark;
				wbEle = param.wbEle;
			}
			var nameAaddedDialog = $modal.open({
				template: require('./nameAaddedDialog.html'),
				controller: require('./nameAaddedDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							obj: {
								waybillNo: param.waybillNo,
								goodsNameEn: goodsNameEn,
								goodsNameCn: param.goodsNameCn,
								goodsRemarks: param.goodsRemarks,
								wStatus: wStatus,
								wbEle:wbEle
							}
						};
					}
				}
			});
			nameAaddedDialog.result.then(function (data) {
				var obj = {};
				obj.awId = param.awId;
				if (param.type === '0') {
					obj.goodsNameEn = data.goodsNameEn;
				} else {
					obj.remark = data.goodsNameEn;
				}
				obj.goodsNameCn = data.goodsNameCn;
				obj.goodsRemarks = data.goodsRemarks;
				$rootScope.loading = true;
				restAPI.preJudice.saveName.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '品名补充保存成功'
							});
							search();
							param.goodsNameEn = data.goodsNameEn;
							param.goodsNameCn = data.goodsNameCn;
							param.goodsRemarks = data.goodsRemarks;
						} else {
							Notification.error({
								message: '品名补充保存失败!' + resp.msg || ''
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * ELI的修改
		 */
		function editELI(param) {
			if (vm.aftercom || vm.progressObj.waybillStatus.wFlag === '1') {
				return;
			}
			var obj = {};
			obj.awId = param.awId;
			obj.parentNo = param.parentNo;
			if (param.eliFlag === '1') {
				obj.eliFlag = '0';
			} else {
				obj.eliFlag = '1';
			}
			$rootScope.loading = true;
			restAPI.subBill.modifyEle.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: 'ELI修改成功'
						});
						param.eliFlag = obj.eliFlag;
					} else {
						Notification.error({
							message: 'ELI修改失败!' + resp.msg || ''
						});
					}
				});
		}
		/**
		 * ELM的修改
		 */
		function editELM(param) {
			if (vm.aftercom || vm.progressObj.waybillStatus.wFlag === '1') {
				return;
			}
			var obj = {};
			obj.awId = param.awId;
			obj.parentNo = param.parentNo;
			if (param.elmFlag === '1') {
				obj.elmFlag = '0';
			} else {
				obj.elmFlag = '1';
			}
			$rootScope.loading = true;
			restAPI.subBill.modifyEle.save({}, obj)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: 'ELM修改成功'
						});
						param.elmFlag = obj.elmFlag;
					} else {
						Notification.error({
							message: 'ELM修改失败!' + resp.msg || ''
						});
					}
				});
		}
		/**
		 * 提交预审
		 */
		function commit() {
			if (angular.isArray(vm.pres) && vm.pres.length) {
				if (+vm.pre.rcpNo > +vm.totalObj.packages) {
					Notification.error({
						message: '总单件数不得大于分单件数之和'
					});
					return false;
				}
				if (+vm.pre.grossWeight !== +vm.totalObj.weight) {
					Notification.error({
						message: '主单和分单的重量不相等'
					});
					return false;
				}
			}
			commitDialog();
		}
		/**
		 * 提交
		 */
		function commitDialog() {
			var passDialog = $modal.open({
				template: require('../../../pactl/prejudice/ordinaryCargo/pass.html'),
				controller: require('../../../pactl/prejudice/ordinaryCargo/pass.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '提交预审',
							btnName: '提交',
							obj: {
								waybillNo: vm.pre.waybillNo
							}
						};
					}
				}
			});
			passDialog.result.then(function (data) {
				var obj = {};
				obj.awId = awId;
				obj.fileId = data.fileObj ? data.fileObj.id : '';
				obj.comment = data.actionComments ? data.actionComments : '';
				restAPI.preJudice.commitOperation.save({}, obj)
					.$promise.then(function (resp) {
						if (resp.ok) {
							Notification.success({
								message: '提交预审成功'
							});
							$state.reload();
						} else {
							Notification.error({
								message: '提交预审失败!' + resp.msg || ''
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * 退回预审
		 */
		function reback(param) {
			var reDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '退回预审：' + vm.pre.waybillNo,
							content: '你将要退回预审' + vm.pre.waybillNo + '。'
						};
					}
				}
			});
			reDialog.result.then(function () {
				restAPI.preJudice.reback.save({}, {
					awId: awId
				}).$promise.then(function (resp) {
					if (resp.ok) {
						Notification.success({
							message: '退回预审成功'
						});
						changeProgress();
						refeshRecord();
						$state.reload();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function () {

			});
		}
		/**
		 * 子账户修改
		 */
		function editSale() {
			var editSaleDialog = $modal.open({
				template: require('./editSales.html'),
				controller: require('./editSales.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '请选择要更改的子账户',
							obj: {}
						};
					}
				}
			});
			editSaleDialog.result.then(function (data) {
				refeshRecord();
				var obj = {};
				obj.awId = awId;
				obj.agentSales = data.agentSales.code;
				obj.agentSalesId = data.agentSales.id;
				$rootScope.loading = true;
				restAPI.preJudice.editSalesA.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '子账户修改成功'
							});
							$state.reload();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * 主子账户修改
		 */
		function editOprn() {
			var editOprnDialog = $modal.open({
				template: require('./editSales.html'),
				controller: require('./editSales.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '请选择要更改的主账户',
							type: 'all',
							obj: {}
						};
					}
				}
			});
			editOprnDialog.result.then(function (data) {
				var obj = {};
				obj.id = '';
				obj.awId = awId;
				obj.waybillNo = vm.pre.waybillNo;
				obj.agentIataCode = vm.pre.agentIataCode;
				obj.oldAgentOprnId = vm.pre.agentOprnId;
				obj.oldAgentOprn = vm.pre.agentOprn;
				obj.newAgentOprn = data.agentSales.code;
				obj.newAgentOprnId = data.agentSales.id + '';
				$rootScope.loading = true;
				restAPI.preJudice.editOpaA.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						refeshRecord();
						if (resp.ok) {
							Notification.success({
								message: '主账户修改申请成功'
							});
							refeshRecord();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * 未提交之前，不需要校验拉上和拉下
		 * 显示 拉上 按钮：1、refStatus === '1' && (wStatus === '000/102')
		 * 				   			 2、refStatus === '1' && (aStatus === '200') && refFlag !== '1'
		 * 				         3、refStatus === '1' && aStatus === '201'
		 * 显示 拉下 按钮：1、refStatus !== '1' && (wStatus === '000/102')
		 * 				         2、refStatus !== '1' && aStatus === '200' && fStatus === '0'
		 * 				         3、refStatus !== '1' && aStatus === '201'
		 * 4、未发RCS
		 */
		function upBtn(param1, param2) {
			if (!param1.subAirWaybillInfo) {
				return false;
			}
			// if ((param1.subAirWaybillInfo.refStatus && param1.subAirWaybillInfo.refStatus === '1' && (param2.wStatus === '000' || param2.wStatus === '102')) || (param1.subAirWaybillInfo.refStatus === '1' && param2.aStatus === '200' && param1.subAirWaybillInfo.refFlag !== '1') || (param1.subAirWaybillInfo.refStatus === '1' && param2.aStatus === '201')) {
			// 	return true;
			// } else {
			// 	return false;
			// }
			var refStatus = param1.subAirWaybillInfo.refStatus && param1.subAirWaybillInfo.refStatus === '1';
			var wStatus = param2.wStatus === '000' || param2.wStatus === '102';
			var isWbele = param1.subAirWaybillInfo.wbEle === '1';
			var wStatusCommit = param2.wStatus === '101' || param2.wStatus === '302';
			var refFlag = param1.subAirWaybillInfo.refFlag && param1.subAirWaybillInfo.refFlag === '1';
			var aStatus = param2.aStatus === '201';
			var uncommittedPullDown = param1.subAirWaybillInfo.uncommittedPullDown === '1';
			var wbEleCon = isWbele && vm.airlineAllowPullDown;
			var con1 = refStatus && wStatusCommit && !refFlag && aStatus && !uncommittedPullDown;
			var con2 = refStatus && wStatus && wbEleCon && !refFlag;
			var messageFlag = param2.messageFlag !== '1';
			if ((con1 || con2) && messageFlag) {
				return true;
			} else {
				return false;
			}
		}

		function downBtn(param1, param2, param3) {
			if (!param1.subAirWaybillInfo) {
				return false;
			}
			/**
			 * 分单拉下按钮显示的规则：
			 * 1、安检首检待定 安检扣押：202
			 * 2、安检通过
			 * 3、收单未完成
			 * 4、未发RCS
			 * 5、危险品不允许拉下
			 */
			var refStatus = param1.subAirWaybillInfo.refStatus && param1.subAirWaybillInfo.refStatus !== '1';
			var wStatus = param2.wStatus === '000' || param2.wStatus === '102';
			var isWbele = param1.subAirWaybillInfo.wbEle === '1';
			var wStatusCommit = param2.wStatus === '101' || param2.wStatus === '302';
			var fStatus = (param2.aStatus === '200' && param3.fstatus === '0');
			var aStatus = param2.aStatus === '201';
			var pulus = param2.aStatus === '202' && wStatusCommit;
			var wbEleCon = !isWbele || (isWbele && vm.airlineAllowPullDown);
			var con1 = wStatus && refStatus && wbEleCon;
			var con2 = ((refStatus && wStatusCommit && (fStatus || aStatus)) || (pulus && refStatus)) && wbEleCon;
			var messageFlag = param2.messageFlag !== '1';
			var isDanger = (vm.showCargoDeclare && (vm.showCargoDeclare.dangerFlag === '0' || vm.showCargoDeclare.dangerFlag === '3'));
			if ((con1 || con2) && messageFlag && !isDanger) {
				return true;
			} else {
				return false;
			}
		}
		/**
		 * 分单拉上
		 */
		function pullTo(param) {
			var pullToDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '分单拉上',
							content: '你将要拉上分单' + param.subAirWaybillInfo.waybillNo + '。'
						};
					}
				}
			});
			pullToDialog.result.then(function () {
				$rootScope.loading = true;
				restAPI.preJudice.pullToA.save({}, {
					awId: param.subAirWaybillInfo.awId,
					parentNo: awId
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '分单拉上成功'
						});
						param.subAirWaybillInfo.refStatus = '0';
						search();
						changeProgress();
						refeshRecord();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function () {

			});
		}
		/**
		 * 分单拉下
		 * 当refstatus 不等于1时，显示拉下
		 * 对号为=‘0’
		 * x = ‘1’
		 * 没有refstatus 不显示符号
		 */
		function pullDown(param, index) {
			var arr = [];
			angular.forEach(vm.pres, function (v, k) {
				if (v.subAirWaybillInfo.refStatus !== '1') {
					arr.push(v.subAirWaybillInfo.waybillNo);
				}
			});
			if (arr.length === 1) {
				showLastDialog();
				return false;
			}
			var pullDownDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '分单拉下',
							content: '你将要拉下分单' + param.subAirWaybillInfo.waybillNo + '。'
						};
					}
				}
			});
			pullDownDialog.result.then(function () {
				$rootScope.loading = true;
				restAPI.preJudice.pullDownA.save({}, {
					awId: param.subAirWaybillInfo.awId
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '分单拉下成功'
						});
						//如果运单状态是未提交或者退回，拉下分单后刷新
						if (vm.pAirWaybillStatus.wStatus === '000' || vm.pAirWaybillStatus.wStatus === '102') {
							search();
							changeProgress();
							refeshRecord();
						} else {
							param.subAirWaybillInfo.refStatus = '1';
							search();
							changeProgress();
							refeshRecord();
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function () {

			});
		}
		/**
		 * 显示最后一个拉下
		 */
		function showLastDialog() {
			var lastDialog = $modal.open({
				template: require('../../../remove/remove1.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '不能进行分单拉下',
							content: '最后一个分单不能被拉下。'
						};
					}
				}
			});
		}
		/**
		 *agent预审品名咨询列表查询
		 */
		function addNameAdvice(param, type, wStatus) {
			var addNameAdviceDialog = $modal.open({
				template: require('./quoteName.html'),
				controller: require('./quoteName.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							obj: {
								wStatus: wStatus
							}
						};
					}
				}
			});
			addNameAdviceDialog.result.then(function (data) {
				$rootScope.loading = true;
				restAPI.preJudice.waybillQuote.save({}, {
					awId: type === 'main' ? param.awId : param.subAirWaybillInfo.awId,
					parentNo: type === 'sub' ? param.subAirWaybillInfo.parentNo : '',
					goodsQuoteId: data.id,
					goodsQuoteType: data.type
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '引用成功'
						});
						if (type === 'main') {
							param.goodsQuoteId = (data.parentNo || data.id);
							param.goodsQuoteType = data.type;
							search();
						} else {
							param.subAirWaybillInfo.goodsQuoteId = (data.parentNo || data.id);
							param.subAirWaybillInfo.goodsQuoteType = data.type;
							search();
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function () {

			});
		}
		/**
		 * 移除品名咨询的引用
		 */
		function removeNameAdvice(param, type) {
			var delDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '操作提示',
							content: '你将要删除该运单关联的品名咨询'
						};
					}
				}
			});
			delDialog.result.then(function () {
				$rootScope.loading = true;
				restAPI.preJudice.waybillQuote.save({}, {
					awId: type === 'main' ? param.awId : param.subAirWaybillInfo.awId,
					parentNo: type === 'sub' ? param.subAirWaybillInfo.parentNo : '',
					goodsQuoteId: '',
					goodsQuoteType: ''
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '删除成功'
						});
						refeshRecord();
						if (type === 'main') {
							param.goodsQuoteId = '';
							param.goodsQuoteType = '';
						} else {
							param.subAirWaybillInfo.goodsQuoteId = '';
							param.subAirWaybillInfo.goodsQuoteType = '';
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}, function () {

			});
		}
		/**
		 * 显示品名咨询详情
		 */
		function showNameAdvice(params, type) {
			vm.nameAdviceDialog = $modal.open({
				template: require('./nameAdviceDetial.html'),
				controller: require('./nameAdviceDetial.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '品名咨询的详情',
							goodsId: type === 'main' ? params.goodsQuoteId : params.subAirWaybillInfo.goodsQuoteId,
							awId: type === 'main' ? params.awId : params.subAirWaybillInfo.awId
						};
					}
				}
			});
		}
		/**
		 * 运单改配查询
		 */
		function changeWaybillSearch() {
			restAPI.waybill.changedDetail.save({}, {
					awId: awId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						if (resp.data) {
							vm.changeWaybillData = resp.data;
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				})
		}

		/**
		 * 证书显示
		 */
		function searchBook(param) {
			if (param.type === 'other') {
				addOtherBook(param);
			} else {
				addOriBook(param);
			}
		}
		/**
		 * 添加其他文档
		 */
		function addOtherBook(param) {
			var otherBookDialog = $modal.open({
				template: require('./otherBook.html'),
				controller: require('./otherBook.ctrl.js'),
				// appendTo: angular.element('.parentClass'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '其他文档',
							obj: {
								awId: param.awId,
								bookType: param.type,
								wStatus: param.wStatus
							}
						};
					}
				}
			});
			otherBookDialog.result.then(function (data) {
				var arrObj = [];
				angular.forEach(data || {}, function (v, k) {
					arrObj.push({
						awId: param.awId,
						bookComment: v.bookComment,
						bookId: v.fileObj.id,
						fileIdList: v.fileObj.ids
					})
				});
				$rootScope.loading = true;
				restAPI.preJudice.addOtherbooks.save({}, arrObj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '保存成功'
							});
							search();
							refeshRecord();
						} else {
							Notification.error({
								message: '保存失败!' + resp.msg || ''
							});
						}
					});
			}, function (resp) {
				search();
			});
		}
		/**
		 * 添加证书(book + ele)
		 */
		function addOriBook(param) {
			var bookDialog = $modal.open({
				template: require('./book.html'),
				controller: require('./book.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				// appendTo: angular.element('.parentClass'),
				resolve: {
					items: function () {
						return {
							title: param.type === 'book' ? '证书' : '磁检证书',
							obj: {
								parentAwId: param.parentAwId,
								awId: param.awId,
								waybillNo: vm.pre.waybillNo,
								bookType: param.type,
								agentOprnId: param.agentOprnId,
								editAble: param.wStatus,
								carrier1: vm.pre.carrier1,
								goodsNameEn: param.goodsNameEn,
								goodsNameCn: param.goodsNameCn,
								goodsDesc: param.goodsDesc,
								eliFlag: vm.progressObj.eli.flag,
								elmFlag: vm.progressObj.elm.flag
							},
							needSaveData: true
						};
					}
				}
			});

			bookDialog.result.then(function (data) {
				Notification.success({
					message: '保存成功'
				});
				$state.reload();
			}, function (resp) {
				$state.reload();
			});
		}
		/**
		 * 磁检证书的却换
		 */
		function ckEleStatus(param, editAble, value, type, $e) {
			if (editAble) {
				restAPI.preJudice.ckElectricFlag.save({}, {
						awId: value.awId,
						ckElectricFlag: type,
						parentNo: param === 'main' ? '' : value.parentNo
					})
					.$promise.then(function (resp) {
						if (resp.ok) {
							value.ckElectricFlag = type;
						}
					});
			};
		}
		// }
		/**
		 *  编辑
		 */
		function edit() {
			$state.go('agentPrejudice.apply', {
				awId: vm.pre.awId,
				waybillNo: vm.pre.waybillNo
			})
		}
		/**
		 * 货物申报
		 */
		function showCargoDeclaraction() {
			if(vm.pAirWaybillStatus.shipmentFlag==='1'){
				return false
			}else{
			var cargoDeclaractionDialog = $modal.open({
				template: require('../declaraction/cargoDeclaraction.html'),
				controller: require('../declaraction/cargoDeclaraction.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '货物申报',
							awId: vm.pre.awId,
							editAble: vm.editAble,
							airCode: vm.pre.carrier1
						};
					}
				}
			});
			cargoDeclaractionDialog.result.then(function () {
				$state.reload();
			});
		}}
		/**
		 * 锂电池
		 */
		function showBatteryDeclaraction() {
			if(vm.pAirWaybillStatus.shipmentFlag==='1'){
				return false
			}else{
			var batteryDeclaractionDialog = $modal.open({
				template: require('../declaraction/batteryDeclaraction.html'),
				controller: require('../declaraction/batteryDeclaraction.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '锂电池',
							awId: vm.pre.awId,
							waybillNo: vm.pre.waybillNo,
							editAble: vm.editAble,
							airCode: vm.pre.carrier1
						};
					}
				}
			});
			batteryDeclaractionDialog.result.then(function () {
				$state.reload();
			});
		}}
		/**
		 * 改变进度条
		 */
		function changeProgress() {
			$scope.$broadcast('change-progress');
		}
		/**
		 * 刷新审核历史
		 */
		function refeshRecord() {
			$scope.$broadcast('history-records');
		}

		$scope.$on('inside-search', function (event, data) {
			var name = data.sortObj.name,
				sort = data.sortObj.sort;
			vm.pres.sort(function (a, b) {
				var data1 = a.subAirWaybillInfo[name],
					data2 = b.subAirWaybillInfo[name]
				if (data1 < data2) {
					return sort === 'asc' ? -1 : 1;
				} else if (data1 > data2) {
					return sort === 'asc' ? 1 : -1;
				} else {
					return 0;
				}
			});
		});


		/**
		 * 品名咨询
		 */
		function showPrejudicePre(item) {
			if (item.goodsQuoteType === '102') {
				//主单，直接打开预审
				var url = $state.href("agentPrejudice.pre", {
					'awId': item.goodsQuoteId
				});
				window.open(url);
			} else if (item.goodsQuoteType === '103') {
				//分单，先通过分单查询主单号
				searchSubBill(item.goodsQuoteId);
			}

		}

		function searchSubBill(awId) {
			$rootScope.loading = true;
			restAPI.subBill.getMasterBill.save({}, awId)
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
							var url = $state.href("agentPrejudice.pre", {
								'awId': resp.data.pAirWaybillInfo.parentNo
							});
							window.open(url);
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
	}
];

module.exports = angular.module('app.agentPrejudice.pre', []).controller('preCtrl', pre_fn);