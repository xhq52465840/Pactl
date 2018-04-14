'use strict';

module.exports = ['$scope', '$rootScope', '$modalInstance', 'items', 'restAPI', 'Page',
  function ($scope, $rootScope, $modalInstance, items, restAPI, Page) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.select = select;
    vm.nameObj = {};
    vm.nameData - [];
    vm.title = items.title;

    search();

    /**
     * 保存
     */
    function select(item) {
      $modalInstance.close(item);
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
      getNameData();
    }
    /**
     * 获取名称数据
     */
    function getNameData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.people.peopleList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.nameData = resp.rows || [];
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
      obj.scType = items.type1;
      obj.awType = items.type2;
      obj.city = vm.nameObj.city;
      obj.code = vm.nameObj.code;
      obj.name = vm.nameObj.name;
      return obj;
    }
  }
];