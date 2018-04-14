'use strict';

module.exports = ['$scope', 'Auth', '$translate', '$translatePartialLoader', 'ipCookie', '$state', 'restAPI', '$modal', '$rootScope', '$window', 'Notification', 'expires',
  function ($scope, Auth, $translate, $translatePartialLoader, ipCookie, $state, restAPI, $modal, $rootScope, $window, Notification, expires) {
    $translatePartialLoader.addPart('head');
    $rootScope.noflash = false;
    var vm = $scope;
    vm.allMsg = {};
    vm.changeUnit = changeUnit;
    vm.searchData = {
      input: '',
      searchText: searchText
    };
    vm.language = ipCookie('language');
    vm.logout = logout;
    vm.menus = [];
    vm.notip = notip;
    vm.pactlReceive = pactlReceive;
    vm.pactlPrejudice = pactlPrejudice;
    vm.switchLang = switchLang;
    vm.settingMenu = {};
    vm.user = Auth.getUser();
    vm.unit = Auth.getUnitId();
    vm.unitType = Auth.getUnitType();
    vm.changePassword = changePassword;

    vm.hasPermission = false;
    var hasPermission = true;
    getPermission1();

    function getPermission1() {
      $rootScope.loading = true;
      restAPI.permission.getPermission.query({
        tokens: Auth.getUser().token,
        unitid: Auth.getUser().unit,
        resId: '888001'
      }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp && resp.length && resp.length > 0) {
            var res = resp[0];
            if (res.resId === '888001') {
              hasPermission = false;
            } 
          } 
          getPermission2();
        });
    }

    function getPermission2() {
      $rootScope.loading = true;
      restAPI.permission.getPermission.query({
        tokens: Auth.getUser().token,
        unitid: Auth.getUser().unit,
        resId: '888002'
      }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp && resp.length && resp.length > 0) {
            var res = resp[0];
            if (res.resId === '888002') {
              hasPermission = false;
            } 
          } 
          vm.hasPermission = hasPermission;
        });
    }

    init();

    /**
     * 获取所有的基础设置
     */
    function init() {
      var data = $window.sessionStorage.getItem('menu');
      var dataUnit = $window.sessionStorage.getItem('unitid');
      if (+dataUnit !== Auth.getUnitId()) {
        getAgent();
      } else {
        try {
          data = JSON.parse(data);
        } catch (error) {
          data = [];
        }
        if (data && data.length) {
          changeMenu(data)
        } else {
          getAgent();
        }
      }
    }
    /**
     * 获取组织机构
     */
    function getAgent(callback) {
      $rootScope.loading = true;
      restAPI.agent.myUnits.get({
          token: Auth.getUser().token
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          var unitData = [];
          angular.forEach(resp.units, function (v, k) {
            unitData.push({
              id: v.id,
              name: v.code, // 两个对调，是为了和后台数据匹配，来显示数据
              code: v.name,
              unitType: v.unitType,
              avatarUrl: v.avatarUrl
            });
          });
          getMenu(unitData, callback);
        });
    }
    /**
     * 获取所有的菜单
     */
    function getMenu(data, callback) {
      $rootScope.loading = true;
      restAPI.menu.getMenu.query({
          tokens: Auth.getUser().token,
          unitid: Auth.getUser().unit
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          changeMenu(resp, data);
          callback && callback();
        });
    }
    /**
     * 对菜单做出修改
     */
    function changeMenu(resp, data) {
      if (!angular.isArray(resp) || resp.length < 1) {
        Notification.error({
          message: '您没有操作权限'
        });        
        $rootScope.logout();
      }
      var index = -1;
      var menuList = [];
      resp = resp || [];
      angular.forEach(resp, function (v, k) {
        if (v.menuClass === 'i-home') {
          data && (v.childs = data);
        }
        if (v.url === 'setting') {
          index = k;
        }
        v.url && menuList.push(v.url);
        angular.forEach(v.childs, function (m, n) {
          m.url && menuList.push(m.url);
        });
      });
      if (data) {
        menuList.push('index');
        $window.sessionStorage.setItem('menu', JSON.stringify(resp));
        $window.sessionStorage.setItem('menuList', JSON.stringify(menuList));
        $window.sessionStorage.setItem('unitid', Auth.getUnitId());
      }
      index > -1 && (vm.settingMenu = resp.splice(index, 1)[0]);
      vm.menus = resp;
    }
    /**
     * 切换组织机构
     */
    function changeUnit(param) {
      Auth.setUser({
        userid: vm.user.userid,
        username: vm.user.username,
        account: vm.user.account,
        avatar: param.avatarUrl,
        token: vm.user.token,
        unit: param.id,
        unitCode: param.name,
        myunit: vm.user.myunit,
        myUnitCode: vm.user.myUnitCode,
        unitType: param.unitType,
        myUnitName: param.code,
      });
      ipCookie('unit', param.id, expires);
      var callback = function () {
        $state.go('index', {}, {
          reload: true
        });
      };
      getAgent(callback);
    }
    /**
     * 查询
     */
    function searchText() {
      var input = vm.searchData.input.replace(/-/, '');
      if (input && input.length === 11) {
        switch (vm.unitType) {
          case 'security':
            goToSecurity(input);
            break;
          case 'agency':
            goToAgency(input);
            break;
          case 'terminal':
            goToPactl(input);
            break;
        }
      } else {
        Notification.error({
          message: '运单号格式不正确'
        });
      }
    }
    /**
     * 代理跳转
     */
    function goToAgency(data) {
      restAPI.bill.billInfo.save({}, {
          waybillNo: data,
          type: '0'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
              goToAgency2(resp.data.pAirWaybillInfo.awId, data);
            } else {
              Notification.error({
                message: '未查到运单'
              });
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 校验代理跳转
     */
    function goToAgency2(data1, data2) {
      $rootScope.loading = true;
      restAPI.bill.billAudit2.save({}, {
          awId: data1
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            $state.go('agentPrejudice.pre', {
              awId: data1
            });
          } else {
            $state.go('agentWaybill.newMasterBill', {
              billNo: data2
            });
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 安检跳转
     */
    function goToSecurity(data) {
      $rootScope.loading = true;
      restAPI.reCheck.operateList.save({}, {
          page: 1,
          rows: 1,
          waybillno: data
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.total) {
            var respData = resp.rows[0];
            $state.go('securityItem.info', {
              id: respData.awId
            });
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }
    /**
     * pactl跳转
     */
    function goToPactl(data) {
      $rootScope.loading = true;
      restAPI.waybill.billdetail.save({}, {
          page: 1,
          rows: 1,
          billNO: data
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            $state.go('pactlReceive.acceptanceList', {
              'billNO': data
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 切换语言
     * 
     * @param {string} langKey
     */
    function switchLang(langKey) {
      $translate.use(langKey);
      ipCookie('language', langKey, expires);
      vm.language = langKey;
      getAgent();
    }
    /**
     * 注销
     */
    function logout() {
      $rootScope.logout();
    }
    /**
     * pactl 收单
     */
    function pactlReceive() {
      vm.pactlReceiveDialog = $modal.open({
        template: require('../pactl/receive/acceptance/search.html'),
        controller: require('../pactl/receive/acceptance/search.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
      vm.pactlReceiveDialog.result.then(function (data) {

      }, function (resp) {
        vm.pactlReceiveDialog = '';
      });
    }
    /**
     * pactl 单票运单预审
     */
    function pactlPrejudice() {
      $modal.open({
        template: require('../pactl/prejudice/search/search.html'),
        controller: require('../pactl/prejudice/search/search.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
    }
    /**
     * 
     */
    $scope.$on('to-head', function (event, data) {
      if (!vm.pactlReceiveDialog) {
        pactlReceive();
      }
    });
    /**
     * 不再提醒
     */
    function notip() {
      $rootScope.noflash = false;
    }

    function changePassword() {
      var passwordDialog = $modal.open({
        template: require('./changepassword.html'),
        controller: require('./changepassword.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
      passwordDialog.result.then(function (data) {

      }, function (resp) {

      });        
    }
    $scope.$watch('searchData.input', function (newVal, oldVal) {
      if (newVal) {
        try {
          var data = newVal.replace(/[^0-9]/g, ''),
            data1 = '',
            data2 = '';
          if (data.length > 3) {
            data1 = data.substr(0, 3);
            data2 = data.substr(3, 8);
            vm.searchData.input = data1 + '-' + data2;
          } else {
            vm.searchData.input = data;
          }
        } catch (e) {}
      }
    });
    $scope.$on('resp-err', function (e, data) {
      Notification.error(data);
    });
  }
];