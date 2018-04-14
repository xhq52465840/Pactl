'use strict';

var route = ['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when('/pactlSite', '/index');
    $urlRouterProvider.when('/agentSite', '/agentSite/saleagent');
    $urlRouterProvider.when('/securitySite', '/securitySite/securityuser');
    $urlRouterProvider.when('/agentWaybill', '/agentWaybill/masterBill');
    $urlRouterProvider.when('/pactlReceive', '/pactlReceive/acceptanceSearch');
    $urlRouterProvider.when('/airline', '/airline/airOperation');
    // $urlRouterProvider.when('/reports', '/reports');
    $urlRouterProvider.otherwise('/index');
    $stateProvider.state('login', {
      url: '/login',
      views: {
        main: {
          template: require('../pactl/login/login.html'),
          controller: require('../pactl/login/login.ctrl.js')
        }
      }
    });
    // awb
    $stateProvider.state('awb', {
      url: '/awb?billNo&type&awId',
      access_url: 'index',
      views: {
        main: {
          template: require('../pactl/index/awb/awb.html'),
          controller: require('../pactl/index/awb/awb.ctrl.js')
        }
      }
    });
    $stateProvider.state('index', {
        url: '/index',
        access_url: 'index',
        views: {
          main: {
            template: require('../pactl/index/index.html'),
            controller: require('../pactl/index/index.ctrl.js')
          }
        }
      })
      // 首页A
      .state('index.indexA', {
        url: '/indexA',
        access_url: 'index',
        views: {
          mainInfo: {
            template: require('../pactl/index/indexA/indexA.html'),
            controller: require('../pactl/index/indexA/indexA.ctrl.js')
          }
        }
      })
      // 首页B
      .state('index.indexB', {
        url: '/indexB',
        access_url: 'index',
        views: {
          mainInfo: {
            template: require('../pactl/index/indexB/indexB.html'),
            controller: require('../pactl/index/indexB/indexB.ctrl.js')
          }
        }
      })
      // 首页C
      .state('index.indexC', {
        url: '/indexC',
        access_url: 'index',
        views: {
          mainInfo: {
            template: require('../pactl/index/indexC/indexC.html'),
            controller: require('../pactl/index/indexC/indexC.ctrl.js')
          }
        }
      })
      // 首页D
      .state('index.indexD', {
        url: '/indexD',
        access_url: 'index',
        views: {
          mainInfo: {
            template: require('../pactl/index/indexD/indexD.html'),
            controller: require('../pactl/index/indexD/indexD.ctrl.js')
          }
        }
      });
    /************************************** 以下为pactl路由 ******************************************/
    // ---------------------------------------代理用户界面----------------------------------------------
    // 代理--运单
    $stateProvider.state('agentWaybill', {
        url: '/agentWaybill',
        views: {
          main: {
            template: require('../pactl/agent/waybill/waybillIndex.html'),
            controller: require('../pactl/agent/waybill/waybillIndex.ctrl.js')
          }
        }
      })
      // 代理--运单--主单制单
      .state('agentWaybill.masterBill', {
        url: '/masterBill',
        access_url: 'agentWaybill.masterBill',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/waybill/master/masterBill.html'),
            // controller: require('../pactl/agent/waybill/master/masterBill.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/waybill/master/masterBill.html');
                deferred.resolve(template);
              }, 'masterBill-tmp');
              return deferred.promise;
            }],
            controller: 'masterBillCtrl',
            resolve: {
              'app.agentWaybill.masterBill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/waybill/master/masterBill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentWaybill.masterBill'
                  });
                  deferred.resolve(mod);
                }, 'masterBill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--运单--新建主单制单
      .state('agentWaybill.newMasterBill', {
        url: '/newMasterBill?billNo',
        access_url: 'agentWaybill.masterBill',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/waybill/newBill/newMasterBill.html'),
            // controller: require('../pactl/agent/waybill/newBill/newMasterBill.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/waybill/newBill/newMasterBill.html');
                deferred.resolve(template);
              }, 'newMasterBill-tmp');
              return deferred.promise;
            }],
            controller: 'newMasterBillCtrl',
            resolve: {
              'app.agentWaybill.newMasterBill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/waybill/newBill/newMasterBill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentWaybill.newMasterBill'
                  });
                  deferred.resolve(mod);
                }, 'newMasterBill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--运单--分单查询
      .state('agentWaybill.house', {
        url: '/house',
        access_url: 'agentWaybill.house',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/waybill/house/houseBill.html'),
            // controller: require('../pactl/agent/waybill/house/houseBill.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/waybill/house/houseBill.html');
                deferred.resolve(template);
              }, 'house-tmp');
              return deferred.promise;
            }],
            controller: 'houseCtrl',
            resolve: {
              'app.agentWaybill.house': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/waybill/house/houseBill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentWaybill.house'
                  });
                  deferred.resolve(mod);
                }, 'house-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--运单--新建国际分单
      .state('agentWaybill.newBill', {
        url: '/newBill?awId',
        access_url: 'agentWaybill.house',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/waybill/newBill/newBill.html'),
            // controller: require('../pactl/agent/waybill/newBill/newBill.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/waybill/newBill/newBill.html');
                deferred.resolve(template);
              }, 'newBill-tmp');
              return deferred.promise;
            }],
            controller: 'newBillCtrl',
            resolve: {
              'app.agentWaybill.newBill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/waybill/newBill/newBill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentWaybill.newBill'
                  });
                  deferred.resolve(mod);
                }, 'newBill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
    // 代理--预审
    $stateProvider.state('agentPrejudice', {
        url: '/agentPrejudice',
        views: {
          main: {
            template: require('../pactl/agent/prejudice/prejudiceIndex.html')
          }
        }
     })
      // 代理--预审--综合操作
      .state('agentPrejudice.operation', {
        url: '/operation?wStatus&wbFocus&littleTask&detainIn24H&wbEle&wbEle1',
        access_url: 'agentPrejudice.operation',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/prejudice/operation/operation.html'),
            // controller: require('../pactl/agent/prejudice/operation/operation.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/operation/operation.html');
                deferred.resolve(template);
              }, 'operation-tmp');
              return deferred.promise;
            }],
            controller: 'operationCtrl',
            resolve: {
              'app.agentPrejudice.operation': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/operation/operation.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.operation'
                  });
                  deferred.resolve(mod);
                }, 'operation-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
          //代理--综合操作--
    .state('agentPrejudice.barCode',{
    	url:'/barCode?printCode&printCode1',
    	access_url: 'agentPrejudice.operation',
    	views:{
    		mainInfo:{
    			templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/operation/barCode.html');
                deferred.resolve(template);
              }, 'barCode-tmp');
              return deferred.promise;
            }],
            controller: 'barCodeCtrl', 
            resolve: {
              'app.agentPrejudice.barCode': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/operation/barCode.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.barCode'
                  });
                  deferred.resolve(mod);
                }, 'barCode-ctl');
                return deferred.promise;
              }]
            }
    		}
    	}
    })
      // 代理--预审--预审
      .state('agentPrejudice.pre', {
        url: '/pre?awId',
        access_url: 'agentPrejudice.operation',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/prejudice/operation/pre.html'),
            // controller: require('../pactl/agent/prejudice/operation/pre.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/operation/pre.html');
                deferred.resolve(template);
              }, 'pre-tmp');
              return deferred.promise;
            }],
            controller: 'preCtrl',
            resolve: {
              'app.agentPrejudice.pre': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/operation/pre.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.pre'
                  });
                  deferred.resolve(mod);
                }, 'pre-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--锂电池打印
      .state('agentPrejudice.print', {
        url: '/print?awId&waybillNo&lang',
        access_url: 'agentPrejudice.operation',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaraction.html');
                deferred.resolve(template);
              }, 'pre-print');
              return deferred.promise;
            }],
            controller: 'printBatteryDeclaractionCtrl',
            resolve: {
              'app.agentPrejudice.print': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaraction.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.print'
                  });
                  deferred.resolve(mod);
                }, 'printBatteryDeclaraction-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--锂电池打印--CA
      .state('agentPrejudice.printCA', {
        url: '/printCA?awId&waybillNo',
        access_url: 'agentPrejudice.operation',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaractionCA.html');
                deferred.resolve(template);
              }, 'pre-print');
              return deferred.promise;
            }],
            controller: 'printBatteryDeclaractionCACtrl',
            resolve: {
              'app.agentPrejudice.printCA': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaractionCA.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.printCA'
                  });
                  deferred.resolve(mod);
                }, 'printBatteryDeclaractionCA-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--锂电池打印--Y8
      .state('agentPrejudice.printY8', {
        url: '/printY8?awId&waybillNo&&lang',
        access_url: 'agentPrejudice.operation',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaractionY8.html');
                deferred.resolve(template);
              }, 'pre-print');
              return deferred.promise;
            }],
            controller: 'printBatteryDeclaractionY8Ctrl',
            resolve: {
              'app.agentPrejudice.printY8': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaractionY8.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.printY8'
                  });
                  deferred.resolve(mod);
                }, 'printBatteryDeclaractionY8-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--锂电池打印--QR
      .state('agentPrejudice.printQR', {
        url: '/printQR?awId&waybillNo',
        access_url: 'agentPrejudice.operation',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaractionQR.html');
                deferred.resolve(template);
              }, 'pre-print');
              return deferred.promise;
            }],
            controller: 'printBatteryDeclaractionQRCtrl',
            resolve: {
              'app.agentPrejudice.printQR': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/declaraction/printBatteryDeclaractionQR.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.printQR'
                  });
                  deferred.resolve(mod);
                }, 'printBatteryDeclaractionQR-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })            
      // 代理--预审--运单操作代理更换审核
      .state('agentPrejudice.changeOprn', {
        url: '/changeOprn?waybillNo',
        access_url: 'agentPrejudice.changeOprn',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/prejudice/changeOprn/changeOprn.html'),
            // controller: require('../pactl/agent/prejudice/changeOprn/changeOprn.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/changeOprn/changeOprn.html');
                deferred.resolve(template);
              }, 'changeOprn-tmp');
              return deferred.promise;
            }],
            controller: 'changeOprnCtrl',
            resolve: {
              'app.agentPrejudice.changeOprn': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/changeOprn/changeOprn.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.changeOprn'
                  });
                  deferred.resolve(mod);
                }, 'changeOprn-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--数据修改申请列表
      .state('agentPrejudice.applyList', {
        url: '/applyList?&change24H',
        access_url: 'agentPrejudice.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/prejudice/applyList/applyList.html'),
            // controller: require('../pactl/agent/prejudice/applyList/applyList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/applyList/applyList.html');
                deferred.resolve(template);
              }, 'applyList-tmp');
              return deferred.promise;
            }],
            controller: 'applyListCtrl',
            resolve: {
              'app.agentPrejudice.applyList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/applyList/applyList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.applyList'
                  });
                  deferred.resolve(mod);
                }, 'applyList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--数据修改申请
      .state('agentPrejudice.apply', {
        url: '/apply?awId&waybillNo&version',
        access_url: 'agentPrejudice.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/prejudice/apply/apply.html'),
            // controller: require('../pactl/agent/prejudice/apply/apply.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/apply/apply.html');
                deferred.resolve(template);
              }, 'apply-tmp');
              return deferred.promise;
            }],
            controller: 'applyCtrl',
            resolve: {
              'app.agentPrejudice.apply': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/apply/apply.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.apply'
                  });
                  deferred.resolve(mod);
                }, 'apply-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--预审--数据修改申请(已完成)
      .state('agentPrejudice.applyView', {
        url: '/applyView?awId&waybillNo&version',
        access_url: 'agentPrejudice.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/prejudice/apply/applyView.html'),
            // controller: require('../pactl/agent/prejudice/apply/applyView.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/prejudice/apply/applyView.html');
                deferred.resolve(template);
              }, 'applyView-tmp');
              return deferred.promise;
            }],
            controller: 'applyViewCtrl',
            resolve: {
              'app.agentPrejudice.applyView': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/prejudice/apply/applyView.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentPrejudice.applyView'
                  });
                  deferred.resolve(mod);
                }, 'applyView-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 代理--辅助功能
    $stateProvider.state('agentAssist', {
        url: '/assist',
        views: {
          main: {
            template: require('../pactl/agent/assist/assistIndex.html')
          }
        }
      })
      // 代理--辅助功能--代理证书共享库
      .state('agentAssist.proxyCert', {
        url: '/proxyCert',
        access_url: 'agentAssist.proxyCert',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/certificate/proxyCert.html'),
            // controller: require('../pactl/agent/assist/certificate/proxyCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/certificate/proxyCert.html');
                deferred.resolve(template);
              }, 'proxyCert-tmp');
              return deferred.promise;
            }],
            controller: 'proxyCertCtrl',
            resolve: {
              'app.agentAssist.proxyCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/certificate/proxyCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.proxyCert'
                  });
                  deferred.resolve(mod);
                }, 'proxyCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--证书打印
      .state('agentAssist.certCode', {
        url: '/certCode?printCode',
        access_url: 'agentAssist.proxyCert',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/certificate/certCode.html'),
            // controller: require('../pactl/agent/assist/certificate/certCode.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/certificate/certCode.html');
                deferred.resolve(template);
              }, 'certCode-tmp');
              return deferred.promise;
            }],
            controller: 'certCodeCtrl',
            resolve: {
              'app.agentAssist.certCode': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/certificate/certCode.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.certCode'
                  });
                  deferred.resolve(mod);
                }, 'certCode-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--公共证书共享库
      .state('agentAssist.publicCert', {
        url: '/publicCert',
        access_url: 'agentAssist.proxyCert',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/certificate/publicCert.html'),
            // controller: require('../pactl/agent/assist/certificate/publicCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/certificate/publicCert.html');
                deferred.resolve(template);
              }, 'publicCert-tmp');
              return deferred.promise;
            }],
            controller: 'publicCertCtrl',
            resolve: {
              'app.agentAssist.publicCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/certificate/publicCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.publicCert'
                  });
                  deferred.resolve(mod);
                }, 'publicCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--证书标签管理
      .state('agentAssist.tag', {
        url: '/tag',
        access_url: 'agentAssist.tag',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/tag/tag.html'),
            // controller: require('../pactl/agent/assist/tag/tag.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/tag/tag.html');
                deferred.resolve(template);
              }, 'tag-tmp');
              return deferred.promise;
            }],
            controller: 'tagCtrl',
            resolve: {
              'app.agentAssist.tag': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/tag/tag.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.tag'
                  });
                  deferred.resolve(mod);
                }, 'tag-ctl');
                return deferred.promise;
              }],
              'deps': ['$q', function ($q) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../lib/colorpicker/colorpicker.js');
                  deferred.resolve(mod);
                }, 'colorpicker');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--品名咨询
      .state('agentAssist.nameAdvice', {
        url: '/nameAdvice',
        access_url: 'agentAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/nameAdvice/nameAdvice.html'),
            // controller: require('../pactl/agent/assist/nameAdvice/nameAdvice.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/nameAdvice/nameAdvice.html');
                deferred.resolve(template);
              }, 'nameAdvice-tmp');
              return deferred.promise;
            }],
            controller: 'nameAdviceCtrl',
            resolve: {
              'app.agentAssist.nameAdvice': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/nameAdvice/nameAdvice.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.nameAdvice'
                  });
                  deferred.resolve(mod);
                }, 'nameAdvice-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--辅助功能--品名咨询--新建品名咨询
      .state('agentAssist.refer', {
        url: '/refer',
        access_url: 'agentAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/nameAdvice/refer.html'),
            // controller: require('../pactl/agent/assist/nameAdvice/refer.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/nameAdvice/refer.html');
                deferred.resolve(template);
              }, 'refer-tmp');
              return deferred.promise;
            }],
            controller: 'referCtrl',
            resolve: {
              'app.agentAssist.refer': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/nameAdvice/refer.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.refer'
                  });
                  deferred.resolve(mod);
                }, 'refer-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--辅助功能--品名咨询--回复
      .state('agentAssist.reply', {
        url: '/reply?goodsId',
        access_url: 'agentAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/nameAdvice/reply.html'),
            // controller: require('../pactl/agent/assist/nameAdvice/reply.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/nameAdvice/reply.html');
                deferred.resolve(template);
              }, 'reply-tmp');
              return deferred.promise;
            }],
            controller: 'replyCtrl',
            resolve: {
              'app.agentAssist.reply': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/nameAdvice/reply.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.reply'
                  });
                  deferred.resolve(mod);
                }, 'reply-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--已出运运单
      .state('agentAssist.shipmentWaybil', {
        url: '/shipmentWaybil',
        access_url: 'agentAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/nameAdvice/shipmentWaybil.html'),
            // controller: require('../pactl/agent/assist/nameAdvice/shipmentWaybil.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/nameAdvice/shipmentWaybil.html');
                deferred.resolve(template);
              }, 'shipmentWaybil-tmp');
              return deferred.promise;
            }],
            controller: 'shipmentWaybilCtrl',
            resolve: {
              'app.agentAssist.shipmentWaybil': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/nameAdvice/shipmentWaybil.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.shipmentWaybil'
                  });
                  deferred.resolve(mod);
                }, 'shipmentWaybil-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--在线填写产品说明
      .state('agentAssist.online', {
        url: '/online?goodsId&userType',
        access_url: 'agentAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/assist/nameAdvice/online.html'),
            // controller: require('../pactl/agent/assist/nameAdvice/online.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/assist/nameAdvice/online.html');
                deferred.resolve(template);
              }, 'online-tmp');
              return deferred.promise;
            }],
            controller: 'onlineCtrl',
            resolve: {
              'app.agentAssist.online': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/assist/nameAdvice/online.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentAssist.online'
                  });
                  deferred.resolve(mod);
                }, 'online-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 代理--选项
    $stateProvider.state('agentOption', {
        url: '/agentOption',
        views: {
          main: {
            template: require('../pactl/agent/option/optionIndex.html')
          }
        }
      })
      //代理--选项--运单模板
      .state('agentOption.waybillTemp', {
        url: '/waybillTemp',
        access_url: 'agentOption.waybillTemp',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/option/waybill/waybillTemp.html'),
            // controller: require('../pactl/agent/option/waybill/waybillTemp.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/waybill/waybillTemp.html');
                deferred.resolve(template);
              }, 'waybillTemp-tmp');
              return deferred.promise;
            }],
            controller: 'waybillTempCtrl',
            resolve: {
              'app.agentOption.waybillTemp': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/waybill/waybillTemp.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.waybillTemp'
                  });
                  deferred.resolve(mod);
                }, 'waybillTemp-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--选项--编辑运单模板(主单)
      .state('agentOption.ediyWaybillMasterTemp', {
        url: '/ediyWaybillMasterTemp?id',
        access_url: 'agentOption.waybillTemp',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/option/waybill/ediyWaybillMasterTemp.html'),
            // controller: require('../pactl/agent/option/waybill/ediyWaybillMasterTemp.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/waybill/ediyWaybillMasterTemp.html');
                deferred.resolve(template);
              }, 'ediyWaybillMasterTemp-tmp');
              return deferred.promise;
            }],
            controller: 'ediyWaybillMasterTempCtrl',
            resolve: {
              'app.agentOption.ediyWaybillMasterTemp': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/waybill/ediyWaybillMasterTemp.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.ediyWaybillMasterTemp'
                  });
                  deferred.resolve(mod);
                }, 'ediyWaybillMasterTemp-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--选项--编辑运单模板(分单)
      .state('agentOption.ediyWaybillSubTemp', {
        url: '/ediyWaybillSubTemp?id',
        access_url: 'agentOption.waybillTemp',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/option/waybill/ediyWaybillSubTemp.html'),
            // controller: require('../pactl/agent/option/waybill/ediyWaybillSubTemp.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/waybill/ediyWaybillSubTemp.html');
                deferred.resolve(template);
              }, 'ediyWaybillSubTemp-tmp');
              return deferred.promise;
            }],
            controller: 'ediyWaybillSubTempCtrl',
            resolve: {
              'app.agentOption.ediyWaybillSubTemp': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/waybill/ediyWaybillSubTemp.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.ediyWaybillSubTemp'
                  });
                  deferred.resolve(mod);
                }, 'ediyWaybillSubTemp-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--选项--收发货人维护
      .state('agentOption.people', {
        url: '/people',
        access_url: 'agentOption.people',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/option/people/people.html'),
            // controller: require('../pactl/agent/option/people/people.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/people/people.html');
                deferred.resolve(template);
              }, 'people-tmp');
              return deferred.promise;
            }],
            controller: 'peopleCtrl',
            resolve: {
              'app.agentOption.people': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/people/people.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.people'
                  });
                  deferred.resolve(mod);
                }, 'people-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--选项--品名管理
      .state('agentOption.nameAdvice', {
        url: '/nameAdvice',
        access_url: 'agentOption.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/option/nameAdvice/nameAdvice.html'),
            // controller: require('../pactl/agent/option/nameAdvice/nameAdvice.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/nameAdvice/nameAdvice.html');
                deferred.resolve(template);
              }, 'nameAdvice-tmp');
              return deferred.promise;
            }],
            controller: 'nameAdviceCtrl',
            resolve: {
              'app.agentOption.nameAdvice': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/nameAdvice/nameAdvice.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.nameAdvice'
                  });
                  deferred.resolve(mod);
                }, 'nameAdvice-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--选项--报文地址管理
      .state('agentOption.address', {
        url: '/address',
        access_url: 'agentOption.address',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/option/address/address.html'),
            // controller: require('../pactl/agent/option/address/address.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/address/address.html');
                deferred.resolve(template);
              }, 'address-tmp');
              return deferred.promise;
            }],
            controller: 'addressCtrl',
            resolve: {
              'app.agentOption.address': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/address/address.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.address'
                  });
                  deferred.resolve(mod);
                }, 'address-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理--选项--agent系统设置
      .state('agentOption.agentSystem', {
        url: '/agentSystem',
        access_url: 'agentOption.agentSystem',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/option/agentSystem/agentSystem.html');
                deferred.resolve(template);
              }, 'agentSystem-tmp');
              return deferred.promise;
            }],
            controller: 'agentSystemCtrl',
            resolve: {
              'app.agentOption.agentSystem': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/option/agentSystem/agentSystem.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentOption.agentSystem'
                  });
                  deferred.resolve(mod);
                }, 'agentSystem-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
    // 代理--统计查询
    $stateProvider.state('agentStatistics', {
      url: '/agentStatistics',
      views: {
        main: {
          template: require('../pactl/agent/statisticsQuery/statisticsQueryIndex.html')
        }
      }
    });
    // 代理--站点管理
    $stateProvider.state('agentSite', {
        url: '/agentSite',
        access_url: 'agentSite',
        views: {
          main: {
            template: require('../pactl/agent/site/siteIndex.html'),
            controller: require('../pactl/agent/site/siteIndex.ctrl.js')
          }
        }
      })
      //代理-站点管理--子账户管理
      .state('agentSite.saleagent', {
        url: '/saleagent',
        access_url: 'agentSite',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/site/saleagent/saleagent.html'),
            // controller: require('../pactl/agent/site/saleagent/saleagent.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/site/saleagent/saleagent.html');
                deferred.resolve(template);
              }, 'saleagent-tmp');
              return deferred.promise;
            }],
            controller: 'saleagentCtrl',
            resolve: {
              'app.agentSite.saleagent': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/site/saleagent/saleagent.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentSite.saleagent'
                  });
                  deferred.resolve(mod);
                }, 'saleagent-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理-站点管理--操作代理管理
      .state('agentSite.operatoragent', {
        url: '/operatoragent',
        access_url: 'agentSite',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/site/operatoragent/operatoragent.html'),
            // controller: require('../pactl/agent/site/operatoragent/operatoragent.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/site/operatoragent/operatoragent.html');
                deferred.resolve(template);
              }, 'operatoragent-tmp');
              return deferred.promise;
            }],
            controller: 'operatoragentCtrl',
            resolve: {
              'app.agentSite.operatoragent': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/site/operatoragent/operatoragent.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentSite.operatoragent'
                  });
                  deferred.resolve(mod);
                }, 'operatoragent-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理-站点管理--代理用户管理
      .state('agentSite.agentuser', {
        url: '/agentuser',
        access_url: 'agentSite',
        views: {
          mainInfo: {
            // template: require('../pactl/agent/site/agentuser/agentuser.html'),
            // controller: require('../pactl/agent/site/agentuser/agentuser.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/agent/site/agentuser/agentuser.html');
                deferred.resolve(template);
              }, 'agentuser-tmp');
              return deferred.promise;
            }],
            controller: 'agentuserCtrl',
            resolve: {
              'app.agentSite.agentuser': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/agent/site/agentuser/agentuser.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.agentSite.agentuser'
                  });
                  deferred.resolve(mod);
                }, 'agentuser-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    //-------------------------------------pactl用户界面---------------------------------------------------
    // PACTL--站点管理
    $stateProvider.state('pactlSite', {
      url: '/pactlSite',
      views: {
        main: {

        }
      }
    })
    // pactl--预审
    $stateProvider.state('pactlPrejudice', {
        url: '/pactlPrejudice',
        views: {
          main: {
            template: require('../pactl/pactl/prejudice/prejudiceIndex.html')
          }
        }
      })
      // pactl--预审--单票运单预审
      .state('pactlPrejudice.singleCargo', {
        url: '/singleCargo?waybill',
        access_url: 'pactlPrejudice.ordinaryCargo',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.html'),
            // controller: require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.html');
                deferred.resolve(template);
              }, 'ordinaryCargo-tmp');
              return deferred.promise;
            }],
            controller: 'ordinaryCargoCtrl',
            resolve: {
              'app.pactlPrejudice.ordinaryCargo': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.ordinaryCargo'
                  });
                  deferred.resolve(mod);
                }, 'ordinaryCargo-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--单票运单预审
      .state('pactlPrejudice.singleCargoSearch', {
        url: '/singleCargoSearch?waybillId',
        access_url: 'pactlPrejudice.ordinaryCargo',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.html'),
            // controller: require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.html');
                deferred.resolve(template);
              }, 'ordinaryCargo-tmp');
              return deferred.promise;
            }],
            controller: 'ordinaryCargoCtrl',
            resolve: {
              'app.pactlPrejudice.ordinaryCargo': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.ordinaryCargo'
                  });
                  deferred.resolve(mod);
                }, 'ordinaryCargo-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--单票运单预审--显示主单详细
      .state('pactlPrejudice.showMasterbill', {
        url: '/showMasterbill?waybillNo',
        access_url: 'pactlPrejudice.ordinaryCargo',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.html');
                deferred.resolve(template);
              }, 'showMasterbill-tmp');
              return deferred.promise;
            }],
            controller: 'showMasterbillCtrl',
            resolve: {
              'app.pactlPrejudice.showMasterbill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.showMasterbill'
                  });
                  deferred.resolve(mod);
                }, 'showMasterbill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理预审，PACTL预审，PACTL现场检查，PACTL收单----------分单清单
      .state('pactlPrejudice.sublist', {
        url: '/sublist?waybillNo',
        access_url: 'pactlPrejudice.sublist',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/acceptance/others/sublist.html');
                deferred.resolve(template);
              }, 'sublist-tmp');
              return deferred.promise;
            }],
            controller: 'sublistCtrl',
            resolve: {
              'app.pactlPrejudice.sublist': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/acceptance/others/sublist.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.sublist'
                  });
                  deferred.resolve(mod);
                }, 'sublist-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //代理预审，PACTL预审，PACTL现场检查，PACTL收单----------分单清单打印
      .state('pactlPrejudice.print', {
        url: '/print?waybillNo',
        access_url: 'pactlPrejudice.sublist',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/acceptance/others/sublistPrint.html');
                deferred.resolve(template);
              }, 'sublistPrint-tmp');
              return deferred.promise;
            }],
            controller: 'sublistPrintCtrl',
            resolve: {
              'app.pactlPrejudice.sublistPrint': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/acceptance/others/sublistPrint.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.sublistPrint'
                  });
                  deferred.resolve(mod);
                }, 'sublistPrint-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--预审任务执行
      .state('pactlPrejudice.ordinaryCargo', {
        url: '/ordinaryCargo',
        access_url: 'pactlPrejudice.ordinaryCargo',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.html'),
            // controller: require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.html');
                deferred.resolve(template);
              }, 'ordinaryCargo-tmp');
              return deferred.promise;
            }],
            controller: 'ordinaryCargoCtrl',
            resolve: {
              'app.pactlPrejudice.ordinaryCargo': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/ordinaryCargo.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.ordinaryCargo'
                  });
                  deferred.resolve(mod);
                }, 'ordinaryCargo-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--现场检查货物预审列表
      .state('pactlPrejudice.inspectList', {
        url: '/inspectList',
        access_url: 'pactlPrejudice.inspectList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/localInspect/inspectList.html'),
            // controller: require('../pactl/pactl/prejudice/localInspect/inspectList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/localInspect/inspectList.html');
                deferred.resolve(template);
              }, 'inspectList-tmp');
              return deferred.promise;
            }],
            controller: 'inspectListCtrl',
            resolve: {
              'app.pactlPrejudice.inspectList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/localInspect/inspectList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.inspectList'
                  });
                  deferred.resolve(mod);
                }, 'inspectList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--现场检查预审
      .state('pactlPrejudice.localInspect', {
        url: '/localInspect?waybillNo',
        access_url: 'pactlPrejudice.inspectList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/localInspect/localInspect.html'),
            // controller: require('../pactl/pactl/prejudice/localInspect/localInspect.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/localInspect/localInspect.html');
                deferred.resolve(template);
              }, 'localInspect-tmp');
              return deferred.promise;
            }],
            controller: 'localInspectCtrl',
            resolve: {
              'app.pactlPrejudice.localInspect': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/localInspect/localInspect.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.localInspect'
                  });
                  deferred.resolve(mod);
                }, 'localInspect-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--现场检查预审--显示主单详细
      .state('pactlPrejudice.showMasterbill2', {
        url: '/showMasterbill2?waybillNo',
        access_url: 'pactlPrejudice.inspectList',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.html');
                deferred.resolve(template);
              }, 'showMasterbill-tmp');
              return deferred.promise;
            }],
            controller: 'showMasterbillCtrl',
            resolve: {
              'app.pactlPrejudice.showMasterbill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.showMasterbill'
                  });
                  deferred.resolve(mod);
                }, 'showMasterbill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--检查清单
      .state('pactlPrejudice.checklist', {
        url: '/checklist',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/checklist/checklist.html'),
            // controller: require('../pactl/pactl/prejudice/checklist/checklist.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/checklist/checklist.html');
                deferred.resolve(template);
              }, 'checklist-tmp');
              return deferred.promise;
            }],
            controller: 'checklistCtrl',
            resolve: {
              'app.pactlPrejudice.checklist': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/checklist/checklist.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.checklist'
                  });
                  deferred.resolve(mod);
                }, 'checklist-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--入库卡车清单
      .state('pactlPrejudice.car', {
        url: '/car',
        access_url: 'pactlPrejudice.car',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/car/car.html'),
            // controller: require('../pactl/pactl/prejudice/car/car.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/car/car.html');
                deferred.resolve(template);
              }, 'car-tmp');
              return deferred.promise;
            }],
            controller: 'carCtrl',
            resolve: {
              'app.pactlPrejudice.car': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/car/car.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.car'
                  });
                  deferred.resolve(mod);
                }, 'car-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--入库卡车清单打印
      .state('pactlPrejudice.carCode', {
        url: '/carCode?truckBill',
        access_url: 'pactlPrejudice.car',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/prejudice/car/carCode.html'),
            // controller: require('../pactl/pactl/prejudice/car/carCode.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/car/carCode.html');
                deferred.resolve(template);
              }, 'carCode-tmp');
              return deferred.promise;
            }],
            controller: 'carCodeCtrl',
            resolve: {
              'app.pactlPrejudice.carCode': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/car/carCode.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.carCode'
                  });
                  deferred.resolve(mod);
                }, 'carCode-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //PACTL预审，PACTL现场检查，PACTL收单----------其他--审单宝典
      .state('pactlPrejudice.preBook', {
        url: '/preBook?airCode&destCode',
        access_url: 'pactlPrejudice.ordinaryCargo',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/preBook.html');
                deferred.resolve(template);
              }, 'preBook-tmp');
              return deferred.promise;
            }],
            controller: 'preBookCtrl',
            resolve: {
              'app.pactlPrejudice.preBook': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/preBook.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.preBook'
                  });
                  deferred.resolve(mod);
                }, 'preBook-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // pactl--收单
    $stateProvider.state('pactlReceive', {
        url: '/pactlReceive',
        views: {
          main: {
            template: require('../pactl/pactl/receive/receiveIndex.html')
          }
        }
      })
      // pactl--收单--收单详情
      .state('pactlReceive.acceptanceList', {
        url: '/acceptanceList?billNO',
        access_url: 'pactlReceive.waybillList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/acceptance/acceptanceList.html'),
            // controller: require('../pactl/pactl/receive/acceptance/acceptanceList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/acceptance/acceptanceList.html');
                deferred.resolve(template);
              }, 'acceptanceList-tmp');
              return deferred.promise;
            }],
            controller: 'acceptanceListCtrl',
            resolve: {
              'app.pactlReceive.acceptanceList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/acceptance/acceptanceList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.acceptanceList'
                  });
                  deferred.resolve(mod);
                }, 'acceptanceList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      .state('pactlReceive.acceptanceListById', {
        url: '/acceptanceListById?awId&read',
        access_url: 'pactlReceive.waybillList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/acceptance/acceptanceList.html'),
            // controller: require('../pactl/pactl/receive/acceptance/acceptanceList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/acceptance/acceptanceList.html');
                deferred.resolve(template);
              }, 'acceptanceList-tmp');
              return deferred.promise;
            }],
            controller: 'acceptanceListCtrl',
            resolve: {
              'app.pactlReceive.acceptanceList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/acceptance/acceptanceList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.acceptanceList'
                  });
                  deferred.resolve(mod);
                }, 'acceptanceList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //退库单打印
      .state('pactlReceive.printReturn', {
        url: '/printReturn?awId&mainSelected&secIds',
        access_url: 'pactlReceive.waybillList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/acceptance/acceptanceList.html'),
            // controller: require('../pactl/pactl/receive/acceptance/acceptanceList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/acceptance/others/printReturn.html');
                deferred.resolve(template);
              }, 'printReturn-tmp');
              return deferred.promise;
            }],
            controller: 'printReturnCtrl',
            resolve: {
              'app.pactlReceive.printReturn': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/acceptance/others/printReturn.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.printReturn'
                  });
                  deferred.resolve(mod);
                }, 'printReturn-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--收单--显示主单详细
      .state('pactlPrejudice.showMasterbill3', {
        url: '/showMasterbill3?waybillNo',
        access_url: 'pactlReceive.waybillList',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.html');
                deferred.resolve(template);
              }, 'showMasterbill-tmp');
              return deferred.promise;
            }],
            controller: 'showMasterbillCtrl',
            resolve: {
              'app.pactlPrejudice.showMasterbill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.showMasterbill'
                  });
                  deferred.resolve(mod);
                }, 'showMasterbill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--收单--运单列表
      .state('pactlReceive.waybillList', {
        url: '/waybillList',
        access_url: 'pactlReceive.waybillList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/waybill/waybillList.html'),
            // controller: require('../pactl/pactl/receive/waybill/waybillList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/waybill/waybillList.html');
                deferred.resolve(template);
              }, 'waybillList-tmp');
              return deferred.promise;
            }],
            controller: 'waybillListCtrl',
            resolve: {
              'app.pactlReceive.waybillList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/waybill/waybillList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.waybillList'
                  });
                  deferred.resolve(mod);
                }, 'waybillList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--收单--数据申请审批列表
      .state('pactlReceive.applyList', {
        url: '/applyList',
        access_url: 'pactlReceive.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/applyList/applyList.html'),
            // controller: require('../pactl/pactl/receive/applyList/applyList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/applyList/applyList.html');
                deferred.resolve(template);
              }, 'applyList-tmp');
              return deferred.promise;
            }],
            controller: 'applyListCtrl',
            resolve: {
              'app.pactlReceive.applyList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/applyList/applyList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.applyList'
                  });
                  deferred.resolve(mod);
                }, 'applyList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--收单--数据修改申请
      .state('pactlReceive.apply', {
        url: '/apply?awId&waybillNo&version',
        access_url: 'pactlReceive.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/apply/apply.html'),
            // controller: require('../pactl/pactl/receive/apply/apply.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/apply/apply.html');
                deferred.resolve(template);
              }, 'apply-tmp');
              return deferred.promise;
            }],
            controller: 'applyCtrl',
            resolve: {
              'app.pactlReceive.apply': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/apply/apply.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.apply'
                  });
                  deferred.resolve(mod);
                }, 'apply-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--收单--数据修改申请（已完成）
      .state('pactlReceive.applyView', {
        url: '/applyView?awId&waybillNo&version',
        access_url: 'pactlReceive.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/receive/apply/applyView.html'),
            // controller: require('../pactl/pactl/receive/apply/applyView.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/apply/applyView.html');
                deferred.resolve(template);
              }, 'applyView-tmp');
              return deferred.promise;
            }],
            controller: 'applyViewCtrl',
            resolve: {
              'app.pactlReceive.applyView': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/apply/applyView.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.applyView'
                  });
                  deferred.resolve(mod);
                }, 'applyView-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // pactl--辅助功能
    $stateProvider.state('pactlAssist', {
        url: '/pactlAssist',
        views: {
          main: {
            template: require('../pactl/pactl/assist/assistIndex.html')
          }
        }
      })
      // pactl--辅助功能--品名咨询
      .state('pactlAssist.nameAdvice', {
        url: '/nameAdvice',
        access_url: 'pactlAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/nameAdvice/nameAdvice.html'),
            // controller: require('../pactl/pactl/assist/nameAdvice/nameAdvice.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/nameAdvice/nameAdvice.html');
                deferred.resolve(template);
              }, 'nameAdvice-tmp');
              return deferred.promise;
            }],
            controller: 'nameAdviceCtrl',
            resolve: {
              'app.pactlAssist.nameAdvice': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/nameAdvice/nameAdvice.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.nameAdvice'
                  });
                  deferred.resolve(mod);
                }, 'nameAdvice-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--品名咨询--点击咨询编号进行回复
      .state('pactlAssist.reply', {
        url: '/reply?goodsId',
        access_url: 'pactlAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/nameAdvice/reply.html'),
            // controller: require('../pactl/pactl/assist/nameAdvice/reply.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/nameAdvice/reply.html');
                deferred.resolve(template);
              }, 'reply-tmp');
              return deferred.promise;
            }],
            controller: 'replyCtrl',
            resolve: {
              'app.pactlAssist.reply': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/nameAdvice/reply.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.reply'
                  });
                  deferred.resolve(mod);
                }, 'reply-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--在线查看产品说明
      .state('pactlAssist.online', {
        url: '/online?goodsId&userType',
        access_url: 'pactlAssist.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/nameAdvice/online.html'),
            // controller: require('../pactl/pactl/assist/nameAdvice/online.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/nameAdvice/online.html');
                deferred.resolve(template);
              }, 'online-tmp');
              return deferred.promise;
            }],
            controller: 'onlineCtrl',
            resolve: {
              'app.pactlAssist.online': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/nameAdvice/online.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.online'
                  });
                  deferred.resolve(mod);
                }, 'online-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--安保部门退运
      .state('pactlAssist.security', {
        url: '/security',
        access_url: 'pactlAssist.security',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/security/security.html'),
            // controller: require('../pactl/pactl/assist/security/security.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/security/security.html');
                deferred.resolve(template);
              }, 'security-tmp');
              return deferred.promise;
            }],
            controller: 'securityCtrl',
            resolve: {
              'app.pactlAssist.security': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/security/security.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.security'
                  });
                  deferred.resolve(mod);
                }, 'security-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--证书在线审核
      .state('pactlAssist.auditCert', {
        url: '/auditCert',
        access_url: 'pactlAssist.auditCert',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/auditCert/auditCert.html'),
            // controller: require('../pactl/pactl/assist/auditCert/auditCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/auditCert/auditCert.html');
                deferred.resolve(template);
              }, 'auditCert-tmp');
              return deferred.promise;
            }],
            controller: 'auditCertCtrl',
            resolve: {
              'app.pactlAssist.auditCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/auditCert/auditCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.auditCert'
                  });
                  deferred.resolve(mod);
                }, 'auditCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--证书在线审核操作
      .state('pactlAssist.auditCertDetail', {
        url: '/auditCertDetail?id',
        access_url: 'pactlAssist.auditCert',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/auditCert/auditCertDetail.html'),
            // controller: require('../pactl/pactl/assist/auditCert/auditCertDetail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/auditCert/auditCertDetail.html');
                deferred.resolve(template);
              }, 'auditCertDetail-tmp');
              return deferred.promise;
            }],
            controller: 'auditCertDetailCtrl',
            resolve: {
              'app.pactlAssist.auditCertDetail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/auditCert/auditCertDetail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.auditCertDetail'
                  });
                  deferred.resolve(mod);
                }, 'auditCertDetail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--数据申请修改  --左PDF右官
      .state('pactlReceive.officialWeb', {
        url: '/officialWeb?ocId&officeName&bookNo&fileHttpPath&classUrl&accredit&srcArr&id&awId&bookType&diffId',
        access_url: 'pactlReceive.applyList',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/auditCert/officialWeb.html'),
            // controller: require('../pactl/pactl/assist/auditCert/officialWeb.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/receive/acceptance/others/officialWeb.html');
                deferred.resolve(template);
              }, 'officialWeb-tmp');
              return deferred.promise;
            }],
            controller: 'officialWebCtrl',
            resolve: {
              'app.pactlReceive.officialWeb': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/receive/acceptance/others/officialWeb.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlReceive.officialWeb'
                  });
                  deferred.resolve(mod);
                }, 'officialWeb-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--证书留存
      .state('pactlAssist.retentCert', {
        url: '/retentCert',
        access_url: 'pactlAssist.retentCert',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/retentCert/retentCert.html'),
            // controller: require('../pactl/pactl/assist/retentCert/retentCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/retentCert/retentCert.html');
                deferred.resolve(template);
              }, 'retentCert-tmp');
              return deferred.promise;
            }],
            controller: 'retentCertCtrl',
            resolve: {
              'app.pactlAssist.retentCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/retentCert/retentCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.retentCert'
                  });
                  deferred.resolve(mod);
                }, 'retentCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--证书列表
      .state('pactlAssist.listCert', {
        url: '/listCert',
        access_url: 'pactlAssist.listCert',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/listCert/listCert.html'),
            // controller: require('../pactl/pactl/assist/listCert/listCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/listCert/listCert.html');
                deferred.resolve(template);
              }, 'listCert-tmp');
              return deferred.promise;
            }],
            controller: 'listCertCtrl',
            resolve: {
              'app.pactlAssist.listCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/listCert/listCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.listCert'
                  });
                  deferred.resolve(mod);
                }, 'listCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--证书信息
      .state('pactlAssist.opCert', {
        url: '/opCert?id',
        access_url: 'pactlAssist.listCert',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/listCert/opCert.html'),
            // controller: require('../pactl/pactl/assist/listCert/opCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/listCert/opCert.html');
                deferred.resolve(template);
              }, 'opCert-tmp');
              return deferred.promise;
            }],
            controller: 'opCertCtrl',
            resolve: {
              'app.pactlAssist.opCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/listCert/opCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.opCert'
                  });
                  deferred.resolve(mod);
                }, 'opCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--辅助功能--证书延期
      .state('pactlAssist.delayCert', {
        url: '/delayCert',
        access_url: 'pactlAssist.delayCert',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/delayCert/delayCert.html'),
            // controller: require('../pactl/pactl/assist/delayCert/delayCert.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/delayCert/delayCert.html');
                deferred.resolve(template);
              }, 'delayCert-tmp');
              return deferred.promise;
            }],
            controller: 'delayCertCtrl',
            resolve: {
              'app.pactlAssist.delayCert': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/delayCert/delayCert.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.delayCert'
                  });
                  deferred.resolve(mod);
                }, 'delayCert-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--报文---发送的报文
      .state('pactlAssist.sentMessage', {
        url: '/sentMessage',
        access_url: 'pactlAssist.sentMessage',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/message/sentMessage.html'),
            // controller: require('../pactl/pactl/assist/message/sentMessage.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/message/sentMessage.html');
                deferred.resolve(template);
              }, 'sentMessage-tmp');
              return deferred.promise;
            }],
            controller: 'sentMessageCtrl',
            resolve: {
              'app.pactlAssist.sentMessage': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/message/sentMessage.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.sentMessage'
                  });
                  deferred.resolve(mod);
                }, 'sentMessage-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--收到的报文
      .state('pactlAssist.receivedMessage', {
        url: '/receivedMessage',
        access_url: 'pactlAssist.sentMessage',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/message/receivedMessage.html'),
            // controller: require('../pactl/pactl/assist/message/receivedMessage.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/message/receivedMessage.html');
                deferred.resolve(template);
              }, 'receivedMessage-tmp');
              return deferred.promise;
            }],
            controller: 'receivedMessageCtrl',
            resolve: {
              'app.pactlAssist.receivedMessage': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/message/receivedMessage.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.receivedMessage'
                  });
                  deferred.resolve(mod);
                }, 'receivedMessage-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--错误的报文
      .state('pactlAssist.errorMessage', {
        url: '/errorMessage',
        access_url: 'pactlAssist.sentMessage',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/message/errorMessage.html'),
            // controller: require('../pactl/pactl/assist/message/errorMessage.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/message/errorMessage.html');
                deferred.resolve(template);
              }, 'errorMessage-tmp');
              return deferred.promise;
            }],
            controller: 'errorMessageCtrl',
            resolve: {
              'app.pactlAssist.errorMessage': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/message/errorMessage.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.errorMessage'
                  });
                  deferred.resolve(mod);
                }, 'errorMessage-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 代理--辅助功能--报文---测试报文
      .state('pactlAssist.testMessage', {
        url: '/testMessage',
        access_url: 'pactlAssist.testMessage',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/assist/message/testMessage.html'),
            // controller: require('../pactl/pactl/assist/message/testMessage.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/assist/message/testMessage.html');
                deferred.resolve(template);
              }, 'testMessage-tmp');
              return deferred.promise;
            }],
            controller: 'testMessageCtrl',
            resolve: {
              'app.pactlAssist.testMessage': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/assist/message/testMessage.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlAssist.testMessage'
                  });
                  deferred.resolve(mod);
                }, 'testMessage-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
    // pactl--选项
    $stateProvider.state('pactlOption', {
        url: '/pactlOption',
        views: {
          main: {
            template: require('../pactl/pactl/option/optionIndex.html')
          }
        }
      })
      // pactl--选项--货站审单任务分配规则设置
      .state('pactlOption.taskRule', {
        url: '/taskRule',
        access_url: 'pactlOption.taskRule',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/taskRule/taskRule.html'),
            // controller: require('../pactl/pactl/option/taskRule/taskRule.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/taskRule/taskRule.html');
                deferred.resolve(template);
              }, 'taskRule-tmp');
              return deferred.promise;
            }],
            controller: 'taskRuleCtrl',
            resolve: {
              'app.pactlOption.taskRule': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/taskRule/taskRule.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.taskRule'
                  });
                  deferred.resolve(mod);
                }, 'taskRule-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--审单任务分配规则
      .state('pactlOption.billRule', {
        url: '/billRule',
        access_url: 'pactlOption.billRule',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/billRule/billRule.html'),
            // controller: require('../pactl/pactl/option/billRule/billRule.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/billRule/billRule.html');
                deferred.resolve(template);
              }, 'billRule-tmp');
              return deferred.promise;
            }],
            controller: 'billRuleCtrl',
            resolve: {
              'app.pactlOption.billRule': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/billRule/billRule.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.billRule'
                  });
                  deferred.resolve(mod);
                }, 'billRule-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--审单宝典
      .state('pactlOption.book', {
        url: '/book',
        access_url: 'pactlOption.book',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/book/book.html'),
            // controller: require('../pactl/pactl/option/book/book.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/book/book.html');
                deferred.resolve(template);
              }, 'book-tmp');
              return deferred.promise;
            }],
            controller: 'bookCtrl',
            resolve: {
              'app.pactlOption.book': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/book/book.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.book'
                  });
                  deferred.resolve(mod);
                }, 'book-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--品名大数据
      .state('pactlOption.nameAdvice', {
        url: '/nameAdvice',
        access_url: 'pactlOption.nameAdvice',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/nameAdvice/nameAdvice.html'),
            // controller: require('../pactl/pactl/option/nameAdvice/nameAdvice.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/nameAdvice/nameAdvice.html');
                deferred.resolve(template);
              }, 'nameAdvice-tmp');
              return deferred.promise;
            }],
            controller: 'nameAdviceCtrl',
            resolve: {
              'app.pactlOption.nameAdvice': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/nameAdvice/nameAdvice.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.nameAdvice'
                  });
                  deferred.resolve(mod);
                }, 'nameAdvice-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--运单必录项
      .state('pactlOption.wayBillItem', {
        url: '/wayBillItem',
        access_url: 'pactlOption.wayBillItem.fieldType',
        views: {
          mainInfo: {
            template: require('../pactl/pactl/option/wayBillItem/wayBillIndex.html'),
            controller: require('../pactl/pactl/option/wayBillItem/wayBillIndex.ctrl.js')
          }
        }
      })
      // pactl--选项--运单必录项--字段分类
      .state('pactlOption.wayBillItem.fieldType', {
        url: '/fieldType',
        access_url: 'pactlOption.wayBillItem.fieldType',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/wayBillItem/fieldType/fieldType.html'),
            // controller: require('../pactl/pactl/option/wayBillItem/fieldType/fieldType.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/wayBillItem/fieldType/fieldType.html');
                deferred.resolve(template);
              }, 'fieldType-tmp');
              return deferred.promise;
            }],
            controller: 'fieldTypeCtrl',
            resolve: {
              'app.pactlOption.fieldType': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/wayBillItem/fieldType/fieldType.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.fieldType'
                  });
                  deferred.resolve(mod);
                }, 'fieldType-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--运单必录项--运单字段维护
      .state('pactlOption.wayBillItem.field', {
        url: '/field',
        access_url: 'pactlOption.wayBillItem.fieldType',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/wayBillItem/field/field.html'),
            // controller: require('../pactl/pactl/option/wayBillItem/field/field.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/wayBillItem/field/field.html');
                deferred.resolve(template);
              }, 'field-tmp');
              return deferred.promise;
            }],
            controller: 'fieldCtrl',
            resolve: {
              'app.pactlOption.field': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/wayBillItem/field/field.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.field'
                  });
                  deferred.resolve(mod);
                }, 'field-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--运单必录项--航空公司必录项
      // .state('pactlOption.wayBillItem.fieldAirline', {
      //   url: '/fieldAirline',
      //   views: {
      //     mainInfo: {
      //       template: require('../pactl/pactl/option/wayBillItem/fieldAirline/fieldAirline.html'),
      //       controller: require('../pactl/pactl/option/wayBillItem/fieldAirline/fieldAirline.ctrl.js')
      //     }
      //   }
      // })
      // pactl--选项--运单必录项--运单校验分类
      .state('pactlOption.wayBillItem.verifyType', {
        url: '/verifyType',
        access_url: 'pactlOption.wayBillItem.fieldType',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/wayBillItem/verifyType/verifyType.html'),
            // controller: require('../pactl/pactl/option/wayBillItem/verifyType/verifyType.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/wayBillItem/verifyType/verifyType.html');
                deferred.resolve(template);
              }, 'verifyType-tmp');
              return deferred.promise;
            }],
            controller: 'verifyTypeCtrl',
            resolve: {
              'app.pactlOption.verifyType': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/wayBillItem/verifyType/verifyType.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.verifyType'
                  });
                  deferred.resolve(mod);
                }, 'verifyType-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--运单必录项--运单校验字段
      .state('pactlOption.wayBillItem.verifyField', {
        url: '/verifyField',
        access_url: 'pactlOption.wayBillItem.fieldType',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/wayBillItem/verifyField/verifyField.html'),
            // controller: require('../pactl/pactl/option/wayBillItem/verifyField/verifyField.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/wayBillItem/verifyField/verifyField.html');
                deferred.resolve(template);
              }, 'verifyField-tmp');
              return deferred.promise;
            }],
            controller: 'verifyFieldCtrl',
            resolve: {
              'app.pactlOption.verifyField': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/wayBillItem/verifyField/verifyField.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.verifyField'
                  });
                  deferred.resolve(mod);
                }, 'verifyField-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--运单必录项--PACTL预审必录项
      // .state('pactlOption.wayBillItem.fieldPactl', {
      //   url: '/fieldPactl',
      //   views: {
      //     mainInfo: {
      //       template: require('../pactl/pactl/option/wayBillItem/fieldPactl/fieldPactl.html'),
      //       controller: require('../pactl/pactl/option/wayBillItem/fieldPactl/fieldPactl.ctrl.js')
      //     }
      //   }
      // })
      // pactl--选项--运单必录项--运单关键字段列表
      // .state('pactlOption.wayBillItem.fieldBill', {
      //   url: '/fieldBill',
      //   views: {
      //     mainInfo: {
      //       template: require('../pactl/pactl/option/wayBillItem/fieldBill/fieldBill.html'),
      //       controller: require('../pactl/pactl/option/wayBillItem/fieldBill/fieldBill.ctrl.js')
      //     }
      //   }
      // })
      // pactl--选项--航空公司
      .state('pactlOption.airline', {
        url: '/airline',
        access_url: 'pactlOption.airline',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/airline/airline.html'),
            // controller: require('../pactl/pactl/option/airline/airline.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/airline/airline.html');
                deferred.resolve(template);
              }, 'airline-tmp');
              return deferred.promise;
            }],
            controller: 'airlineCtrl',
            resolve: {
              'app.pactlOption.airline': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/airline/airline.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.airline'
                  });
                  deferred.resolve(mod);
                }, 'airline-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--航空公司详情
      .state('pactlOption.airlineDetail', {
        url: '/airlineDetail?alid',
        access_url: 'pactlOption.airline',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/airline/airlineDetail.html'),
            // controller: require('../pactl/pactl/option/airline/airlineDetail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/airline/airlineDetail.html');
                deferred.resolve(template);
              }, 'airlineDetail-tmp');
              return deferred.promise;
            }],
            controller: 'airlineDetailCtrl',
            resolve: {
              'app.pactlOption.airlineDetail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/airline/airlineDetail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.airlineDetail'
                  });
                  deferred.resolve(mod);
                }, 'airlineDetail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--字典
      .state('pactlOption.dictionary', {
        url: '/dictionary',
        access_url: 'pactlOption.dictionary',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/dictionary/dictionary.html'),
            // controller: require('../pactl/pactl/option/dictionary/dictionary.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/dictionary/dictionary.html');
                deferred.resolve(template);
              }, 'dictionary-tmp');
              return deferred.promise;
            }],
            controller: 'dictionaryCtrl',
            resolve: {
              'app.pactlOption.dictionary': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/dictionary/dictionary.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.dictionary'
                  });
                  deferred.resolve(mod);
                }, 'dictionary-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--字典分类
      .state('pactlOption.dictionaryType', {
        url: '/dictionaryType',
        access_url: 'pactlOption.dictionaryType',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/dictionaryType/dictionaryType.html'),
            // controller: require('../pactl/pactl/option/dictionaryType/dictionaryType.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/dictionaryType/dictionaryType.html');
                deferred.resolve(template);
              }, 'dictionaryType-tmp');
              return deferred.promise;
            }],
            controller: 'dictionaryTypeCtrl',
            resolve: {
              'app.pactlOption.dictionaryType': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/dictionaryType/dictionaryType.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.dictionaryType'
                  });
                  deferred.resolve(mod);
                }, 'dictionaryType-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--机场
      .state('pactlOption.airPort', {
        url: '/airPort',
        access_url: 'pactlOption.airPort',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/airport/airport.html'),
            // controller: require('../pactl/pactl/option/airport/airport.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/airport/airport.html');
                deferred.resolve(template);
              }, 'airPort-tmp');
              return deferred.promise;
            }],
            controller: 'airPortCtrl',
            resolve: {
              'app.pactlOption.airPort': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/airport/airport.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.airPort'
                  });
                  deferred.resolve(mod);
                }, 'airPort-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--国家
      .state('pactlOption.country', {
        url: '/country',
        access_url: 'pactlOption.country',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/country/country.html'),
            // controller: require('../pactl/pactl/option/country/country.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/country/country.html');
                deferred.resolve(template);
              }, 'country-tmp');
              return deferred.promise;
            }],
            controller: 'countryCtrl',
            resolve: {
              'app.pactlOption.country': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/country/country.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.country'
                  });
                  deferred.resolve(mod);
                }, 'country-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--货币
      .state('pactlOption.currency', {
        url: '/currency',
        access_url: 'pactlOption.currency',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/currency/currency.html'),
            // controller: require('../pactl/pactl/option/currency/currency.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/currency/currency.html');
                deferred.resolve(template);
              }, 'currency-tmp');
              return deferred.promise;
            }],
            controller: 'currencyCtrl',
            resolve: {
              'app.pactlOption.currency': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/currency/currency.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.currency'
                  });
                  deferred.resolve(mod);
                }, 'currency-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--特货代码
      .state('pactlOption.spCode', {
        url: '/spCode',
        access_url: 'pactlOption.spCode',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/spCode/spCode.html'),
            // controller: require('../pactl/pactl/option/spCode/spCode.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/spCode/spCode.html');
                deferred.resolve(template);
              }, 'spCode-tmp');
              return deferred.promise;
            }],
            controller: 'spCodeCtrl',
            resolve: {
              'app.pactlOption.spCode': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/spCode/spCode.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.spCode'
                  });
                  deferred.resolve(mod);
                }, 'spCode-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--收单标签
      .state('pactlOption.acceptTag', {
        url: '/acceptTag',
        access_url: 'pactlOption.acceptTag',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/acceptTag/acceptTag.html'),
            // controller: require('../pactl/pactl/option/acceptTag/acceptTag.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/acceptTag/acceptTag.html');
                deferred.resolve(template);
              }, 'acceptTag-tmp');
              return deferred.promise;
            }],
            controller: 'acceptTagCtrl',
            resolve: {
              'app.pactlOption.acceptTag': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/acceptTag/acceptTag.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.acceptTag'
                  });
                  deferred.resolve(mod);
                }, 'acceptTag-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--收单补交文件
      .state('pactlOption.receiveFile', {
        url: '/receiveFile',
        access_url: 'pactlOption.receiveFile',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/receiveFile/receiveFile.html'),
            // controller: require('../pactl/pactl/option/receiveFile/receiveFile.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/receiveFile/receiveFile.html');
                deferred.resolve(template);
              }, 'receiveFile-tmp');
              return deferred.promise;
            }],
            controller: 'receiveFileCtrl',
            resolve: {
              'app.pactlOption.receiveFile': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/receiveFile/receiveFile.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.receiveFile'
                  });
                  deferred.resolve(mod);
                }, 'receiveFile-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--代理预审上传文件
      .state('pactlOption.preJudiceFile', {
        url: '/preJudiceFile',
        access_url: 'pactlOption.preJudiceFile',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/preJudiceFile/preJudiceFile.html'),
            // controller: require('../pactl/pactl/option/preJudiceFile/preJudiceFile.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/preJudiceFile/preJudiceFile.html');
                deferred.resolve(template);
              }, 'preJudiceFile-tmp');
              return deferred.promise;
            }],
            controller: 'preJudiceFileCtrl',
            resolve: {
              'app.pactlOption.preJudiceFile': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/preJudiceFile/preJudiceFile.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.preJudiceFile'
                  });
                  deferred.resolve(mod);
                }, 'preJudiceFile-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--证书邮件地址
      .state('pactlOption.mail', {
        url: '/mail',
        access_url: 'pactlOption.mail',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/mail/mail.html'),
            // controller: require('../pactl/pactl/option/mail/mail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/mail/mail.html');
                deferred.resolve(template);
              }, 'mail-tmp');
              return deferred.promise;
            }],
            controller: 'mailCtrl',
            resolve: {
              'app.pactlOption.mail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/mail/mail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.mail'
                  });
                  deferred.resolve(mod);
                }, 'mail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--鉴定机构
      .state('pactlOption.agency', {
        url: '/agency',
        access_url: 'pactlOption.agency',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/agency/agency.html'),
            // controller: require('../pactl/pactl/option/agency/agency.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/agency/agency.html');
                deferred.resolve(template);
              }, 'agency-tmp');
              return deferred.promise;
            }],
            controller: 'agencyCtrl',
            resolve: {
              'app.pactlOption.agency': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/agency/agency.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.agency'
                  });
                  deferred.resolve(mod);
                }, 'agency-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--鉴定机构编辑
      .state('pactlOption.editAgency', {
        url: '/editAgency?ocId',
        access_url: 'pactlOption.agency',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/agency/editAgency.html'),
            // controller: require('../pactl/pactl/option/agency/editAgency.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/agency/editAgency.html');
                deferred.resolve(template);
              }, 'editAgency-tmp');
              return deferred.promise;
            }],
            controller: 'editAgencyCtrl',
            resolve: {
              'app.pactlOption.editAgency': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/agency/editAgency.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.editAgency'
                  });
                  deferred.resolve(mod);
                }, 'editAgency-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--选项--货站
      .state('pactlOption.cargoStation', {
        url: '/cargoStation',
        access_url: 'pactlOption.cargoStation',
        views: {
          mainInfo: {
            // template: require('../pactl/pactl/option/cargoStation/cargoStation.html'),
            // controller: require('../pactl/pactl/option/cargoStation/cargoStation.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/option/cargoStation/cargoStation.html');
                deferred.resolve(template);
              }, 'cargoStation-tmp');
              return deferred.promise;
            }],
            controller: 'cargoStationCtrl',
            resolve: {
              'app.pactlOption.cargoStation': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/option/cargoStation/cargoStation.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlOption.cargoStation'
                  });
                  deferred.resolve(mod);
                }, 'cargoStation-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 安检--门户
    $stateProvider.state('securitySite', {
        url: '/securitySite',
        access_url: 'securitySite',
        views: {
          main: {
            template: require('../pactl/security/site/siteIndex.html'),
            controller: require('../pactl/security/site/siteIndex.ctrl.js')
          }
        }
      })
      // 安检--门户--安检用户
      .state('securitySite.securityuser', {
        url: '/securityuser',
        access_url: 'securitySite',
        views: {
          mainInfo: {
            // template: require('../pactl/security/site/user/securityuser.html'),
            // controller: require('../pactl/security/site/user/securityuser.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/site/user/securityuser.html');
                deferred.resolve(template);
              }, 'securityuser-tmp');
              return deferred.promise;
            }],
            controller: 'securityuserCtrl',
            resolve: {
              'app.securitySite.securityuser': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/site/user/securityuser.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securitySite.securityuser'
                  });
                  deferred.resolve(mod);
                }, 'securityuser-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
    // 安检--安检
    $stateProvider.state('securityItem', {
        url: '/securityItem',
        views: {
          main: {
            template: require('../pactl/security/securityItem/securityIndex.html')
          }
        }
      })
      // 安检--安检--安检复检
      .state('securityItem.reCheck', {
        url: '/reCheck',
        access_url: 'securityItem.reCheck',
        views: {
          mainInfo: {
            // template: require('../pactl/security/securityItem/reCheck/reCheck.html'),
            // controller: require('../pactl/security/securityItem/reCheck/reCheck.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/securityItem/reCheck/reCheck.html');
                deferred.resolve(template);
              }, 'reCheck-tmp');
              return deferred.promise;
            }],
            controller: 'reCheckCtrl',
            resolve: {
              'app.securityItem.reCheck': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/securityItem/reCheck/reCheck.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityItem.reCheck'
                  });
                  deferred.resolve(mod);
                }, 'reCheck-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--安检--待复检
      .state('securityItem.reCheckList', {
        url: '/reCheckList',
        access_url: 'securityItem.reCheck',
        views: {
          mainInfo: {
            // template: require('../pactl/security/securityItem/reCheck/reCheckList.html'),
            // controller: require('../pactl/security/securityItem/reCheck/reCheckList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/securityItem/reCheck/reCheckList.html');
                deferred.resolve(template);
              }, 'reCheckList-tmp');
              return deferred.promise;
            }],
            controller: 'reCheckListCtrl',
            resolve: {
              'app.securityItem.reCheckList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/securityItem/reCheck/reCheckList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityItem.reCheckList'
                  });
                  deferred.resolve(mod);
                }, 'reCheckList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--安检--运单信息
      .state('securityItem.info', {
        url: '/info?id',
        access_url: 'securityItem.reCheck',
        views: {
          mainInfo: {
            // template: require('../pactl/security/securityItem/info/info.html'),
            // controller: require('../pactl/security/securityItem/info/info.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/securityItem/info/info.html');
                deferred.resolve(template);
              }, 'info-tmp');
              return deferred.promise;
            }],
            controller: 'infoCtrl',
            resolve: {
              'app.securityItem.info': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/securityItem/info/info.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityItem.info'
                  });
                  deferred.resolve(mod);
                }, 'info-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--安检--备注
      .state('securityItem.remark', {
        url: '/remark?id&type',
        access_url: 'securityItem.reCheck',
        views: {
          mainInfo: {
            // template: require('../pactl/security/securityItem/remark/remark.html'),
            // controller: require('../pactl/security/securityItem/remark/remark.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/securityItem/remark/remark.html');
                deferred.resolve(template);
              }, 'remark-tmp');
              return deferred.promise;
            }],
            controller: 'remarkCtrl',
            resolve: {
              'app.securityItem.remark': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/securityItem/remark/remark.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityItem.remark'
                  });
                  deferred.resolve(mod);
                }, 'remark-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--安检--安检综合操作
      .state('securityItem.operate', {
        url: '/operate',
        access_url: 'securityItem.operate',
        views: {
          mainInfo: {
            // template: require('../pactl/security/securityItem/operate/operate.html'),
            // controller: require('../pactl/security/securityItem/operate/operate.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/securityItem/operate/operate.html');
                deferred.resolve(template);
              }, 'operate-tmp');
              return deferred.promise;
            }],
            controller: 'operateCtrl',
            resolve: {
              'app.securityItem.operate': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/securityItem/operate/operate.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityItem.operate'
                  });
                  deferred.resolve(mod);
                }, 'operate-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 安检--选项
    $stateProvider.state('securityOption', {
        url: '/securityOption',
        views: {
          main: {
            template: require('../pactl/security/option/optionIndex.html')
          }
        }
      })
      // 安检--选项--复检原因
      .state('securityOption.reason', {
        url: '/reason',
        access_url: 'securityOption.reason',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/reason/reason.html'),
            // controller: require('../pactl/security/option/reason/reason.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/reason/reason.html');
                deferred.resolve(template);
              }, 'reason-tmp');
              return deferred.promise;
            }],
            controller: 'reasonCtrl',
            resolve: {
              'app.securityOption.reason': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/reason/reason.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.reason'
                  });
                  deferred.resolve(mod);
                }, 'reason-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--扣押库
      .state('securityOption.seizure', {
        url: '/seizure',
        access_url: 'securityOption.seizure',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/seizure/seizure.html'),
            // controller: require('../pactl/security/option/seizure/seizure.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/seizure/seizure.html');
                deferred.resolve(template);
              }, 'seizure-tmp');
              return deferred.promise;
            }],
            controller: 'seizureCtrl',
            resolve: {
              'app.securityOption.seizure': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/seizure/seizure.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.seizure'
                  });
                  deferred.resolve(mod);
                }, 'seizure-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--危险品分类
      .state('securityOption.danger', {
        url: '/danger',
        access_url: 'securityOption.danger',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/danger/danger.html'),
            // controller: require('../pactl/security/option/danger/danger.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/danger/danger.html');
                deferred.resolve(template);
              }, 'danger-tmp');
              return deferred.promise;
            }],
            controller: 'dangerCtrl',
            resolve: {
              'app.securityOption.danger': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/danger/danger.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.danger'
                  });
                  deferred.resolve(mod);
                }, 'danger-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--24小时货通道
      .state('securityOption.aisle', {
        url: '/aisle',
        access_url: 'securityOption.aisle',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/aisle/aisle.html'),
            // controller: require('../pactl/security/option/aisle/aisle.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/aisle/aisle.html');
                deferred.resolve(template);
              }, 'aisle-tmp');
              return deferred.promise;
            }],
            controller: 'aisleCtrl',
            resolve: {
              'app.securityOption.aisle': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/aisle/aisle.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.aisle'
                  });
                  deferred.resolve(mod);
                }, 'aisle-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--安检机管理
      .state('securityOption.machine', {
        url: '/machine',
        access_url: 'securityOption.machine',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/machine/machine.html'),
            // controller: require('../pactl/security/option/machine/machine.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/machine/machine.html');
                deferred.resolve(template);
              }, 'machine-tmp');
              return deferred.promise;
            }],
            controller: 'machineCtrl',
            resolve: {
              'app.securityOption.machine': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/machine/machine.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.machine'
                  });
                  deferred.resolve(mod);
                }, 'machine-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--安检设备管理
      .state('securityOption.equipment', {
        url: '/equipment',
        access_url: 'securityOption.equipment',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/equipment/equipment.html'),
            // controller: require('../pactl/security/option/equipment/equipment.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/equipment/equipment.html');
                deferred.resolve(template);
              }, 'equipment-tmp');
              return deferred.promise;
            }],
            controller: 'equipmentCtrl',
            resolve: {
              'app.securityOption.equipment': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/equipment/equipment.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.equipment'
                  });
                  deferred.resolve(mod);
                }, 'equipment-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--安检分队管理
      .state('securityOption.contingent', {
        url: '/contingent',
        access_url: 'securityOption.contingent',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/contingent/contingent.html'),
            // controller: require('../pactl/security/option/contingent/contingent.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/contingent/contingent.html');
                deferred.resolve(template);
              }, 'contingent-tmp');
              return deferred.promise;
            }],
            controller: 'contingentCtrl',
            resolve: {
              'app.securityOption.contingent': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/contingent/contingent.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.contingent'
                  });
                  deferred.resolve(mod);
                }, 'contingent-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--安检分队管理
      .state('securityOption.detailInfo', {
        url: '/detailInfo?id',
        access_url: 'securityOption.contingent',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/contingent/detailInfo.html'),
            // controller: require('../pactl/security/option/contingent/detailInfo.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/contingent/detailInfo.html');
                deferred.resolve(template);
              }, 'detailInfo-tmp');
              return deferred.promise;
            }],
            controller: 'detailInfoCtrl',
            resolve: {
              'app.securityOption.detailInfo': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/contingent/detailInfo.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.detailInfo'
                  });
                  deferred.resolve(mod);
                }, 'detailInfo-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 安检--选项--安检章类型查询
      .state('securityOption.stampTypes', {
        url: '/stampTypes',
        access_url: 'securityOption.stampTypes',
        views: {
          mainInfo: {
            // template: require('../pactl/security/option/stampTypes/stampTypes.html'),
            // controller: require('../pactl/security/option/stampTypes/stampTypes.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/security/option/stampTypes/stampTypes.html');
                deferred.resolve(template);
              }, 'stampTypes-tmp');
              return deferred.promise;
            }],
            controller: 'stampTypesCtrl',
            resolve: {
              'app.securityOption.stampTypes': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/security/option/stampTypes/stampTypes.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.securityOption.stampTypes'
                  });
                  deferred.resolve(mod);
                }, 'stampTypes-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 航空公司
    $stateProvider.state('airline', {
        url: '/airline',
        access_url: 'airline',
        views: {
          main: {
            template: require('../pactl/air/airlineIndex.html')
          }
        }
      })
      //航空公司--统计---报表管理
      //航空公司--功能---综合操作
      .state('airline.airOperation', {
        url: '/airOperation?wStatus&littleTask&wbFocus$wbEle1',
        access_url: 'airline.airOperation',
        views: {
          mainInfo: {
            // template: require('../pactl/air/operation/operation.html'),
            // controller: require('../pactl/air/operation/operation.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/air/operation/operation.html');
                deferred.resolve(template);
              }, 'airOperation-tmp');
              return deferred.promise;
            }],
            controller: 'airOperationCtrl',
            resolve: {
              'app.airOperation': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/air/operation/operation.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.airOperation'
                  });
                  deferred.resolve(mod);
                }, 'airOperation-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // pactl--预审--收单--显示主单详细
      .state('airline.showMasterbill', {
        url: '/showMasterbill?waybillNo',
        access_url: 'airline.airOperation',
        views: {
          mainInfo: {
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.html');
                deferred.resolve(template);
              }, 'showMasterbill-tmp');
              return deferred.promise;
            }],
            controller: 'showMasterbillCtrl',
            resolve: {
              'app.pactlPrejudice.showMasterbill': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/pactl/prejudice/ordinaryCargo/showMasterbill.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.pactlPrejudice.showMasterbill'
                  });
                  deferred.resolve(mod);
                }, 'showMasterbill-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 系统设置
    $stateProvider.state('systemSet', {
        url: '/systemSet',
        views: {
          main: {
            template: require('../pactl/system/systemSet/systemIndex.html'),
            controller: require('../pactl/system/systemSet/systemIndex.ctrl.js')
          }
        }
      })
      // 系统设置--通用
      .state('systemSet.general', {
        url: '/general',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/general/general.html'),
            // controller: require('../pactl/system/systemSet/general/general.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/general/general.html');
                deferred.resolve(template);
              }, 'general-tmp');
              return deferred.promise;
            }],
            controller: 'generalCtrl',
            resolve: {
              'app.systemSet.general': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/general/general.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.general'
                  });
                  deferred.resolve(mod);
                }, 'general-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--业务参数
      .state('systemSet.params', {
        url: '/params',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/params/params.html'),
            // controller: require('../pactl/system/systemSet/params/params.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/params/params.html');
                deferred.resolve(template);
              }, 'params-tmp');
              return deferred.promise;
            }],
            controller: 'paramsCtrl',
            resolve: {
              'app.systemSet.params': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/params/params.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.params'
                  });
                  deferred.resolve(mod);
                }, 'params-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--消息模板
      .state('systemSet.msgTemp', {
        url: '/msgTemp',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/msgTemp/msgTemp.html'),
            // controller: require('../pactl/system/systemSet/msgTemp/msgTemp.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/msgTemp/msgTemp.html');
                deferred.resolve(template);
              }, 'msgTemp-tmp');
              return deferred.promise;
            }],
            controller: 'msgTempCtrl',
            resolve: {
              'app.systemSet.msgTemp': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/msgTemp/msgTemp.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.msgTemp'
                  });
                  deferred.resolve(mod);
                }, 'msgTemp-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--收件箱
      .state('systemSet.receiveEmail', {
        url: '/receiveEmail',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/email/receiveEmail.html'),
            // controller: require('../pactl/system/systemSet/email/receiveEmail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/email/receiveEmail.html');
                deferred.resolve(template);
              }, 'receiveEmail-tmp');
              return deferred.promise;
            }],
            controller: 'receiveEmailCtrl',
            resolve: {
              'app.systemSet.receiveEmail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/email/receiveEmail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.receiveEmail'
                  });
                  deferred.resolve(mod);
                }, 'receiveEmail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--发件箱
      .state('systemSet.sentEmail', {
        url: '/sentEmail',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/email/sentEmail.html'),
            // controller: require('../pactl/system/systemSet/email/sentEmail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/email/sentEmail.html');
                deferred.resolve(template);
              }, 'sentEmail-tmp');
              return deferred.promise;
            }],
            controller: 'sentEmailCtrl',
            resolve: {
              'app.systemSet.sentEmail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/email/sentEmail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.sentEmail'
                  });
                  deferred.resolve(mod);
                }, 'sentEmail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--邮件账号管理
      .state('systemSet.menageEmail', {
        url: '/menageEmail',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/email/menageEmail.html'),
            // controller: require('../pactl/system/systemSet/email/menageEmail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/email/menageEmail.html');
                deferred.resolve(template);
              }, 'menageEmail-tmp');
              return deferred.promise;
            }],
            controller: 'menageEmailCtrl',
            resolve: {
              'app.systemSet.menageEmail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/email/menageEmail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.menageEmail'
                  });
                  deferred.resolve(mod);
                }, 'menageEmail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--报文基础设置
      .state('systemSet.msgbase', {
        url: '/msgbase',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/message/base.html'),
            // controller: require('../pactl/system/systemSet/message/base.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/message/base.html');
                deferred.resolve(template);
              }, 'msgbase-tmp');
              return deferred.promise;
            }],
            controller: 'msgbaseCtrl',
            resolve: {
              'app.systemSet.msgbase': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/message/base.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.msgbase'
                  });
                  deferred.resolve(mod);
                }, 'msgbase-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--报文平台收发报设置
      .state('systemSet.msgSetting', {
        url: '/msgSetting',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/msgSetting/msgSetting.html'),
            // controller: require('../pactl/system/systemSet/msgSetting/msgSetting.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/msgSetting/msgSetting.html');
                deferred.resolve(template);
              }, 'msgSetting-tmp');
              return deferred.promise;
            }],
            controller: 'msgSettingCtrl',
            resolve: {
              'app.systemSet.msgSetting': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/msgSetting/msgSetting.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.msgSetting'
                  });
                  deferred.resolve(mod);
                }, 'msgSetting-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--备份
      .state('systemSet.backups', {
        url: '/backups',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/backups/backups.html'),
            // controller: require('../pactl/system/systemSet/backups/backups.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/backups/backups.html');
                deferred.resolve(template);
              }, 'backups-tmp');
              return deferred.promise;
            }],
            controller: 'backupsCtrl',
            resolve: {
              'app.systemSet.backups': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/backups/backups.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.backups'
                  });
                  deferred.resolve(mod);
                }, 'backups-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--管理员操作历史记录
      .state('systemSet.operationHistory', {
        url: '/operationHistory',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/senior/senior.html'),
            // controller: require('../pactl/system/systemSet/senior/senior.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/operationHistory/operationHistory.html');
                deferred.resolve(template);
              }, 'operationHistory-tmp');
              return deferred.promise;
            }],
            controller: 'operationHistoryCtrl',
            resolve: {
              'app.systemSet.operationHistory': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/operationHistory/operationHistory.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.operationHistory'
                  });
                  deferred.resolve(mod);
                }, 'operationHistory-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--高级
      .state('systemSet.senior', {
        url: '/senior',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/senior/senior.html'),
            // controller: require('../pactl/system/systemSet/senior/senior.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/senior/senior.html');
                deferred.resolve(template);
              }, 'senior-tmp');
              return deferred.promise;
            }],
            controller: 'seniorCtrl',
            resolve: {
              'app.systemSet.senior': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/senior/senior.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.senior'
                  });
                  deferred.resolve(mod);
                }, 'senior-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--界面显示
      .state('systemSet.UIdisplay', {
        url: '/UIdisplay',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/UIdisplay/UIdisplay.html'),
            // controller: require('../pactl/system/systemSet/UIdisplay/UIdisplay.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/UIdisplay/UIdisplay.html');
                deferred.resolve(template);
              }, 'UIdisplay-tmp');
              return deferred.promise;
            }],
            controller: 'UIdisplayCtrl',
            resolve: {
              'app.systemSet.UIdisplay': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/UIdisplay/UIdisplay.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.UIdisplay'
                  });
                  deferred.resolve(mod);
                }, 'UIdisplay-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--系统支持
      .state('systemSet.support', {
        url: '/support',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/support/support.html'),
            // controller: require('../pactl/system/systemSet/support/support.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/support/support.html');
                deferred.resolve(template);
              }, 'support-tmp');
              return deferred.promise;
            }],
            controller: 'supportCtrl',
            resolve: {
              'app.systemSet.support': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/support/support.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.support'
                  });
                  deferred.resolve(mod);
                }, 'support-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--安全
      .state('systemSet.secure', {
        url: '/secure',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/secure/secure.html'),
            // controller: require('../pactl/system/systemSet/secure/secure.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/secure/secure.html');
                deferred.resolve(template);
              }, 'secure-tmp');
              return deferred.promise;
            }],
            controller: 'secureCtrl',
            resolve: {
              'app.systemSet.secure': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/secure/secure.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.secure'
                  });
                  deferred.resolve(mod);
                }, 'secure-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 系统设置--预审邮件提醒
      .state('systemSet.preEmailNotice', {
        url: '/preEmailNotice',
        access_url: 'systemSet.general',
        views: {
          mainInfo: {
            // template: require('../pactl/system/systemSet/secure/secure.html'),
            // controller: require('../pactl/system/systemSet/secure/secure.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/systemSet/preEmailNotice/preEmailNotice.html');
                deferred.resolve(template);
              }, 'preEmailNotice-tmp');
              return deferred.promise;
            }],
            controller: 'preEmailNoticeCtrl',
            resolve: {
              'app.systemSet.preEmailNotice': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/systemSet/preEmailNotice/preEmailNotice.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.systemSet.preEmailNotice'
                  });
                  deferred.resolve(mod);
                }, 'preEmailNotice-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
    // 系统设置--正式运单规则
    .state('systemSet.officialRule', {
      url: '/officialRule',
      access_url: 'systemSet.general',
      views: {
        mainInfo: {
          // template: require('../pactl/system/systemSet/secure/secure.html'),
          // controller: require('../pactl/system/systemSet/secure/secure.ctrl.js')
          templateProvider: ['$q', function ($q) {
            var deferred = $q.defer();
            require.ensure([], function (require) {
              var template = require('../pactl/system/systemSet/officialRule/officialRule.html');
              deferred.resolve(template);
            }, 'officialRule-tmp');
            return deferred.promise;
          }],
          controller: 'officialRuleCtrl',
          resolve: {
            'app.systemSet.officialRule': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
              var deferred = $q.defer();
              require.ensure([], function () {
                var mod = require('../pactl/system/systemSet/officialRule/officialRule.ctrl.js');
                $ocLazyLoad.load({
                  name: 'app.systemSet.officialRule'
                });
                deferred.resolve(mod);
              }, 'officialRule-ctl');
              return deferred.promise;
            }]
          }
        }
      }
    })
    // 用户管理
    $stateProvider.state('user', {
        url: '/user',
        views: {
          main: {
            template: require('../pactl/system/user/userIndex.html'),
            controller: require('../pactl/system/user/userIndex.ctrl.js')
          }
        }
      })
      // 用户管理--用户
      .state('user.user', {
        url: '/user?userGroup',
        access_url: 'user.user',
        views: {
          mainInfo: {
            // template: require('../pactl/system/user/user/user.html'),
            // controller: require('../pactl/system/user/user/user.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/user/user/user.html');
                deferred.resolve(template);
              }, 'user-tmp');
              return deferred.promise;
            }],
            controller: 'userCtrl',
            resolve: {
              'app.user.user': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/user/user/user.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.user.user'
                  });
                  deferred.resolve(mod);
                }, 'user-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 用户管理--用户组
      .state('user.userGroup', {
        url: '/userGroup',
        access_url: 'user.user',
        views: {
          mainInfo: {
            // template: require('../pactl/system/user/userGroup/userGroup.html'),
            // controller: require('../pactl/system/user/userGroup/userGroup.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/user/userGroup/userGroup.html');
                deferred.resolve(template);
              }, 'userGroup-tmp');
              return deferred.promise;
            }],
            controller: 'userGroupCtrl',
            resolve: {
              'app.user.userGroup': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/user/userGroup/userGroup.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.user.userGroup'
                  });
                  deferred.resolve(mod);
                }, 'userGroup-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 用户管理--微信用户管理
      .state('user.weChat', {
        url: '/weChat',
        access_url: 'user.user',
        views: {
          mainInfo: {
            // template: require('../pactl/system/user/weChatGroup/weChat.html'),
            // controller: require('../pactl/system/user/weChatGroup/weChat.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/user/weChatGroup/weChat.html');
                deferred.resolve(template);
              }, 'weChat-tmp');
              return deferred.promise;
            }],
            controller: 'weChatCtrl',
            resolve: {
              'app.user.weChat': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/user/weChatGroup/weChat.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.user.weChat'
                  });
                  deferred.resolve(mod);
                }, 'weChat-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 用户管理--角色
      .state('user.role', {
        url: '/role',
        access_url: 'user.user',
        views: {
          mainInfo: {
            // template: require('../pactl/system/user/role/role.html'),
            // controller: require('../pactl/system/user/role/role.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/user/role/role.html');
                deferred.resolve(template);
              }, 'role-tmp');
              return deferred.promise;
            }],
            controller: 'roleCtrl',
            resolve: {
              'app.user.role': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/user/role/role.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.user.role'
                  });
                  deferred.resolve(mod);
                }, 'role-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 用户管理--可转授权的角色列表
      .state('user.roleList', {
        url: '/roleList',
        access_url: 'user.user',
        views: {
          mainInfo: {
            // template: require('../pactl/system/user/roleList/roleList.html'),
            // controller: require('../pactl/system/user/roleList/roleList.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/user/roleList/roleList.html');
                deferred.resolve(template);
              }, 'roleList-tmp');
              return deferred.promise;
            }],
            controller: 'roleListCtrl',
            resolve: {
              'app.user.roleList': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/user/roleList/roleList.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.user.roleList'
                  });
                  deferred.resolve(mod);
                }, 'roleList-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });
    // 机构管理
    $stateProvider.state('unit', {
        url: '/unit',
        views: {
          main: {
            template: require('../pactl/system/unit/unitIndex.html'),
            controller: require('../pactl/system/unit/unitIndex.ctrl.js')
          }
        }
      })
      // 机构管理--机构
      .state('unit.unit', {
        url: '/unit',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/unit/unit.html'),
            // controller: require('../pactl/system/unit/unit/unit.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/unit/unit.html');
                deferred.resolve(template);
              }, 'unit-tmp');
              return deferred.promise;
            }],
            controller: 'unitCtrl',
            resolve: {
              'app.unit.unit': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/unit/unit.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.unit'
                  });
                  deferred.resolve(mod);
                }, 'unit-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 机构管理--权限方案
      .state('unit.permissionPlan', {
        url: '/permissionPlan',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/permissionPlan/permissionPlan.html'),
            // controller: require('../pactl/system/unit/permissionPlan/permissionPlan.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/permissionPlan/permissionPlan.html');
                deferred.resolve(template);
              }, 'permissionPlan-tmp');
              return deferred.promise;
            }],
            controller: 'permissionPlanCtrl',
            resolve: {
              'app.unit.permissionPlan': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/permissionPlan/permissionPlan.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.permissionPlan'
                  });
                  deferred.resolve(mod);
                }, 'permissionPlan-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 机构管理--权限方案--权限方案和角色关联
      .state('unit.permissionRole', {
        url: '/permissionRole?id&name',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/permissionPlan/permissionRole.html'),
            // controller: require('../pactl/system/unit/permissionPlan/permissionRole.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/permissionPlan/permissionRole.html');
                deferred.resolve(template);
              }, 'permissionRole-tmp');
              return deferred.promise;
            }],
            controller: 'permissionRoleCtrl',
            resolve: {
              'app.unit.permissionRole': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/permissionPlan/permissionRole.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.permissionRole'
                  });
                  deferred.resolve(mod);
                }, 'permissionRole-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 机构管理--权限集合
      .state('unit.permissionSet', {
        url: '/permissionSet',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/permissionSet/permissionSet.html'),
            // controller: require('../pactl/system/unit/permissionSet/permissionSet.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/permissionSet/permissionSet.html');
                deferred.resolve(template);
              }, 'permissionSet-tmp');
              return deferred.promise;
            }],
            controller: 'permissionSetCtrl',
            resolve: {
              'app.unit.permissionSet': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/permissionSet/permissionSet.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.permissionSet'
                  });
                  deferred.resolve(mod);
                }, 'permissionSet-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 机构管理--权限集合
      .state('unit.permissionSetDetail', {
        url: '/permissionSetDetail?id&name&title',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/permissionSet/permissionSetDetail.html'),
            // controller: require('../pactl/system/unit/permissionSet/permissionSetDetail.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/permissionSet/permissionSetDetail.html');
                deferred.resolve(template);
              }, 'permissionSetDetail-tmp');
              return deferred.promise;
            }],
            controller: 'permissionSetDetailCtrl',
            resolve: {
              'app.unit.permissionSetDetail': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/permissionSet/permissionSetDetail.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.permissionSetDetail'
                  });
                  deferred.resolve(mod);
                }, 'permissionSetDetail-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      // 机构管理--机构和操作员的关系
      .state('unit.relation', {
        url: '/relation',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/relation/relation.html'),
            // controller: require('../pactl/system/unit/relation/relation.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/relation/relation.html');
                deferred.resolve(template);
              }, 'relation-tmp');
              return deferred.promise;
            }],
            controller: 'relationCtrl',
            resolve: {
              'app.unit.relation': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/relation/relation.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.relation'
                  });
                  deferred.resolve(mod);
                }, 'relation-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      //pactl-操作代理管理
      .state('unit.operAgent', {
        url: '/operAgent',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/operAgent/operAgent.html'),
            // controller: require('../pactl/system/unit/operAgent/operAgent.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/operAgent/operAgent.html');
                deferred.resolve(template);
              }, 'operAgent-tmp');
              return deferred.promise;
            }],
            controller: 'operAgentCtrl',
            resolve: {
              'app.unit.operAgent': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/operAgent/operAgent.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.operAgent'
                  });
                  deferred.resolve(mod);
                }, 'operAgent-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      })
      .state('unit.resource', {
        url: '/resource',
        access_url: 'unit.unit',
        views: {
          mainInfo: {
            // template: require('../pactl/system/unit/resource/resource.html'),
            // controller: require('../pactl/system/unit/resource/resource.ctrl.js')
            templateProvider: ['$q', function ($q) {
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var template = require('../pactl/system/unit/resource/resource.html');
                deferred.resolve(template);
              }, 'resource-tmp');
              return deferred.promise;
            }],
            controller: 'resourceCtrl',
            resolve: {
              'app.unit.resource': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function () {
                  var mod = require('../pactl/system/unit/resource/resource.ctrl.js');
                  $ocLazyLoad.load({
                    name: 'app.unit.resource'
                  });
                  deferred.resolve(mod);
                }, 'resource-ctl');
                return deferred.promise;
              }]
            }
          }
        }
      });

    //报表
    $stateProvider.state('reports', {
      url: '/reports',
      views: {
        main: {
          template: require('../pactl/reports/reportsIndex.html'),
          controller: require('../pactl/reports/reportsIndex.ctrl.js')
        }
      }
    })
    // 机构管理--机构
    .state('reports.statement', {
      url: '/statement?url&resName',
      access_url: 'reports.statement',
      views: {
        mainInfo: {
          templateProvider: ['$q', function ($q) {
            var deferred = $q.defer();
            require.ensure([], function (require) {
              var template = require('../pactl/reports/statement/statement.html');
              deferred.resolve(template);
            }, 'statement-tmp');
            return deferred.promise;
          }],
          controller: 'statementCtrl',
          resolve: {
            'app.reports.statement': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
              var deferred = $q.defer();
              require.ensure([], function () {
                var mod = require('../pactl/reports/statement/statement.ctrl.js');
                $ocLazyLoad.load({
                  name: 'app.reports.statement'
                });
                deferred.resolve(mod);
              }, 'statement-ctl');
              return deferred.promise;
            }]
          }
        }
      }
    });
  }
];
module.exports = route;