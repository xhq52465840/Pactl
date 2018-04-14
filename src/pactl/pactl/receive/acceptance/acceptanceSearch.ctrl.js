'use strict';

module.exports = ['$scope', 'restAPI', '$rootScope', 'Notification', '$state',
  function ($scope, restAPI, $rootScope, Notification, $state) {
    var vm = $scope;
    vm.billObj = {}
    vm.search = search;
    vm.showSearch = showSearch;
    vm.showResult = false;

    /**
     * 查询
     */
    function search() {
      if (valid('srh')) {
        $rootScope.loading = true;
        restAPI.bill.billList.save({}, {
          waybillNo: vm.billObj.srh_code + vm.billObj.srh_no
        }).$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.total) {
            $state.go('index');
          } else {
            vm.showResult = true;
          }
        });
      }
    }
    /**
     * 校验数据
     * 
     */
    function valid(type) {
      if (vm.billObj.srh_code && vm.billObj.srh_no) {
        return true;
      } else {
        Notification.error({
          message: '请填写运单号'
        });
        return false;
      }
    }
    /**
     * 回到查询
     */
    function showSearch() {
      vm.showResult = false;
      vm.billObj = {};
    }
  }
];