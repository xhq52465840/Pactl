'use strict';

var httpPro = ['$httpProvider',
  function($httpProvider) {
    var interceptor = ['$q', '$rootScope', 'ipCookie',
      function($q, $rootScope, ipCookie) {
        return {
          'request': function(req) {
            if (req.url.indexOf('sso/login') > -1 || req.url.indexOf('api/ddic') > -1 || req.url.indexOf('org/roles/grantPermissionSetsToRole') > -1 || req.url.indexOf('/system/set/query') > -1 || req.url.indexOf('/PreMailReminder/testSendMail') > -1) {
              req.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
            if (req.url.indexOf('/api/') > -1 && req.url.indexOf('sso/login') < 0) {
              if($rootScope.account && ipCookie('user') && ipCookie('user').account !== $rootScope.account) {
                window.location.href = '/';
              }
            }
            return req;
          },
          'response': function(resp) {
            return resp;
          },
          'responseError': function(rejection) {
            $rootScope.loading = false;
            switch (rejection.status) {
              case 400:
                $rootScope.$broadcast('resp-err', {
                  message: '请求无效 (Bad request)'
                });
                break;
              case 401:
                $rootScope.$broadcast('resp-err', {
                  message: '用户名或密码错误'
                });
                break;
              case 403:
                if (!$rootScope.errorTime) {
                  $rootScope.errorTime = 0;
                }
                $rootScope.errorTime++;
                if ($rootScope.errorTime > 0) {
                  if ($rootScope.errorTime === 1) {
                    $rootScope.$broadcast('resp-err', {
                      message: '登陆已过期，请重新登陆'
                    });
                  }
                  $rootScope.logout();
                }
                break;
              case 404:
                if (rejection.config.url !== '/api/wechat/wechat/qrcode/check') {
                  $rootScope.$broadcast('resp-err', {
                    message: '出错啦'
                  });
                }
                break;
              case 504:
                break;
              default:
                rejection.data && rejection.data.message && $rootScope.$broadcast('resp-err', {
                  message: rejection.data.message
                });
                break;
            };
            return $q.reject(rejection);
          }
        }
      }
    ];
    $httpProvider.interceptors.push(interceptor);
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  }
];
module.exports = httpPro;