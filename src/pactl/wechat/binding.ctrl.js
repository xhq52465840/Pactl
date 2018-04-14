'use strict';
require('./bower_components/weui/weui.min.css');
module.exports = ['$scope', '$http', '$rootScope', '$filter',
  function($scope, $http, $rootScope, $filter) {
    'use strict';
    var jsSHA = require('./sha1.js');
    var vm = $scope;
    vm.bindingData = {};
    vm.submitBinding = submitBinding;
    vm.btn = {
      isShow: false,
      isEmployeeAccount: false,
      isEmployeeName: false,
      isAgentCode: false,
      isPactlAccount: false,
      ispassword: false,
    };
    // 获取url里的参数
    function GetRequest() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      };
      return theRequest;
    };
    var stateParams = GetRequest();
    if (stateParams.isPactl === 'true') {
      vm.btn.isShow = true;
    } else {
      vm.btn.isShow = false;
    };
    vm.nocheck = false;
    // vm.agentData = [];
    /**
     * 获取机构
     */
    // function searchUnits() {
    //   $http.get('/api/wechat/wechat/bind/searchUnits').then(function(resp) {
    //     vm.agentData = resp.data;
    //   }, function(err) {});
    // };
    // searchUnits();
    /**
     * 确认绑定
     */
    function submitBinding() {
      if (vm.btn.isShow) {
        pactlBinding();
      } else {
        agentBinding();
      }
    };
    /**
     * agent绑定
     */
    function agentBinding() {
      if (!vm.bindingData.employeeAccount) {
        vm.btn.isEmployeeAccount = true;
        return;
      }
      if (!vm.bindingData.employeeName) {
        vm.btn.isEmployeeName = true;
        return;
      }
      if (!vm.bindingData.agentCode) {
        vm.btn.isAgentCode = true;
        return;
      }
      if (!vm.bindingData.pactlAccount) {
        vm.btn.isPactlAccount = true;
        return;
      }
      if (!vm.bindingData.password) {
        vm.btn.ispassword = true;
        return;
      }
      var hashObj = new jsSHA('SHA-1', 'TEXT');
      hashObj.update(vm.bindingData.password);
      var password = angular.copy(hashObj.getHash('HEX'));
      $http({
          url: '/api/wechat/wechat/bind/create',
          method: "POST",
          data: {
            "employeeAccount": vm.bindingData.employeeAccount,
            "employeeName": vm.bindingData.employeeName,
            "agentCode": vm.bindingData.agentCode,
            "pactlAccount": vm.bindingData.pactlAccount,
            "password": password,
            "code": stateParams.code,
            "bindType": "1"
          }
        })
        .then(function(resp) {
            if (resp.data.success) {
              alert('绑定成功');
              wx.closeWindow();
              // WeixinJSBridge.call('closeWindow'); //微信端关闭当前页面
            } else {
              alert(resp.data.reason);
            }
          },
          function(resp) {
            // failed
            alert("请求失败！");
          });
    }
    /**
     * pactl绑定
     */
    function pactlBinding() {
      if (!vm.bindingData.employeeAccount) {
        vm.btn.isEmployeeAccount = true;
        return;
      }
      if (!vm.bindingData.employeeName) {
        vm.btn.isEmployeeName = true;
        return;
      }
      if (!vm.bindingData.agentCode) {
        vm.btn.isAgentCode = true;
        return;
      }
      $http({
          url: '/api/wechat/wechat/bind/create',
          method: "POST",
          data: {
            "employeeAccount": vm.bindingData.employeeAccount,
            "employeeName": vm.bindingData.employeeName,
            "agentCode": vm.bindingData.agentCode,
            "code": stateParams.code,
            "bindType": "0"
          }
        })
        .then(function(resp) {
            if (resp.data.success) {
              alert('已提交后台审核');
              WeixinJSBridge.call('closeWindow'); //微信端关闭当前页面
            } else {
              alert(resp.data.reason);
            }
          },
          function(resp) {
            // failed
            alert("请求失败！");
          });
    }
    /**
     * 关闭弹窗
     */
    vm.cancel = function() {
      vm.btn.isEmployeeAccount = false;
      vm.btn.isEmployeeName = false;
      vm.btn.isAgentCode = false;
      vm.btn.isPactlAccount = false;
      vm.btn.ispassword = false;
    }
  }
];