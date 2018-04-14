'use strict';

module.exports = ['$rootScope','$scope', '$state','Auth','restAPI','$stateParams',
  function ($rootScope,$scope, $state,Auth,restAPI,$stateParams) {
    var vm = $scope;
    vm.showNav = true;
    vm.nav = nav;
    vm.$state = $state;
    vm.$stateParams = $stateParams;
    vm.list = [];
    vm.showReport = showReport;

    getReportsList();

    /**
     * 获取报表列表
     */
    function getReportsList() {
      $rootScope.loading = true;
      restAPI.report.getList.query({
          tokens: Auth.getUser().token,
          unitid: Auth.getUser().unit
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.list = [];
          if(resp && resp.length && resp.length>0) {
            vm.list = resp;
          }
        });
    }

    function showReport(usr,resName) {
      vm.$state.go("reports.statement({url:"+usr+",resName:"+resName+"})");
    }

    /**
     * 显示或隐藏菜单栏
     */
    function nav() {
      vm.showNav = !vm.showNav;
    }
  }
];