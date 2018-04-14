'use strict';

var acceptanceList_fn = ['$scope', 'restAPI', 'Page', '$rootScope', '$modal', '$stateParams', 'Notification', 'Auth', '$state',
	function ($scope, restAPI, Page, $rootScope, $modal, $stateParams, Notification, Auth, $state) {
		var vm = $scope;
		var billNO = '';
		var awId = '';
		vm.back = back;
		vm.sendINIT = sendINIT;
		vm.mainStyle = false;
		vm.backList = backList; //打印退库单
		vm.check = check;
		vm.noPassFlag = '0';
		vm.btn = {
			afterPass: false,
			afterNopass: false
		};
		vm.changeWaybill = changeWaybill;
		vm.eleWaybill = eleWaybill; //改为非电子运单
		vm.noPass = noPass;
		vm.move = move; //空侧迁转
		vm.historys = historys;
		vm.pageChanged = pageChanged; //分页
		vm.page = Page.initPage(); //分页
		vm.parentBill = {}; //主单信息
		vm.parentBooks = {}; //主单证书信息
		vm.pass = pass;
		vm.PassReasonData = []; //不通过原因
		vm.progressObj = {}; //右侧进度
		vm.rebooks = rebooks;
		vm.remarkFormal = remarkFormal;
		vm.remarkInvalid = remarkInvalid;
		vm.reStore = reStore; //1.7.重新入库
		vm.showNameAdvice = showNameAdvice;
		vm.searchBook = searchBook;
		vm.showCargoDeclaraction = showCargoDeclaraction;
		vm.showBatteryDeclaraction = showBatteryDeclaraction;
		vm.approachflag = approachflag;
		vm.search = search;
		vm.sublist = []; //分单数据	
		vm.totalObj = {
			totalCount: 0,
			rcpNo: 0,
			weight: 0
		};
		vm.pre = {};
		vm.pres = {};
		vm.unpack = unpack;
		vm.readOnly = $stateParams.read === '1';
		vm.isEqualityCustom = isEqualityCustom;
		vm.informalRule = '';

		getInformalRule();

		function getInformalRule(user, token, data) {
			$rootScope.loading = true;
			restAPI.systemSet.querySingleSet.save({}, 'informalRule')
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length > 0) {
						vm.informalRule = resp.data.regVal;
					}
					checkbillNO();
				});
		}

		/**
		 * 检测billNO
		 */
		function checkbillNO() {
			billNO = $stateParams.billNO;
			awId = $stateParams.awId;
			if (billNO) {
				getPassReason();
			}
			if (awId) {
				getPassReason();
			}
		}
		/**
		 * 获取不通过原因
		 */
		function getPassReason() {
			$rootScope.loading = true;
			restAPI.baseData.queryAll.save({}, {
					type: '1480323531498507'
				})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.PassReasonData = resp.rows;
					search();
				});
		}
		/**
		 * 查询
		 */
		function search() {
			$rootScope.loading = true;
			if (billNO) {
				restAPI.waybill.billdetail.save({}, {
					billNO: billNO,
					rows: vm.page.length,
					page: vm.page.currentPage,
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						setData(resp.data);
						searchStatus();
						mainAstatus(resp.data);
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}
			if (awId) {
				restAPI.waybill.billdetailbyid.save({}, {
					awId: awId,
					rows: vm.page.length,
					page: vm.page.currentPage,
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						setData(resp.data);
						searchStatus();
						mainAstatus(resp.data);
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
			}
		}
		/**
		 * 如果主单号有，安检加的证书，在 主单号 后面显示 安检加证书 的标签
		 */
		function mainAstatus(param) {
			vm.loading = true;
			restAPI.preJudice.bookCheck.save({}, {
					awId: param.parentBill.awId,
					bookType: "book"
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
						angular.forEach(vm.rows, function (v, k) {
							if (v.book.deviceId === '1') {
								vm.mainStyle = true;
							}
						});
					}
				});
		}
		/**
		 * 查询主单状态
		 */
		function searchStatus() {
			$rootScope.loading = true;
			changeWaybillSearch();
			moveSearch();
			returncount();
			restAPI.waybill.statusdetail.save({}, {
				awId: vm.parentBill.awId
			}).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					var data = resp.data;
					vm.wFlag = data.wFlag;
					vm.wbEle = data.wbEle;
					vm.wStatus = data.wStatus;
					vm.noPassFlag = data.noPassFlag;
					vm.ckReBook = data.ckReBook;
					vm.ckOpenFlag = data.ckOpenFlag;
				} else {
					Notification.error({
						message: resp.msg
					});
				}
			});
		}
		/**
		 * 显示所有的信息
		 * 
		 */
		function setData(param) {
			vm.parentBill = param.parentBill;
			vm.parentBill.wayBill = '<div class="pre-name">' +
				(vm.parentBill.ssr ? '<div><div class="pre-enTitle">SSR: </div> <div class="pre-enValue">' +
					vm.parentBill.ssr + '</div></div>' : '') +
				(vm.parentBill.osi1 ? '<div><div class="pre-enTitle">OSI: </div> <div class="pre-enValue">' +
					vm.parentBill.osi1 + '</div></div>' : '') +
				(vm.parentBill.holdCode ? '<div><div class="pre-enTitle">SHC: </div> <div class="pre-enValue">' +
					vm.parentBill.holdCode + '</div></div>' : '') +
				(vm.parentBill.alsoNotify ? '<div><div class="pre-enTitle">Also notify: </div> <div class="pre-enValue">' +
					vm.parentBill.alsoNotify + '</div></div>' : '') + '</div>';
			vm.parentBill.div = '<div class="pre-name">' + (vm.parentBill.goodsNameEn ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + vm.parentBill.goodsNameEn + '</div></div>' : '') + (vm.parentBill.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + vm.parentBill.goodsNameCn + '</div></div>' : '') + (vm.parentBill.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + vm.parentBill.goodsRemarks + '</pre></div>' : '') + '</div>';
			// vm.parentBill.table = '<table class="table content-main-table" style="width: 600px;"> <thead><tr><th class = "w30"> 品名补充英文 </th> <th class = "w30"> 品名补充中文 </th> <th class = "w40"> 品名详细描述（可选） </th> </tr> </thead> <tbody> <tr> <td>' + vm.parentBill.goodsNameEn + '</td><td>' + vm.parentBill.goodsNameCn + '</td><td>' + vm.parentBill.goodsRemarks + '</td></tr> </tbody>';
			//getUnitById(vm.parentBill.agentSalesId);
			vm.parentBooks = param.parentBooks;
			vm.sublist = param.rows;
			angular.forEach(vm.sublist, function (v, k) {
				v.childBill.goodsNameEn = v.childBill.remark;
				v.div = '<div class="pre-name">' + (v.childBill.goodsNameEn ? '<div><div class="pre-enTitle">补充英文:</div> <div class="pre-enValue">' + v.childBill.goodsNameEn + '</div></div>' : '') + (v.childBill.goodsNameCn ? '<div><div class="pre-enTitle">补充中文:</div> <div class="pre-enValue">' + v.childBill.goodsNameCn + '</div></div>' : '') + (v.childBill.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + v.childBill.goodsRemarks + '</pre></div>' : '') + '</div>';
				// v.table = '<table class="table content-main-table" style="width: 600px;"><thead><tr><th class = "w30"> 品名补充英文 </th> <th class = "w30"> 品名补充中文 </th> <th class = "w40"> 品名详细描述（可选） </th> </tr> </thead><tbody>';
				// v.table += '<tr>' +
				// 	'<td>' + v.childBill.goodsNameEn + '</td>' +
				// 	'<td>' + v.childBill.goodsNameCn + '</td>' +
				// 	'<td>' + v.childBill.goodsRemarks + '</td>' +
				// 	'</tr>';

				// v.table += '</tbody></table>';
			})
			// 如果分单号有，安检加的证书，在 主单号 后面显示 安检加证书 的标签
			angular.forEach(vm.sublist, function (v, k) {
				restAPI.preJudice.bookCheck.save({}, {
						awId: v.childBill.awId,
						bookType: "book"
					})
					.$promise.then(function (resp) {
						if (resp.ok) {
							var data = resp.data;
							for (var i = 0; i < data.length; i++) {
								var element = data[i];
								if (element.book.deviceId === '1') {
									v.subStyle = true;
									vm.mainStyle = true;
									break;
								}
							};
						}
					});
			});
			vm.totalObj.rcpNo = param.allRcpNo;
			vm.totalObj.weight = param.allGrossWeight;
			vm.totalObj.totalCount = param.billNum;
			Page.setPage(vm.page, {
				total: param.total
			});
			getCargoDeclare(vm.parentBill.awId);
			getBattaryDeclare(vm.parentBill.awId);
			searchType(vm.parentBill.awId);
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
						//主单展示精简的详细信息
						vm.pres.eli = '';
						vm.pres.elm = '';
						vm.pres.eli += resp.data && resp.data.eliIiOnly === '1' ? '<div class="eliOrElm1"> 965 </div>' : '';
						vm.pres.eli += resp.data && resp.data.eliIiPack === '1' ? '<div class="eliOrElm1"> /966 </div>' : '';
						vm.pres.eli += resp.data && resp.data.eliRelation === '1' ? '<div class="eliOrElm1"> /967 </div>' : '';
						vm.pres.eli += resp.data && resp.data.overpack === '1' ? '<div class="eliOrElm1"> ;overpack; </div>' : '';
						if (resp.data && resp.data.eliBatteryCellNo) {
							vm.pres.eli += resp.data && resp.data.eliBatteryCellNo ? '<div class="eliOrElm1">' + resp.data.eliBatteryCellNo + '芯;</div>' : '';
						}

						// if (resp.data.eliBatteryNo) {
						vm.pres.eli += resp.data && resp.data.eliBatteryNo ? '<div class="eliOrElm1">' + resp.data.eliBatteryNo + '电;</div>' : '';
						// }
						vm.pres.eli += resp.data && resp.data.eliButtonFlag === '1' ? '<div class="eliOrElm1"> 仅装在设备或主板中的纽扣电池; </div>' : '';
						vm.pres.eli += resp.data && resp.data.noeli === '1' ? '<div class="eliOrElm1"> 无需粘贴锂电池标签; </div>' : '';
						vm.pres.eli += resp.data && resp.data.nameAddress ? '<div class="eliOrElm1 nameAddress">' + resp.data.nameAddress + ';</div>' : '';
						vm.pres.eli += resp.data && resp.data.signName ? '<div class="eliOrElm1">' + resp.data.signName + ';</div>' : '';
						vm.pres.eli += resp.data && resp.data.phone ? '<div class="eliOrElm1">' + resp.data.phone + ';</div>' : '';
						vm.pres.eli += resp.data && resp.data.createTime ? '<div class="eliOrElm1">' + resp.data.createTime + ';</div>' : '';

						vm.pres.elm += resp.data && resp.data.elmIiOnly === '1' ? '<div class="eliOrElm1"> 968 </div>' : '';
						vm.pres.elm += resp.data && resp.data.elmIiPack === '1' ? '<div class="eliOrElm1"> /969 </div>' : '';
						vm.pres.elm += resp.data && resp.data.elmRelation === '1' ? '<div class="eliOrElm1"> /970 </div>' : '';
						vm.pres.elm += resp.data && resp.data.overpack === '1' ? '<div class="eliOrElm1"> ;overpack; </div>' : '';
						// if (resp.data.elmBatteryCellNo) {
						vm.pres.elm += resp.data && resp.data.elmBatteryCellNo ? '<div class="eliOrElm1">' + resp.data.elmBatteryCellNo + '芯;</div>' : '';
						// }
						// if (resp.data.elmBatteryNo) {
						vm.pres.elm += resp.data && resp.data.elmBatteryNo ? '<div class="eliOrElm1">' + resp.data.elmBatteryNo + '电;</div>' : '';
						// }
						vm.pres.elm += resp.data && resp.data.elmButtonFlag === '1' ? '<div class="eliOrElm1"> 仅装在设备或主板中的纽扣电池; </div>' : '';
						vm.pres.elm += resp.data && resp.data.noelm === '1' ? '<div class="eliOrElm1"> 无需粘贴锂电池标签; </div>' : '';
						vm.pres.elm += resp.data && resp.data.nameAddress ? '<div class="eliOrElm1 nameAddress">' + resp.data.nameAddress + ';</div>' : '';
						vm.pres.elm += resp.data && resp.data.signName ? '<div class="eliOrElm1">' + resp.data.signName + ';</div>' : '';
						vm.pres.elm += resp.data && resp.data.phone ? '<div class="eliOrElm1">' + resp.data.phone + ';</div>' : '';
						vm.pres.elm += resp.data && resp.data.createTime ? '<div class="eliOrElm1">' + resp.data.createTime + ';</div>' : '';

						//这个是分单的信息
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
		 * 保函
		 */
		function getCargoDeclare(awId) {
			restAPI.declare.cargoDeclare.save({}, {
					awId: awId
				})
				.$promise.then(function (resp) {
					if (resp.ok && resp.data && resp.data.cargoDeclare) {
						vm.showCargoDeclare = resp.data.cargoDeclare;
					} else {
						vm.showCargoDeclare = false;
					}
				});
		}
		/**
		 * 锂电池
		 */
		function getBattaryDeclare(awId) {
			restAPI.declare.battaryDeclare.save({}, {
					awId: awId
				})
				.$promise.then(function (resp) {
					if (resp.ok && resp.data) {
						vm.showBattaryDeclare = true;
					} else {
						vm.showBattaryDeclare = false;
					}
				});
		}
		/**
		 * 根据id获取agent信息
		 */
		function getUnitById(id) {
			restAPI.operAgent.agentDetail.get({
					id: id
				})
				.$promise.then(function (resp) {
					vm.parentBill.agentSalesEnname = resp.ename;
				});
		}

		function isEqualityCustom() {
			var equal = true;
			if(vm.parentBill.rcpNo && vm.parentBill.grossWeight && vm.progressObj &&  vm.progressObj.waybillStatus && vm.progressObj.waybillStatus.customRcpNo && vm.progressObj.waybillStatus.customWeight) {
				if(vm.progressObj.waybillStatus.customRcpNo>0 && vm.progressObj.waybillStatus.customRcpNo!==vm.parentBill.rcpNo) {
					equal = false;
				}
				if(vm.progressObj.waybillStatus.customWeight>0 && vm.progressObj.waybillStatus.customWeight!==vm.parentBill.grossWeight) {
					equal = false;
				}
			}
			return equal;
		}
		/**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, search);
		}
		/**
		 * pactl主单、分单品名补充查看
		 */
		function showNameAdvice(data) {
			var showNameAdviceDialog = $modal.open({
				template: require('./nameAaddedDialog.html'),
				controller: require('./nameAaddedDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '品名补充',
							obj: {
								goodsNameEn: data.goodsNameEn,
								goodsNameCn: data.goodsNameCn,
								goodsRemarks: data.goodsRemarks
							}
						};
					}
				}
			});
		}
		/**
		 * 证书显示
		 */
		function searchBook(param) {
			if (param.type === "other") {
				addOtherBook(param);
			} else {
				addOriBook(param);
			}
		}
		/**
		 * 查看其他文档
		 */
		function addOtherBook(param) {
			var otherBookDialog = $modal.open({
				template: require('./otherBook.html'),
				controller: require('./otherBook.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '其他',
							obj: {
								awId: param.awId,
								bookType: param.type
							}
						};
					}
				}
			});
		}
		/**
		 * 查看证书(book + ele)
		 */
		function addOriBook(param) {
			var bookDialog = $modal.open({
				template: require('./book.html'),
				controller: require('./book.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: param.type === 'book' ? '证书' : '磁检证书',
							obj: {
								wStatus: param.wStatus,
								awId: param.awId,
								bookType: param.type,
								goodsNameEn: param.goodsNameEn,
								goodsNameCn: param.goodsNameCn,
								goodsDesc: param.goodsDesc,
								parentawId: vm.parentBill.awId,
								isChildBill: param.isChildBill
							}
						};
					}
				}
			});
		}
		/**
		 * 检查清单
		 */
		function check() {
			var checklistDialog = $modal.open({
				template: require('./checklist.html'),
				controller: require('./checklist.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							obj: {
								awId: vm.parentBill.awId,
								grossWeight: vm.parentBill.grossWeight,
								chargeWeight: vm.parentBill.chargeWeight,
								wbEle: vm.parentBill.wbEle,
								count: vm.parentBill.rcpNo
							}
						};
					}
				}
			});
			checklistDialog.result.then(function (data) {
				$rootScope.loading = true;
				var obj = getChecklistData(data);
				restAPI.waybill.saveChecklist.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '检查清单成功'
							});
							refeshRecord();
						} else {
							Notification.error({
								message: '检查清单失败!' + resp.msg || ''
							});
						}
					});
			}, function (resp) {});
		}
		/**
		 * 获取检查清单的数据
		 */
		function getChecklistData(data) {
			var obj = {};
			obj.rbId = data.rbId;
			obj.awId = data.awId;
			obj.markCheck = [];
			angular.forEach(data.markChecks, function (v, k) {
				obj.markCheck.push({
					"rwmId": v.rwmId,
					"needFlag": v.needFlag,
					"markName": v.markName,
					"markCode": v.markCode,
					"checkFlag": v.checkFlag,
					"operated": v.operated ? v.operated : ''
				})
			});
			obj.filesCheck = [];
			angular.forEach(data.filesChecks, function (v, k) {
				obj.filesCheck.push({
					fileId: v.fileId,
					fileName: v.fileName,
					checkFlag: v.checkFlag ? 'true' : 'false'
				})
			});
			obj.electricFlag = data.electricFlag ? '1' : '0';
			obj.agentFiles = [];
			angular.forEach(data.agentFiles, function (v, k) {
				obj.agentFiles.push({
					agent: v.agent,
					code: v.code,
					destCode: v.destCode,
					upload: v.upload,
					odifiedDate: v.odifiedDate,
					type: v.type,
					updater: v.updater,
					checkFlag: v.checkFlag ? 'true' : 'false',
					updateId: v.updateId,
					createId: v.createId,
					airCode: v.airCode,
					creater: v.creater,
					name: v.name,
					id: v.id,
					specialCode: v.specialCode,
					createDate: v.createDate,
					status: v.status
				})
			});
			if(data.cashCheck !== '2') {
				obj.cashCheck = (data.cashCheck === true) ? '1' : '0';
			} else {
				obj.cashCheck = '2';
			}
			obj.actualWeight = data.actualWeight;
			obj.actualVolume = data.totalVolume;
			obj.volumeList = [];
			obj.confirmLiBatteryStatement = (data.confirmLiBatteryStatement === true) ? '1' : '0';
			angular.forEach(data.newItems, function (v, k) {
				if (v.length && v.width && v.height) {
					obj.volumeList.push({
						cwvId: v.cwvId ? v.cwvId : '',
						rbId: data.rbId,
						length: v.length,
						width: v.width,
						height: v.height,
						count: v.count
					});
				}
			});
			return obj;
		}
		/**
		 * 通过
		 */
		function pass() {
			var passDialog = $modal.open({
				template: require('../../prejudice/ordinaryCargo/pass.html'),
				controller: require('../../prejudice/ordinaryCargo/pass.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '通过',
							btnName: '确认通过',
							obj: {
								waybillNo: vm.parentBill.waybillNo
							}
						};
					}
				}
			});
			passDialog.result.then(function (data) {
				var obj = {};
				obj.awId = vm.parentBill.awId;
				obj.action = "1";
				obj.noPassFlag = '0';
				obj.fileId = data.fileObj ? data.fileObj.id : '';
				obj.actionComments = data.actionComments ? data.actionComments : '';
				$rootScope.loading = true;
				restAPI.waybill.passChecklist.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							vm.btn.afterPass = 'true';
							// vm.btn.wrongFlag = false;
								vm.btn.afterNopass = 'false';
							changeProgress();
							refeshRecord();
							showDailog(resp.data);
						} else {
							Notification.error({
								message: resp.msg || ''
							});
						}
					});
			}, function (resp) {

			});
		}
		/**
		 * 通过之后弹框
		 */
		function showDailog(param) {
			var afterpassDialog = $modal.open({
				template: require('./others/afterpassDialog.html'),
				controller: require('./others/afterpassDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							details: param,
							obj: {}
						};
					}
				}
			});
		}
		/**
		 * 不通过
		 */
		function noPass() {
			var noPassDialog = $modal.open({
				template: require('../../prejudice/ordinaryCargo/noPass.html'),
				controller: require('../../prejudice/ordinaryCargo/noPass.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '不通过',
							btnName: '确认退回',
							PassReasonData: vm.PassReasonData,
							obj: {
								waybillNo: vm.parentBill.waybillNo
							}
						};
					}
				}
			});
			noPassDialog.result.then(function (data) {
				var obj = {
					actionComments: []
				};
				obj.awId = vm.parentBill.awId;
				obj.action = "2";
				obj.noPassFlag = '1';
				obj.fileId = data.fileObj ? data.fileObj.id : '';
				angular.forEach(data.remarkData, function (v, k) {
					obj.actionComments.push(v.name);
				});
				obj.actionComments = obj.actionComments.join(';');
				$rootScope.loading = true;
				restAPI.waybill.passChecklist.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '不通过成功'
							});
							vm.btn.afterNopass = 'true';
								vm.btn.afterPass = 'false';
							changeProgress();
							refeshRecord();
						//	setTimeout("window.location.reload()","500");
							 
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
		 * 退单
		 */
		function back(param) {
			var backDialog = $modal.open({
				template: require('./others/backDialog.html'),
				controller: require('./others/backDialog.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				// appendTo: angular.element('.head-location'),
				resolve: {
					items: function () {
						return {
							title: '退单',
							obj: {
								waybillNo: param.waybillNo
							}
						};
					}
				}
			});
			backDialog.result.then(function (data) {
				$rootScope.loading = true;
				restAPI.waybill.returnbill.save({}, {
					awId: param.awId,
					comment: data.content
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '退单成功'
						});
						changeProgress();
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
		 * 发送数据给英迪   核放行
		 */
		function sendINIT(param) {
			var sendINITDialog = $modal.open({
				template: require('./others/sendINITDialog.html'),
				controller: require('./others/sendINITDialog.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				// appendTo: angular.element('.head-location'),
				resolve: {
					items: function () {
						return {
							title: '核放行',
							obj: {
								waybillNo: param.waybillNo
							}
						};
					}
				}
			});
			sendINITDialog.result.then(function (data) {
				$rootScope.loading = true;
				restAPI.waybill.sendinitdata.save({}, {
					awId: param.awId,
					comment: data.content
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '核放行数据发送成功:'+resp.data
						});
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
		 * 打印退库单
		 */
		function backList(param) {
			var blDialog = $modal.open({
				template: require('./others/blDialog.html'),
				controller: require('./others/blDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: "打印退库单",
							billNO: param.waybillNo,
							awId: param.awId
						};
					}
				}
			});
			blDialog.result.then(function (data) {
				refeshRecord();
			}, function () {

			});
		}

		function approachflag() {
			var approachflagDialog = $modal.open({
				template: require('./others/approachflag.html'),
				controller: require('./others/approachflag.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单号' + vm.parentBill.waybillNo
						};
					}
				}
			});
			approachflagDialog.result.then(function (data) {
				$rootScope.loading = true;
				restAPI.waybill.approachflag.save({}, {
					comment: data.comment,
					awId: vm.parentBill.awId
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '取消进场成功'
						});
						changeProgress();
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
		 * 开箱检查
		 */
		function unpack() {
			var unpDialog = $modal.open({
				template: require('./unpack.html'),
				controller: require('./unpack.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单号' + vm.parentBill.waybillNo
						};
					}
				}
			});
			unpDialog.result.then(function (data) {
				$rootScope.loading = true;
				restAPI.preJudice.unpackPass.save({}, {
					fileId: data.fileObj ? data.fileObj.id : '',
					comment: data.content,
					awId: vm.parentBill.awId,
					openFlag: data.type
				}).$promise.then(function (resp) {
					$rootScope.loading = false;
					if (resp.ok) {
						Notification.success({
							message: data.type === '1' ? '开箱检查通过成功' : '开箱检查不通过成功'
						});
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
		 * 收正本
		 */
		function rebooks() {
			var rebDialog = $modal.open({
				template: require('./rebooks.html'),
				controller: require('./rebooks.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							awId: vm.parentBill.awId
						};
					}
				}
			});
			rebDialog.result.then(function (data) {
				var obj = {
					books: []
				};
				angular.forEach(data, function (v, k) {
					typeof v.reBook === 'boolean' && (v.reBook = v.reBook ? '1' : '0')
					obj.books.push({
						id: v.id,
						reBook: v.reBook,
						bookNo: v.bookNo
					});
				});
				obj.awId = vm.parentBill.awId;
				$rootScope.loading = true;
				restAPI.preJudice.rebooks.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '收正本成功'
							});
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
		 * 改为非电子运单,0：非电子运单，1：电子运单
		 */
		function eleWaybill() {
			var eleDialog = $modal.open({
				template: require('./others/eleDialog.html'),
				controller: require('./others/eleDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单号' + vm.parentBill.waybillNo,
							wbEle: vm.parentBill.wbEle,
							obj: {
								awId: vm.parentBill.awId
							}
						};
					}
				}
			});
			eleDialog.result.then(function (data) {
				var obj = {};
				obj.awId = vm.parentBill.awId;
				obj.wb_ele = data.wb_ele;
				obj.comment = data.comment;
				$rootScope.loading = true;
				restAPI.waybill.eleWaybill.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: data.wb_ele === '0' ? '改为非电子运单成功' : '改为电子运单成功'
							});
							vm.parentBill.wbEle = data.wb_ele;
							changeProgress();
							search();
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
		 * 查询退关件数
		 */
		function returncount() {
			vm.loading = true;
			restAPI.waybill.returncount.save({}, {
					awId: vm.parentBill.awId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					vm.datas = resp.data;
				});
		}
		/**
		 * 空侧迁转查询
		 */
		function moveSearch() {
			vm.loading = true;
			restAPI.waybill.queryMove.save({}, {
					awId: vm.parentBill.awId
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
		 * 空侧迁转编辑
		 */
		function move(param) {
			var moveDialog = $modal.open({
				template: require('./others/moveDialog.html'),
				controller: require('./others/moveDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '空侧迁转',
							obj: {},
							rows: vm.rows,
							moves: param,
							awId: vm.parentBill.awId
						};
					}
				}
			});
			moveDialog.result.then(function (data) {
				moveSearch();
				changeProgress();
			}, function () {
				moveSearch();
				changeProgress();
			});
		}
		/**
		 * 运单改配查询
		 */
		function changeWaybillSearch() {
			restAPI.waybill.changedDetail.save({}, {
					awId: vm.parentBill.awId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						if (resp.data) {
							vm.changeWaybillData = resp.data;
						} else {
							vm.changeWaybillData = null;
						}
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				})
		}
		/**
		 * 运单改配编辑
		 */
		function changeWaybill(param) {
			var chDialog = $modal.open({
				template: require('./others/changeDialog.html'),
				controller: require('./others/changeDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单改配',
							obj: {
								waybillNo: param.waybillNo,
								awId: param.awId,
								flightNo: param.flightNo,
								fltDate: param.fltDate,
								rcpNo: param.rcpNo,
								chargeWeight: param.chargeWeight,
								grossWeight: param.grossWeight,
								vol: param.vol,
								dest2: param.dest2,
								goodsDesc: param.goodsDesc,
								holdCode: param.holdCode,
							}
						};
					}
				}
			});
			chDialog.result.then(function (data) {
				var obj = {};
				obj.awId = param.awId;
				obj.waybillNo = param.waybillNo;
				obj.agentOprnId = param.agentOprnId;
				obj.targetAwId = data.awId;
				obj.targetWaybillNo = data.waybillNo;
				obj.targetAgentOprnId = data.agentOprnId;
				obj.cFlag = '1';
				$rootScope.loading = true;
				restAPI.waybill.saveChange.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '运单改配编辑成功'
							});
							changeWaybillSearch();
							changeProgress();
						} else {
							changeWaybillSearch();
							changeProgress();
							Notification.error({
								message: resp.msg
							});
						}
					});
			}, function () {
				changeWaybillSearch();
				changeProgress();
			});
		}
		/**
		 * 历史文档
		 */
		function historys(param) {
			var hisDialog = $modal.open({
				template: require('./others/hisDialog.html'),
				controller: require('./others/hisDialog.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单号' + param.waybillNo,
							awId: param.awId,
						};
					}
				}
			});
		}

		
		/**
		 * 标记为正式运单或者测试运单,0：测试运单，1：正式运单
		 */
		function remarkFormal(params, formalFlag) {
			var remarkDialog = $modal.open({
				template: require('./others/informalRule.html'),
				controller: require('./others/informalRule.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单号' + params.waybillNo,
							formalFlag: formalFlag,
							obj: {
								awId: params.awId
							}
						};
					}
				}
			});
			remarkDialog.result.then(function (data) {
				var obj = {};
				obj.awId = vm.parentBill.awId;
				obj.formalFlag = data.formalFlag;
				obj.waybillNo = params.waybillNo;
				obj.agentOprnId = params.agentOprnId;
				obj.comment = data.comment;
				$rootScope.loading = true;
				restAPI.waybill.remarkFormal.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: data.formalFlag === '0' ? '改为测试运单成功' : '改为正式运单成功'
							});
							//如果是通过运单编号进来而不是运单ID进来的,改为无效运单成功后改为用运单ID查询，避免刷新以后报错
							if (!$stateParams.awId && data.formalFlag === '1') {
								$state.go("pactlReceive.acceptanceListById", {
									'awId': vm.parentBill.awId
								});
							} else {
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
		 * 空标记为无效运单,0：无效运单，1：有效运单,运单变更为无效运单以后将不能进行任何处理
		 */
		function remarkInvalid(params, wFlag) {
			var remarkDialog = $modal.open({
				template: require('./others/invalid.html'),
				controller: require('./others/invalid.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '运单号' + params.waybillNo,
							wFlag: wFlag,
							obj: {
								awId: params.awId
							}
						};
					}
				}
			});
			remarkDialog.result.then(function (data) {
				var obj = {};
				obj.awId = vm.parentBill.awId;
				obj.wFlag = data.wFlag;
				obj.waybillNo = params.waybillNo;
				obj.agentOprnId = params.agentOprnId;
				obj.comment = data.comment;
				$rootScope.loading = true;
				restAPI.waybill.remarkInvalid.save({}, obj)
					.$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: data.wFlag === '1' ? '改为无效运单成功' : '改为有效运单成功'
							});
							//如果是通过运单编号进来而不是运单ID进来的,改为无效运单成功后改为用运单ID查询，避免刷新以后报错
							if (!$stateParams.awId && data.wFlag === '1') {
								$state.go("pactlReceive.acceptanceListById", {
									'awId': vm.parentBill.awId
								});
							} else {
								changeProgress();
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
		 * 重新入库
		 */
		function reStore(param) {
			var resDialog = $modal.open({
				template: require('./others/reStore.html'),
				controller: require('./others/reStore.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '重新入库',
							obj: {
								waybillNo: param.waybillNo
							}
						};
					}
				}
			});
			resDialog.result.then(function (data) {
				$rootScope.loading = true;
				if (data.type === '1') {
					restAPI.waybill.restorage.save({}, {
						awId: param.awId
					}).$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '重新入库成功'
							});
							$state.reload();
							// changeProgress();
							// refeshRecord();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
				} else if (data.type === '0') {
					restAPI.waybill.cancelRestorage.save({}, {
						awId: param.awId
					}).$promise.then(function (resp) {
						$rootScope.loading = false;
						if (resp.ok) {
							Notification.success({
								message: '取消重新入库成功'
							});
							$state.reload();
							// changeProgress();
							// refeshRecord();
						} else {
							Notification.error({
								message: resp.msg
							});
						}
					});
				}
			}, function () {

			});
		}
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

		/**
		 * 货物申报
		 */
		function showCargoDeclaraction() {
			if(vm.progressObj.waybillStatus.shipmentFlag==='1'){
				return false
			}else{
			var cargoDeclaractionDialog = $modal.open({
				template: require('../../prejudice/declaraction/cargoDeclaraction.html'),
				controller: require('../../prejudice/declaraction/cargoDeclaraction.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '货物申报',
							awId: vm.parentBill.awId,
							waybillNo: vm.parentBill.waybillNo
						};
					}
				}
			});
			cargoDeclaractionDialog.result.then(function () {
				refeshRecord();
			});
		}}

		/**
		 * 锂电池
		 */
		function showBatteryDeclaraction(param, defaultValue) {
			if(vm.progressObj.waybillStatus.shipmentFlag==='1'){
				return false
			}else{
			var batteryDeclaractionDialog = $modal.open({
				template: require('../../prejudice/declaraction/batteryDeclaraction.html'),
				controller: require('../../prejudice/declaraction/batteryDeclaraction.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '锂电池',
							awId: vm.parentBill.awId,
							waybillNo: vm.parentBill.waybillNo,
							editAble: false,
							eliFlag: param.eliFlag,
							elmFlag: param.elmFlag,
							defaultValue: defaultValue,
							airCode: vm.parentBill.carrier1
						};
					}
				}
			});
		}
	}}
];

module.exports = angular.module('app.pactlReceive.acceptanceList', []).controller('acceptanceListCtrl', acceptanceList_fn);