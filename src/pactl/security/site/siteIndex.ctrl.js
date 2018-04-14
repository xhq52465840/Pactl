'use strict';

module.exports = ['$scope', 'restAPI','$state','Auth',
  function ($scope,restAPI,$state,Auth) {
    var vm = $scope;
    vm.showNav = true;
    vm.nav = nav;
    vm.ismanager = false;
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