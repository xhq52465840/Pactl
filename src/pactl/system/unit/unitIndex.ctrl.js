'use strict';

module.exports = ['$scope', '$state',
  function ($scope, $state) {
    var vm = $scope;
    vm.showNav = true;
    vm.nav = nav;
    vm.$state = $state;
    
    /**
     * 显示或隐藏菜单栏
     */
    function nav() {
      vm.showNav = !vm.showNav;
    }
  }
];