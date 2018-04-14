'use strict';

var reCheckList_fn = ['$scope', 'Page', 'restAPI', '$modal', '$rootScope', '$state',
  function ($scope, Page, restAPI, $modal, $rootScope, $state) {
    var vm = $scope;
    vm.back = back;
    vm.checkData = [];
    vm.goodTypeData = [{
      id: '0',
      name: '普货'
    }, {
      id: '1',
      name: '危险品'
    }, {
      id: '2',
      name: '24小时货'
    }];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.showRemark = showRemark;

    search();

    /**
     * 查询
     */
    function search() {
      getCheckData();
    }
    /**
     * 获取待复检数据
     */
    function getCheckData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.reCheck.waitList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.checkData = resp.rows;
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
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 返回
     */
    function back() {
      $state.go('securityItem.reCheck');
    }
    /**
     * 备注
     */
    function showRemark(param) {
      var remarkDialog = $modal.open({
        template: require('./showRemarkDialog.html'),
        controller: require('./remarkDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              awId: param.awId
            };
          }
        }
      });
    }
  }
];

module.exports = angular.module('app.securityItem.reCheckList', []).controller('reCheckListCtrl', reCheckList_fn);