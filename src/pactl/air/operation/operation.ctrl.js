'use strict';
var operation_fn = ['$scope', 'Page', '$rootScope', 'restAPI', '$stateParams', 'Notification', '$state',
  function ($scope, Page, $rootScope, restAPI, $stateParams, Notification, $state) {
    var vm = $scope;
    var selected = [];
    var selectedAwd = [];
    var selectedMasterAwId = [];
    vm.airportData = [];
    vm.doFocus = doFocus;
    vm.operation = {};
    vm.refreshDest = refreshDest;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.showCert = showCert;
    vm.showSub = showSub;
    vm.print = print;
    vm.aDatas1 = [];
    vm.allselected = false;
    vm.isChecked = isChecked;
    vm.singleCheck = singleCheck;
    vm.allCheck = allCheck;
    vm.getFlightNo = getFlightNo;
    vm.totalObj = {
      packages: 0,
      weight: 0
    };
    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      vm.operation.wbFocus = $stateParams.wbFocus === 'true' ? true : false;
      vm.operation.littleTask = $stateParams.littleTask === 'true' ? true : false;
      vm.operation.wbFocus = $stateParams.wbFocus === 'true' ? true : false;
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
              if (v.id === wStatus) {
                v.checked = true;
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
          angular.forEach(resp.rows,function(v,k){
          	if(v.name!='首检待定'&&v.name!='首检通过'){
          		vm.aDatas1.push(v)
          	}
          })
          vm.aDatas = vm.aDatas1;
          getAgentData();
        });
    }
    /**
     * 获取操作代理
     */
    function getAgentData($data) {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentSalesData = resp;
          search();
        });
    }
    /**
     * 获取航班号
     */
    function getFlightNo(data) {
      restAPI.airline.queryFlightNo.get({}, {})
        .$promise.then(function (resp) {
          vm.flightNoData = resp.data;
        });
    }
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.airline.queryAll.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.opData = [];
          vm.rowCollection = resp.rows;
          vm.totalObj.packages = 0;
          vm.totalObj.weight = 0;
          angular.forEach(resp.rows, function (v, k) {
            vm.totalObj.packages += v.pAirWaybillInfo.rcpNo || 0;
            vm.totalObj.weight += v.pAirWaybillInfo.grossWeight || 0;
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
      obj.wStatus = obj.wStatus.join(';');
      obj.aStatus = obj.aStatus.join(';');
      if (vm.sortObj && vm.sortObj.name && vm.sortObj.sort) {
        obj.orderBy = vm.sortObj.name + " " + vm.sortObj.sort;
      }
      obj.flightNo = vm.operation.flightNo;
      obj.fltDate = vm.operation.fltDate;
      obj.agentOprnId = vm.operation.agentSales ? vm.operation.agentSales.id + '' : '';
      obj.dest = vm.operation.dest ? vm.operation.dest.airportCode : '';
      obj.waybillNo = vm.operation.waybillNo;
      obj.aFlag = vm.operation.aFlag ? '1' : '';
      obj.returnFlag = vm.operation.returnFlag ? '1' : '';
      obj.wbEle = vm.operation.wbEle ? '1' : '';
      obj.wbFocus = vm.operation.wbFocus ? '1' : '';
      obj.littleTask = vm.operation.littleTask ? '1' : '';
      obj.approachFlag = vm.operation.approachFlag ? '1' : '';
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
     * 显示子单
     */
    function showSub(param) {
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
      selectedMasterAwId = [];
      angular.forEach(vm.rowCollection, function (v, k) {
        v.checked = checked;
        if (checked) {
          selected.push(v.pAirWaybillInfo.waybillNo);
          selectedMasterAwId.push(v.pAirWaybillInfo.awId);
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
  }
];
module.exports = angular.module('app.airOperation', []).controller('airOperationCtrl', operation_fn);