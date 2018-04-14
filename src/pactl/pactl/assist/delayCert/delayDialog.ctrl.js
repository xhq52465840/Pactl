'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', 'Page',
  function ($scope, $modalInstance, restAPI, items, Page) {
    var vm = $scope;
    var airLines = angular.copy(items.airLines);
    var pAirLineDelays = angular.copy(items.pAirLineDelays);
    vm.cancel = cancel;
    vm.delayData = [];
    vm.save = save;
    vm.insideSearch = insideSearch;
    vm.title = items.title;
    vm.showItem = {
      start: 0,
      end: 0
    };
    vm.showDelayData = showDelayData;
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();

    setData();

    function showDelayData() {
      var resp = {
        rows: vm.delayData,
        total: vm.delayData.length
      };
      vm.showItem = {
        start: (vm.page.currentPage - 1) * vm.page.length - 1,
        end: vm.page.currentPage * vm.page.length
      };
      Page.setPage(vm.page, resp);
    }

    /**
    * 翻页
    */
    function pageChanged() {
      Page.pageChanged(vm.page, showDelayData);
    }
		/**
		 * 分页变化
		 */
    function insideSearch() {
      showDelayData();
    }
    /**
     * 显示延期数据
     */
    function setData() {
      angular.forEach(airLines, function (v, k) {
        v.days = '';
        for (var index = 0; index < pAirLineDelays.length; index++) {
          var element = pAirLineDelays[index];
          if (element.airCode === v.airCode) {
            v.days = element.days;
          }
        }
        vm.delayData.push(v);
      });
      showDelayData();
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.delayData);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];