'use strict';

var jsSHA = require('../../lib/sha1/sha1.js');

module.exports = ['$scope', 'restAPI', 'Auth', '$state', '$translatePartialLoader', 'ipCookie', '$rootScope', '$modal', 'expires', 'Notification', '$interval',
  function ($scope, restAPI, Auth, $state, $translatePartialLoader, ipCookie, $rootScope, $modal, expires, Notification, $interval) {
    $translatePartialLoader.addPart('login');
    var vm = $scope;
    var timer = null;
    vm.user = {};
    var remember = isRemember();
    vm.createQrCode = createQrCode;
    vm.login = loginFn;
    vm.rememberMe = rememberMe;
    vm.qrcodeLogin = qrcodeLogin;
    vm.itemTimeout = false;
    vm.codeFlag = false;
    vm.changeCode=changeCode
    vm.imgCode = "";
    createQrCode();
    /**
     * 获取二维码
     */
    function createQrCode() {
      vm.itemTimeout = false;
      restAPI.createQrCode.get({}).$promise.then(function (resp) {
        if (resp.success) {
          getQrCode(resp);
        } else {
          Notification.error({
            message: '二维码请求异常，请重试'
          });
        }
      });
    }
    /**
     * 获取二维码图片
     * @param {*} params 
     */
    function getQrCode(params) {
      restAPI.getQrCode.getString({
        ticket: params.ticket
      }).$promise.then(function (resp) {
          $scope.wechatUrl = 'data:image/jpeg;base64,' + resp.data;
          requestSceneId(params.scene_id);
      });
    }
    /**
     * 请求成功时向后台发送sceneId
     */
    function requestSceneId(sceneId) {
      if (sceneId) {
        restAPI.requestSceneId.get({
          sceneId: sceneId
        }).$promise.then(function (resp) {
          if (resp.ok) {
            loginByQrCode(resp);
          }else{
            Notification.error({
              message: resp.msg
            });
           createQrCode();
          }
        }, function (resp) {
          vm.itemTimeout = true;
        });
      } else {
        Notification.error({
          message: '二维码请求异常，请重试'
        });
      }
    }
    /**
     * 二维码登陆
     *  
     */
    function loginByQrCode(resp) {
      if (!resp) {
        return;
      }
      if (resp.ok) {
        setLang();
        selectMyAgent(resp);
      } else {
        Notification.error({
          message: resp.msg
        });
      }
    }
    /**
     * 二维码登录 by lixd
     */
    function qrcodeLogin() {
      var qrcodeLog = $modal.open({
        template: require('./qrcode.html'),
        controller: require('./qrcode.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {};
          }
        }
      });
      qrcodeLog.result.then(function (resp) {
        if (!resp) {
          return;
        }
        if (resp.ok) {
          setLang();
          selectMyAgent(resp);
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      }, function (resp) {

      });
    };
    /**
     * 登录
     */
    function loginFn() {
      if (!(vm.user.password && vm.user.username)) {
        Notification.error({
          message: '用户名或密码为空'
        });
        return false;
      }
      var obj = getData();
      $rootScope.loading = true;
      restAPI.login.save({}, $.param(obj))
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (vm.user.checked) {
              ipCookie('rem', {
                'username': obj.username,
                'password': obj.password,
                'checkCode':obj.checkCode,
                'checked': true
              }, expires);
            } else {
              ipCookie.remove('rem');
            }
            setLang();
            selectMyAgent(resp);
          } else {
        	  if(resp.data){
        		  vm.codeFlag = true;
        		  vm.imgCode ='data:image/jpeg;base64,'+ resp.data
        	  }
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 点击切换验证码
     */
    function changeCode(){
    	restAPI.imgCode.save(vm.user.username).$promise.then(function(resp){
    		 vm.imgCode ='data:image/jpeg;base64,'+ resp.data;
    	})
    }
    /**
     * 登录参数
     */
    function getData() {
      var obj = {};
      var hashObj = new jsSHA('SHA-1', 'TEXT');
      hashObj.update(vm.user.password);
      obj.username = vm.user.username;
      obj.checkCode = vm.user.checkCode;
      if (remember) {
        if (vm.user.password === remember.password) {
          obj.password = remember.password;
        } else {
          obj.password = hashObj.getHash('HEX');
        }
      } else {
        obj.password = hashObj.getHash('HEX');
      }
      return obj;
    }
    /**
     * 记住密码
     *
     * @param {obj} event
     */
    function rememberMe(event) {
      var checkbox = event.target;
      vm.user.checked = checkbox.checked;
    }
    /**
     * 是否记住用户名和密码
     */
    function isRemember() {
      var rem = ipCookie('rem');
      if (rem) {
        vm.user = angular.copy(rem);
        return rem;
      } else {
        return false;
      }
    }
    /**
     * 设置语言
     */
    function setLang() {
      if (!ipCookie('language')) {
        ipCookie('language', 'CN', expires);
      }
    }
    /**
     * 选择组织
     */
    function selectMyAgent(resp) {
      var user = JSON.parse(resp.data).user,
        token = JSON.parse(resp.data).token;
      var agnetDialog = $modal.open({
        template: require('./myAgent.html'),
        controller: require('./myAgent.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              token: token,
              creatorId: user.id,
              creator: user.fullname
            };
          }
        }
      });
      agnetDialog.result.then(function (data) {
        if(data.unitType === 'security') {
          //queryUnitIsValid(user,token,data);
          getSecurityEasyCargoAgreeBook(user,token,data);
        } else {
          getPageOption(user,token,data);
        }
      }, function (resp) {

      });
    }

    function getSecurityEasyCargoAgreeBook(user,token,data) {
      $rootScope.loading = true;
      restAPI.systemSet.querySingleSet.save({},'agreeBook')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length>0) {
            var securityEasyCargoAgreeBook = resp.data.regVal;
            var agnetDialog = $modal.open({
              template: require('./securityEasyCargoAgreeBook.html'),
              controller: require('./securityEasyCargoAgreeBook.ctrl.js'),
              size: 'lg',
              backdrop: 'static',
              keyboard: false,
              resolve: {
                items: function () {
                  return {
                    securityEasyCargoAgreeBook: securityEasyCargoAgreeBook
                  };
                }
              }
            });
            agnetDialog.result.then(function (returnData) {
              getPageOption(user,token,data);
            }, function (resp) {
      
            });
          } else {
            getPageOption(user,token,data);
          }
        });
    }


    function getPageOption(user,token,data) {
      $rootScope.loading = true;
      restAPI.systemSet.pageOption.save({},{})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            ipCookie('systemSet_pageOption', resp.data, expires);
          } else {
            ipCookie('systemSet_pageOption', null, expires);
          }
          gotoIndex(user,token,data);
        });
    }

    function queryUnitIsValid(user,token,data) {
      $rootScope.loading = true;
      restAPI.reCheck.queryUnitIsValid.save({},{})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok && resp.data) {
            if(resp.data.isAdmin === "1" || resp.data.isValid === "1") {
              $state.go('index');
            } else {
              Notification.error("当前用户安检分队信息无效,请联系管理员处理");
              ipCookie('USKY_UNI_TOKEN', '', expires);
            }
          } else {
            Notification.error("获取分队信息失败,请联系管理员:"+resp.msg);
            ipCookie('USKY_UNI_TOKEN', '', expires);
          }
        });
    }


    function gotoIndex(user,token,data) {
        Auth.setUser({
          userid: user.id,
          username: user.fullname,
          account: user.account,
          avatar: data.avatarUrl,
          token: token,
          unit: data.id,
          unitCode: data.code,
          myunit: data.myUnit,
          myUnitCode: data.myUnitCode,
          unitType: data.unitType,
          myUnitName: data.name,
        });
        $rootScope.account = user.account;
        ipCookie('unit', data.id, expires);
        if(data.unitType === 'security') {
          queryUnitIsValid(user,token,data);
        }  else {
          $state.go('index');
        }
    }
    /****************************************************** */
    var slideEle = slider($('.items'));

    function slider(elem) {
      var items = elem.children(),
        max = items.length - 1,
        animating = false,
        currentElem,
        nextElem,
        pos = 0;
      sync();
      return {
        next: function () {
          move(1);
        },
        prev: function () {
          move(-1);
        },
        itemsNum: items && items.length
      };

      function move(dir) {
        if (animating) {
          return;
        }
        if (dir > 0 && pos == max || dir < 0 && pos == 0) {
          if (dir > 0) {
            nextElem = elem.children('div').first().remove();
            nextElem.hide();
            elem.append(nextElem);
          } else {
            nextElem = elem.children('div').last().remove();
            nextElem.hide();
            elem.prepend(nextElem);
          }
          pos -= dir;
          sync();
        }
        animating = true;
        items = elem.children();
        currentElem = items[pos + dir];
        $(currentElem).fadeIn(400, function () {
          pos += dir;
          animating = false;
        });
      }

      function sync() {
        items = elem.children();
        for (var i = 0; i < items.length; ++i) {
          items[i].style.display = i == pos ? 'block' : '';
        }
      }

    }
    // if (slideEle.itemsNum && slideEle.itemsNum > 1) {
    //   timer = $interval(function () {
    //     slideEle.next();
    //   }, 4000);
    // }
    // $scope.$on('$destroy', function () {
    //   $interval.cancel(timer);
    // });
    $scope.$on('resp-err', function (e, data) {
      Notification.error(data);
    });
  }
];