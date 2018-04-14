'use strict';

module.exports = ['$scope', '$rootScope', '$modalInstance', '$modal', 'items', 'restAPI', 'Page',
  function ($scope, $rootScope, $modalInstance, $modal, items, restAPI, Page) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.insideSearch = insideSearch;
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();
    vm.select = select;
    vm.showMsg = showMsg;
    vm.waybillData - [];
    vm.title = items.title;
    var params = items.params;

    search();

    /**
     * 查看
     */
    function select(data) {

    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 查询
     */
    function search() {
      if (params === '0') {
        masterSearch();
      } else if (params === '1') {
        subSearch();
      }
    }
    /**
     * 分页变化
     */
    function insideSearch() {
      search();
    }

    function masterSearch() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.mainWaybill.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.waybillData = resp.data || [];
          angular.forEach(vm.waybillData, function (v, k) {
            if (v.operationName === '收单报文' || v.operationName === '发送报文') {
              v.oprnType = JSON.parse(v.oprnType);
            }
          });
          var resp = {
            rows: vm.waybillData,
            total: vm.waybillData.length
          };
          vm.showItem = {
            start: (vm.page.currentPage - 1) * vm.page.length - 1,
            end: vm.page.currentPage * vm.page.length
          };
          Page.setPage(vm.page, resp);
        });
    }

    function subSearch() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.subWaybill.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.waybillData = resp.data || [];
          angular.forEach(vm.waybillData, function (v, k) {
            if (v.operationName === '收单报文' || v.operationName === '发送报文') {
              v.oprnType = JSON.parse(v.oprnType);
            }
          });
          var resp = {
            rows: vm.waybillData,
            total: vm.waybillData.length
          };
          vm.showItem = {
            start: (vm.page.currentPage - 1) * vm.page.length - 1,
            end: vm.page.currentPage * vm.page.length
          };
          Page.setPage(vm.page, resp);
        });
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
        awId: items.awId,
        operationLink: "OPERATION_AGENT_TRIAL"
        // rows: vm.page.length,
        // page: vm.page.currentPage
      };
      return obj;
    }
    /**
     * 显示报文信息
     */
    function showMsg(params) {
      var msgDialog = $modal.open({
        template: require('./showMsg.html'),
        controller: require('./showMsg.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '报文信息',
              content: params.oprnType ? params.oprnType : params.messageContent
            };
          }
        }
      });
      msgDialog.result.then(function () {

      }, function () {

      });
    }
  }
];