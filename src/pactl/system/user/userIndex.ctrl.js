'use strict';

module.exports = ['$scope', 
  function ($scope) {
    var vm = $scope;
    vm.showNav = true;
    vm.nav = nav;

    /**
     * 显示或隐藏菜单栏
     */
    function nav() {
      vm.showNav = !vm.showNav;
    }
  }
];