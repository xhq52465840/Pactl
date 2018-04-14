'use strict';

module.exports = ['$scope', '$rootScope', '$modalInstance', 'items', 'restAPI', 'Page',
  function ($scope, $rootScope, $modalInstance, items, restAPI, Page) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.select = select;
    vm.search = search;
    vm.waybillObj = angular.copy(items.obj);
    vm.waybillData - [];
    vm.title = items.title;

    search();

    /**
     * 选择模板
     */
    function select(data) {
      $modalInstance.close(data);
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
      getBillData();
    }
    /**
     * 获取主运单数据
     */
    function getBillData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.billList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.waybillData = resp.rows || [];
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
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      obj.waybillNo = vm.waybillObj.waybillNo;
      obj.type = '0';
      obj.wStatus = '000;102'
      return obj;
    }
  }
];