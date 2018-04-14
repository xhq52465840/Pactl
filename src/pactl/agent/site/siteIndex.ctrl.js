'use strict';

module.exports = ['$scope','restAPI','Auth','$state', 
  function ($scope,restAPI,Auth,$state) {
    var vm = $scope;
    vm.showNav = false;
    vm.nav = nav;
    vm.ismanager = false;
    vm.isSuper = false;

    getIsManager();

    /**
     * 显示或隐藏菜单栏
     */
    function nav() {
      vm.showNav = !vm.showNav;
    }

    function getIsManager() {
      var user = Auth.getUser();
      restAPI.saleAgent.queryUserIsManager.get({
          deptId: user.myunit,
          userid: user.userid
        }, {})
        .$promise.then(function (resp) {
          if (resp.result == "1") {
            vm.ismanager = true;
            vm.showNav = true;
          } else {
            vm.ismanager = false;
            vm.showNav = false;
            $state.go('index');
          }
          if(resp.isSuper == "1") {
            vm.isSuper = true;
          } else {
            vm.isSuper = false;
          }
        });
    }
  }
];