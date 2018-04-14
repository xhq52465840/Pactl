'use strict';

module.exports = ['$scope', '$state',
  function ($scope, $state) {
    var vm = $scope;
    vm.state = $state;
  }
];