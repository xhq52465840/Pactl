'use strict';

var house_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', 'Auth', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, Auth, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.airportData = [];
    vm.billObj = {};
    vm.billData = [];
    vm.connect = connect;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.reset = reset;
    vm.salesData = [];
    vm.search = search;
    vm.statusData = [{
      id: '',
      name: '全部',
    }, {
      id: 'Y',
      name: '已关联',
    }, {
      id: 'N',
      name: '未关联',
    }];
    vm.refreshDest = refreshDest;

    getAgentSales();

    /**
     * 获取所有的销售代理
     */
    function getAgentSales() {
      $rootScope.loading = true;
      restAPI.agent.saleAgents.query({
          id: Auth.getUnitId()
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
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
          search();
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
     * 查询
     */
    function search() {
      getBillData();
    }
    /**
     * 获取分单数据
     */
    function getBillData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.subBill.billList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.billData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 新建分单
     */
    function add() {
      $state.go('agentWaybill.newBill');
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      if (vm.billObj.parentNoFlag) {
        obj.parentNoFlag = vm.billObj.parentNoFlag.id;
      }
      if (vm.billObj.parentNo) {
        obj.parentNo = vm.billObj.parentNo;
      }
      if (vm.billObj.waybillNo) {
        obj.waybillNo = vm.billObj.waybillNo;
      }
      if (vm.billObj.agentSales) {
        obj.agentSalesId = vm.billObj.agentSales.id;
      }
      if (vm.billObj.goodsDesc) {
        obj.goodsDesc = vm.billObj.goodsDesc;
      }
      if (vm.billObj.dest1) {
        obj.dest1 = vm.billObj.dest1.airportCode;
      }
      return obj;
    }
    /**
     * 重置查询条件
     */
    function reset() {
      vm.billObj = {};
    }
    /**
     * 关联主单
     */
    function connect(param) {
      var connectDialog = $modal.open({
        template: require('../newBill/connect.html'),
        controller: require('../newBill/connect.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '关联主单号',
              obj: {}
            };
          }
        }
      });
      connectDialog.result.then(function (data) {
        saveParent(param, data.awId);
      }, function (resp) {

      });
    }
    /**
     * 保存主分关联
     */
    function saveParent(param, id) {
      $rootScope.loading = true;
      restAPI.preJudice.disConnect.save({}, {
          awId: param,
          parentNo: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            search();
            Notification.success({
              message: '关联主运单成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除分单：' + name,
              content: '你将要删除分单' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.bill.delBill.save({}, {
            awId: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除分单成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
  }
];

module.exports = angular.module('app.agentWaybill.house', []).controller('houseCtrl', house_fn);