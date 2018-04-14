'use strict';

var operation_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth', '$state', '$stateParams', '$timeout','ipCookie',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth, $state, $stateParams, $timeout,ipCookie) {
    var vm = $scope;
    var selected = [];
    var selectedAwd = [];
    var selectedMasterAwId = [];
    var checked = [];
    vm.airData = [];
    vm.airportData = [];
    vm.allCheck = allCheck;
    vm.allselected = false;
    vm.doFocus = doFocus;
    vm.goToPre = goToPre;
    vm.isChecked = isChecked;
    vm.info = info;
    vm.barCode = barCode
    vm.operation = {};
    vm.opData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.totalObj = {
      packages: 0,
      weight: 0
    };
    vm.salesData = [];
    vm.search = search;
    vm.showCert = showCert;
    vm.showMore = false;
    vm.showSub = showSub;
    vm.showCert = showCert;
    vm.singleCheck = singleCheck;
    vm.refreshDest = refreshDest;
    vm.showProgress = showProgress;
    vm.showWbEle = showWbEle;
    vm.showCar = showCar;
    vm.showCount = showCount;
    vm.print = print;
    vm.hasPermission = false;
    vm.ismanager = false;
    vm.isSuper = false;
    vm.informalRule = '';
    var ids = [];
    //获取最新的小铃铛
    vm.getD=getD;
	    function getD(){
	    	$.ajax({
	    		type:"POST",
	    		url:'/api/pactl/scheck/toBeSubmitted',
	    		async:false,
	    		dataType:'json',
	    		success:function(data){
	    		ipCookie("xiaoLD","1");
	    		if(data.data.eWaybill){
	    			vm.showpicture=true;
	    			vm.xianshi=true;
	    			vm.listNumber=data.data.eWaybill;	    			
	    			if(Auth.getUnitType()=='agency'){
	    				ipCookie("xiaoLD","0")
	    				console.log(11)
	    			}
	    		}
	    		}
	    	})
	    };
    getIsManager();

    function getIsManager() {
      var user = Auth.getUser();
      restAPI.saleAgent.queryUserIsManager.get({
          deptId: user.myunit,
          userid: user.userid
        }, {})
        .$promise.then(function (resp) {
        	
          if (resp.result == "1") {
            vm.ismanager = true;
          } else {
            vm.ismanager = false;
          }
          if(resp.isSuper == "1") {
            vm.isSuper = true;
          } else {
            vm.isSuper = false;
          }
          getPermission();
        });
    }

    function getPermission() {
      $rootScope.loading = true;
      restAPI.permission.getPermission.query({
        tokens: Auth.getUser().token,
        unitid: Auth.getUser().unit,
        resId: '888002'
      }, {})
        .$promise.then(function (resp) {
        	
          $rootScope.loading = false;
          if (resp && resp.length && resp.length > 0) {
            var res = resp[0];
            if (res.resId === '888002') {
              if(vm.ismanager) {
                vm.hasPermission = true;
              }
            } else {
              vm.hasPermission = true;
            }
          } else {
            vm.hasPermission = true;
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
        });
    }

    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      vm.operation.wbFocus = $stateParams.wbFocus === 'true' ? true : false;
      vm.operation.littleTask = $stateParams.littleTask === 'true' ? true : false;
      vm.operation.detainIn24H = $stateParams.detainIn24H === 'true' ? true : false;
      vm.operation.wbEle = $stateParams.wbEle === 'true' ? true : false;
      vm.operation.wbEle1 = $stateParams.wbEle1 === 'true' ? true : false;
      wStatus();
    }
    /**
     * 获取所有的运单状态
     */
    function wStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314336069737'
        })
        .$promise.then(function (resp) {
        	
          $rootScope.loading = false;
          vm.waybillDatas = resp.rows;
          var wStatus = $stateParams.wStatus;
          if (wStatus) {
            angular.forEach(vm.waybillDatas, function (v, k) {
            for(var i in wStatus){
              if (v.id === wStatus[i]) {
                v.checked = true;
              }
              }
            });
          }
          aStatus();
        });
    }
    /**
     * 获取所有的安检状态
     */
    function aStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314998540410'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.aDatas = resp.rows;
          search();
          getAirData();
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          getAgentSales();
        });
    }
    /**
     * 
     * 根据参数查询机场数据
     * 
     * @param {any} param
     */
    function refreshDest(param) {
      var searchObj = {};
      vm.airportData = [];
      if (param) {
        searchObj = {
          airportCode: param
        };
      } else {
        searchObj = {
          airportCode: param,
          isCommon: '1'
        };
      }
      restAPI.airPort.queryList.save({}, searchObj)
        .$promise.then(function (resp) {
          vm.airportData = resp.rows;
        });
    }
    /**
     * 获取目的港（机场）
     */
    function getAirportData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airportData = resp.data;
        });
    }
    /**
     * 获取所有的子账户
     */
    function getAgentSales() {
      restAPI.agent.saleAgents.query({
          id: Auth.getUnitId()
        }, {})
        .$promise.then(function (resp) {
          vm.salesData = [];
          var unitId = Auth.getUnitId() + '';
          var myUnitId = Auth.getMyUnitId() + '';
          if (unitId !== myUnitId) {
            angular.forEach(resp || [], function (v, k) {
              if (v.id === +unitId) {
                vm.salesData.push(v);
              }
            });
          } else {
            vm.salesData = resp || [];
          }
        });
    }
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.preJudice.queryOperation.save({}, obj)
        .$promise.then(function (resp) {
        	console.log(resp)
          $rootScope.loading = false;
          vm.operation.allselected = false;
          vm.opData = [];
          vm.rowCollection = resp.rows;
          vm.totalObj.packages = 0;
          vm.totalObj.weight = 0;
          angular.forEach(resp.rows, function (v, k) {
            vm.totalObj.packages += v.pAirWaybillInfo.rcpNo || 0;
            vm.totalObj.weight += v.pAirWaybillInfo.grossWeight || 0;
            (vm.totalObj.weight + '').indexOf('.') > -1 ? (vm.totalObj.weight).toFixed(2) : vm.totalObj.weight;
            v.evenClass = k % 2;
            vm.opData.push(v);
            angular.forEach(v.childWayBillList, function (m, n) {
              vm.opData.push({
                pAirWaybillInfo: m.info,
                pAirWaybillDifference: m.pAirWaybillDifference
              });
            });
            restAPI.waybill.progressChecklist.save({}, {
                awId: v.pAirWaybillInfo.awId
              })
              .$promise.then(function (resp) {
                if (resp.ok) {
                  v.progressObj = resp.data || {};
                }
              });
          });
          angular.forEach(vm.opData, function (x, y) {
            var maxwidth = 7;
            if (x.pAirWaybillInfo.goodsDesc) {
              if (x.pAirWaybillInfo.goodsDesc.length <= maxwidth) {
                x.pAirWaybillInfo.goodsDesc1 = x.pAirWaybillInfo.goodsDesc;
              } else {
                x.pAirWaybillInfo.goodsDesc1 = x.pAirWaybillInfo.goodsDesc.substring(0, maxwidth) + '**';
              }
              x.div = '<div class="pre-name" style="width:100%;word-break:break-all ">' + (x.pAirWaybillInfo.goodsDesc ? x.pAirWaybillInfo.goodsDesc : '') + '</div>';
            }
          });
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage,
        wStatus: [],
        aStatus: []
      };
      angular.forEach(vm.waybillDatas, function (v, k) {
        if (v.id === '401') {
          obj.shipmentFlag = v.checked ? '1' : '';
        } else {
          if (v.checked) {
            obj.wStatus.push(v.id);
          }
        }
      });
      angular.forEach(vm.aDatas, function (v, k) {
        if (v.checked) {
          obj.aStatus.push(v.id);
        }
      });
      if (vm.operation.fltCode) {
        obj.carrier1 = vm.operation.fltCode.airCode;
      }
      obj.flightNo = vm.operation.flightNo;
      obj.fltDate = vm.operation.fltDate;
      obj.fltDate1 = vm.operation.fltDate1;
      
      if (vm.operation.dest1) {
        obj.airportDest = vm.operation.dest1.airportCode;
      }
      obj.waybillNo = vm.operation.waybillNo;
      obj.subwaybillNo = vm.operation.subwaybillNo;
      obj.agentSalesId = vm.operation.agentSales ? vm.operation.agentSales.id + '' : '';
      obj.returnFlag = vm.operation.returnFlag ? '1' : '';
      obj.wbEle = vm.operation.wbEle ? '1' : '';
      obj.wbEle1 = vm.operation.wbEle1 ? '1' : '';
      obj.wbFocus = vm.operation.wbFocus ? '1' : '';
      obj.littleTask = vm.operation.littleTask ? '1' : '';
      obj.detainIn24H = vm.operation.detainIn24H ? '1' : '';
      obj.approachFlag = vm.operation.approachFlag ? '1' : '';
      obj.localeCheckFlag = vm.operation.localeCheckFlag ? '1' : '';
      obj.wStatus = obj.wStatus.join(';');
      obj.aStatus = obj.aStatus.join(';');
      if (obj.aStatus.length > 0 && !vm.operation.aFlag) {
        obj.aFlag = '0';
      } else {
        obj.aFlag = vm.operation.aFlag ? '1' : '';
      }
      if (vm.sortObj && vm.sortObj.name && vm.sortObj.sort) {
        obj.orderBy = vm.sortObj.name + " " + vm.sortObj.sort;
      }
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      vm.operation.allselected = false;
      selected = [];
      selectedMasterAwId = [];
      Page.pageChanged(vm.page, search);
    }
    /**
     * 显示子单
     */
    function showSub(param) {
      if (vm.operation.main) {
        return false;
      }
      var index = selectedAwd.indexOf(param.pAirWaybillInfo.awId);
      var index1 = vm.opData.indexOf(param);
      var awId = param.pAirWaybillInfo.awId;
      if (index > -1) {
        angular.forEach(vm.opData, function (v, k) {
          if (v.pAirWaybillInfo.parentNo === awId) {
            delete v.pAirWaybillDetails;
          }
        });
        selectedAwd.splice(index, 1);
      } else {
        selectedAwd.push(awId);
        angular.forEach(vm.opData, function (v, k) {
          if (v.pAirWaybillInfo.parentNo === awId) {
            v.pAirWaybillDetails = [];
          }
        });
      }
    }
    /**
     * 关注
     */
    function doFocus(params) {
      $rootScope.loading = true;
      restAPI.preJudice.focus.save({}, {
          awId: params.pAirWaybillInfo.awId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (params.pAirWaybillFocus) {
              params.pAirWaybillFocus = null;
            } else {
              params.pAirWaybillFocus = {};
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 是否显示小三角符号
     */
    function showCert(item) {
      if (item.pAirWaybillInfo.parentNo) {
        return false;
      }
      if (item.pAirWaybillDetails && item.pAirWaybillDetails.length === 0) {
        return false;
      }
      return true;
    }
    /**
     * 先校验再跳转
     */
    function goToPre(awId, billNo) {
      $rootScope.loading = true;
      restAPI.bill.billAudit2.save({}, {
          awId: awId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            window.open($state.href('agentPrejudice.pre', {
              awId: awId
            }));
          } else {
            window.open($state.href('agentWaybill.newMasterBill', {
              billNo: billNo
            }));
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 检测是否选中
     */
    function isChecked(id) {
      return selected.indexOf(id) != -1;
    }

    /**
     * 全选事件
     */
    function allCheck($e) {
      var checkbox = $e.target,
        checked = checkbox.checked;
      selected = [];
			 ids = [];
      selectedMasterAwId = [];
      angular.forEach(vm.rowCollection, function (v, k) {
        v.checked = checked;
        if (checked) {
          selected.push(v.pAirWaybillInfo.waybillNo);
          selectedMasterAwId.push(v.pAirWaybillInfo.awId);
          ids.push( v.pAirWaybillInfo.awId)
        }
      });
      vm.operation.allselected = checked;
    }
    /**
     * 单选
     */
    function singleCheck($e, data) {
    	
      var checkbox = $e.target,
        id = data.waybillNo,
        index = selected.indexOf(id);
      data.checked = checkbox.checked;
      data.checked ? selected.push(id) : selected.splice(index, 1);
      data.checked ? selectedMasterAwId.push(data.awId) : selectedMasterAwId.splice(index, 1);
      vm.operation.allselected = (selected.length === vm.rowCollection.length);
      data.checked ? ids.push(data.awId) : ids.splice(index, 1);
      vm.operation.allselected = (ids.length === vm.rowCollection.length);
    }
    /**
     * 打印运单
     */
    function print(type) {
      if (selectedMasterAwId.length == 0) {
        Notification.error({
          message: '未勾选运单！'
        });
      } else {
        window.open($state.href('awb', {
          billNo: JSON.stringify(selectedMasterAwId),
          type: type
        }));
      }
    }
    /****生成
     * 条形码
     * ****/
    function barCode(){
    	if(selected.length>0){
    		var printCode1 = selected.join(';')
      	 var printCode = ids.join(';');
      var urlHref = $state.href('agentPrejudice.barCode', {
      	  'printCode1':printCode1,
        'printCode': printCode
      
      });
      window.open(urlHref);
//      })
    	}else{
    		Notification.error({
          message: '未勾选运单！'
        });
    	}
    }
    /**
     * 出运信息
     */
    function info() {
      if (selected.length > 0) {
        var infoDialog = $modal.open({
          template: require('./info.html'),
          controller: require('./info.ctrl.js'),
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '请选择右侧的主运单号进行信息查询',
                waybillList: selected
              };
            }
          }
        });
      } else {
        Notification.error({
          message: '未勾选运单！'
        });
      }
    }
    /**
     * 获取进度
     */
    function showProgress(awId, item, $e) {
      item.isShow = true;
    }

    function showWbEle(awId, item, $e) {
      item.isShowWbEle = true;
    }

    function showCar(awId, item, $e) {
      item.isShowCar = true;
    }

    function showCount(awId, item, $e) {
      item.isShowCount = true;
    }

  }
];

module.exports = angular.module('app.agentPrejudice.operation', []).controller('operationCtrl', operation_fn);