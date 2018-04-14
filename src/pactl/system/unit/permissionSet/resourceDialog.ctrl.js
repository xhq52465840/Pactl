'use strict';

module.exports = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope','$modalInstance','items',
function ($scope, Page, restAPI, $modal, Notification, $rootScope,$modalInstance,items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.resourceObj = {};
    vm.resourceData = [];
    vm.resourceType = [{ id: 'M', name: '菜单' }, { id: 'P', name: '权限' }, { id: 'R', name: '报表' }];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getResourceData();
    }
    /**
     * 获取资源管理数据
     */
    function getResourceData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.resmanage.pageRes.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.resourceData = resp.data;
          angular.forEach(vm.resourceData, function (v,k){
            if (v.resType) {
              if (v.resType == 'M') {
                v.resType = vm.resourceType[0];
              } else if (v.resType == 'P') {
                v.resType = vm.resourceType[1];
              } else if (v.resType == 'R') {
                v.resType = vm.resourceType[2];
              }
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
        length: vm.page.length,
        start: vm.page.start,
        rule: []
      };
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      angular.forEach(vm.resourceObj, function (v, k) {
        obj.rule.push([{
          key: k,
          op: 'like',
          value: v
        }]);
      });
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }


    /**
     * 保存
     */
    function save(item) {
      $modalInstance.close(item);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];