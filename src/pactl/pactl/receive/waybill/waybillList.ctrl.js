'use strict';

var waybillList_fn = ['$scope', '$rootScope', 'restAPI', 'Page','$state',
  function ($scope, $rootScope, restAPI, Page,$state) {
    var vm = $scope;
    var selected = [];
    vm.aDatas = [];
    vm.airData = [];
    vm.airportData = [];
    vm.agentSalesData = [];
    vm.billObj = {};
    vm.billObj.station = [];
    vm.billData = [];
    vm.search = search;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.printSub = printSub;
    vm.wDatas = [];
    vm.stationData = [];
    vm.allCheck = allCheck;
    vm.isChecked = isChecked;
    vm.singleCheck = singleCheck;
    vm.refreshDest = refreshDest;
    vm.totalObj = {
      packages: 0,
      weight: 0
    };
    vm.print = print;
    vm.selectStation = selectStation;
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
          getStationData();
        });
    }
    /**
     * 获取货站
     */
    function getStationData() {
      $rootScope.loading = true;
      restAPI.cargoStation.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.stationData = resp.data;
          getAgentData();
        });
    }

    search();

    /**
     * 获取操作代理
     */
    function getAgentData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentSalesData = resp;
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
          wStatus();
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
     * 获取所有的运单状态
     */
    function wStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314336069737'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp.rows || [], function (v, k) {
            if (v.id !== '401') {
              vm.wDatas.push(v);
            }
          });
          aStatus();
        });
    }

    /**
     * 货站选择
     */
    function selectStation($e, data) {
      var checkbox = $e.target,
        index = vm.billObj.station.indexOf(data);
      checkbox.checked ? vm.billObj.station.push(data) : vm.billObj.station.splice(index, 1);
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
          		vm.aDatas.push(v)
          	}
          })
        });
    }
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.list.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.billData = resp.rows;
          // vm.totalObj.packages = 0;
          vm.totalObj.weight = 0;
          angular.forEach(vm.billData, function (v, k) {
            // vm.totalObj.packages += +v.rcpNo || 0;
            // vm.totalObj.weight += v.grossWeight || 0;
            // (vm.totalObj.weight + '').indexOf('.') > -1 ? (vm.totalObj.weight).toFixed(2) : vm.totalObj.weight;
            var maxwidth = 7;
            if (v.goodsDesc) {
              if (v.goodsDesc.length <= maxwidth) {
                v.goodsDesc1 = v.goodsDesc;
              } else {
                v.goodsDesc1 = v.goodsDesc.substring(0, maxwidth) + '**';
              }
              v.div = '<div class="pre-name" style="width:100%;word-break:break-all ">' + (v.goodsDesc ? v.goodsDesc : '') + '</div>';
            }
          });
          Page.setPage(vm.page, resp);
          countAll();
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      obj.fltDateList = [];
      obj.prefix = vm.billObj.srh_code ? vm.billObj.srh_code : '';
      obj.waybillNo = vm.billObj.srh_no ? vm.billObj.srh_no : '';
      obj.agentOprnId = vm.billObj.agentSales ? vm.billObj.agentSales.id : '';
      obj.flightNo = vm.billObj.flightNo;
      obj.fltDateList.push(vm.billObj.fltDate || '');
      vm.billObj.wStatus && (obj.wStatus = vm.billObj.wStatus.id);
      vm.billObj.aStatus && (obj.aStatus = vm.billObj.aStatus.id);
      vm.billObj.dest && (obj.dest = vm.billObj.dest.airportCode);
      obj.billReturnFlag = vm.billObj.billReturnFlag ? '1' : '';
      obj.aFlag = vm.billObj.aFlag ? '1' : '';
      obj.returnFlag = vm.billObj.returnFlag ? '1' : '';
      obj.wbEle = vm.billObj.wbEle ? '1' : '';
      obj.shipmentFlag = vm.billObj.shipmentFlag ? '1' : '';
      obj.approachFlag = vm.billObj.approachFlag ? '1' : '';
      obj.localeCheckFlag = vm.billObj.localeCheckFlag ? '1' : '';
      obj.goodstation = vm.billObj.station.join(';');
      return obj;
    }
    /*
     *计算数量
     */
    function countAll() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.countAll.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.totalObj.packages = resp.data.rcpNo;
          vm.totalObj.weight = resp.data.grossWeight;
        });
    }
    /**
     * 全选事件
     */
    function allCheck($e) {
      var checkbox = $e.target,
        checked = checkbox.checked;
      selected = [];
      angular.forEach(vm.billData, function (v, k) {
        v.checked = checked;
        if (checked) {
          selected.push(v.awId);
        }
      });
      vm.billObj.allselected = checked;
    }
    /**
     * 检测是否选中
     */
    function isChecked(id) {
      return selected.indexOf(id) != -1;
    }
    /**
     * 单选
     */
    function singleCheck($e, data) {
      var checkbox = $e.target,
        id = data.awId,
        index = selected.indexOf(id);
      data.checked = checkbox.checked;
      data.checked ? selected.push(id) : selected.splice(index, 1);
      vm.billObj.allselected = (selected.length === vm.billData.length);
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 打印运单
     */
    function print(type) {
      if (selected.length == 0) {
        Notification.error({
          message: '未勾选运单！'
        });
      } else {
        window.open($state.href('awb', {
          billNo: JSON.stringify(selected),
          type: type
        }));
      }
    }
    /**
     * 打印分单清单
     */
    function printSub() {
      if (selected.length == 0) {
        Notification.error({
          message: '未勾选运单！'
        });
      } else {
        window.open($state.href('pactlPrejudice.sublist', {
          waybillNo: JSON.stringify(selected)
        }));
      }
    }

    $scope.$watch('billObj.srh_code', function (newVal, oldVal) {
      if (newVal) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length < 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
        } else if (newVal.length === 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          angular.element('#srh_no').focus();
        } else if (newVal.length > 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          $scope.billObj.srh_no = newVal.substr(3);
          angular.element('#srh_no').focus();
        }
      }
    });
    $scope.$watch('billObj.srh_no', function (newVal, oldVal) {
      if (angular.isString(newVal)) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length) {
          $scope.billObj.srh_no = newVal.substr(0, 8);
        } else {
          if (oldVal && oldVal.length > 0 && newVal.length === 0) {
            angular.element('#srh_code').focus();
          } else {
            $scope.billObj.srh_no = newVal;
          }
        }
      }
    });

  }
];

module.exports = angular.module('app.pactlReceive.waybillList', []).controller('waybillListCtrl', waybillList_fn);