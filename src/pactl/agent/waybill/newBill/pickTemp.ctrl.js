'use strict';

module.exports = ['$scope', '$rootScope', '$modalInstance', 'items', 'restAPI', 'Page',
  function ($scope, $rootScope, $modalInstance, items, restAPI, Page) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.select = select;
    vm.search = search;
    vm.tempObj = items.obj;
    vm.tempData - [];
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
      getTempData();
    }
    /**
     * 获取模板数据
     */
    function getTempData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.billTempList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.tempData = resp.rows;
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
      obj.labelName = vm.tempObj.labelName;
      obj.type = vm.tempObj.type;
      obj.agentCode = items.agentCode;
      return obj;
    }
  }
];