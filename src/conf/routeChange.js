'use strict';

var change = ['$rootScope', 'Auth', '$location', '$state', 'restAPI', '$document', '$window',
  function ($rootScope, Auth, $location, $state, restAPI, $document, $window) {
    $rootScope.account = Auth.getUser() && Auth.getUser().account || '';
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
      if (toState.name !== 'login') {
        if (!Auth.isLoggedIn()) {
          event.preventDefault();
          $rootScope.logout();
        } else {
          var data = $window.sessionStorage.getItem('menuList');
          try {
            data = JSON.parse(data);
          } catch (error) {
            data = [];
          }
          if (toState.access_url !== 'pactlPrejudice.sublist' && angular.isArray(data) && data.indexOf(toState.access_url) < 0) {
            event.preventDefault();
            $state.go('index');
          }
        }
      }
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
      if (toState.name === 'index') {
        if (Auth.getUnitType() === 'agency') {
          $state.go('index.indexA');
        } else if (Auth.getUnitType() === 'terminal') {
          $state.go('index.indexB');
        } else if (Auth.getUnitType() === 'security') {
          $state.go('index.indexC');
        } else if (Auth.getUnitType() === 'airline') {
          $state.go('index.indexD');
        }
      }
    });
    $rootScope.logout = function () {
      $rootScope.loading = true;
      restAPI.logout.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          Auth.logout();
          $state.go('login');
        });
    }
    $document.on('keypress', function (event) {
      var keyCode = event.keyCode || event.which;
      if (Auth.getUnitType() === 'terminal' && event.ctrlKey && keyCode === 81) {
        $rootScope.$broadcast('to-head', 'child');
      }
    });
  }
];

module.exports = change;