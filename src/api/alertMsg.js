'use strict';

module.exports = ['$rootScope', '$timeout',
  function ($rootScope, $timeout) {
    $rootScope.alerts = [];
    $rootScope.closeAlert = function (index) {
      $rootScope.alerts.splice(index, 1);
    };
    return function (data) {
      if (data) {
        $rootScope.alerts.push(data);
      }
    };
  }
];