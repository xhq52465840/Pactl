'use strict';

var applyList_fn = ['$scope', 'Page', 'restAPI', '$rootScope', '$modal', 'Auth', '$stateParams',
  function ($scope, Page, restAPI, $rootScope, $modal, Auth, $stateParams) {
    var vm = $scope;
    vm.aDatas = []
    vm.applyObj = {
      status: {
        id: '0',
        name: '未审核'
      }
    };
    vm.applyData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.salesData = [];
    vm.search = search;
    vm.statusData = [{
      id: '1',
      name: '审核完成'
    }, {
      id: '0',
      name: '未审核'
    }, {
      id: '2',
      name: '未提交'
    }];
    vm.wStatusDatas = [];
    vm.informalRule = '';

    vm.applyObj.change24H = $stateParams.change24H==='true' ? true : false;
    vm.applyObj.status = $stateParams.change24H==='true' ? null : vm.applyObj.status;
    getAllSales();

    /**
     * 获取所有的销售代理
     */
    function getAllSales() {
      $rootScope.loading = true;
      restAPI.agent.saleAgents.query({
          id: Auth.getUnitId()
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.salesData = resp;
          wStatus();
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
          vm.wStatusDatas = resp.rows;
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
          getInformalRule();
        });
    }  
    /**
     * 查询正式运单规则选项 
     */
    function getInformalRule(user,token,data) {
      $rootScope.loading = true;
      restAPI.systemSet.querySingleSet.save({},'informalRule')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length>0) {
            vm.informalRule = resp.data.regVal;
          }
          search();
        });
    }  
    /**
     * 查询
     */
    function search() {
      getApplyData();
    }
    /**
     * 获取审核数据
     */
    function getApplyData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.dataEdit.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.applyData = resp.rows;
          if (vm.applyData) {
            angular.forEach(vm.applyData, function (v, k) {
              if (v.commitFlag === '0') {
                v.showFlag = '2';
              } else {
                v.showFlag = v.reviewCommitFlag;
              }
            });
          }
          Page.setPage(vm.page, resp);
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
      obj.oprnType = 'agent';
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      obj.waybillNo = vm.applyObj.billNo;
      vm.applyObj.agent && (obj.agentSalesId = vm.applyObj.agent.id + '');
      if(vm.applyObj.status) {
        if(vm.applyObj.status.id === '0' || vm.applyObj.status.id ==='1') {
          obj.reviewCommitFlag = vm.applyObj.status.id
        } else if(vm.applyObj.status.id === '2') {
          obj.commitFlag = '0';
        }
      }
      vm.applyObj.startDate && (obj.startDate = vm.applyObj.startDate);
      vm.applyObj.endDate && (obj.endDate = vm.applyObj.endDate);
      obj.change24H = vm.applyObj.change24H ? '1' : '';
      
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
  }
];

module.exports = angular.module('app.agentPrejudice.applyList', []).controller('applyListCtrl', applyList_fn);