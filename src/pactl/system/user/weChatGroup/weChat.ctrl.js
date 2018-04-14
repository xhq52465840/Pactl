'use strict';

var jsSHA = require('../../../../lib/sha1/sha1.js');

var weChat_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams',
  function($scope, Page, restAPI, $modal, Notification, $rootScope, $stateParams) {
    var vm = $scope;
    vm.agentData = [];
    vm.bound = bound;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.unbound = unbound;
    vm.remove = remove;
    vm.search = search;
    vm.wechat = {};
    vm.getAgent=getAgent;
    getAgent();
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.wechat.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.wechatData = resp.result;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.currentPage
      };
      vm.wechat.nickName && (obj.nickName = vm.wechat.nickName);
      vm.wechat.employeeName && (obj.employeeName = vm.wechat.employeeName);
      vm.wechat.agentCode && (obj.agentCode = vm.wechat.agentCode.code);
      vm.wechat.createDate && (obj.createDate = vm.wechat.createDate);
      vm.wechat.pactlAccount && (obj.pactlAccount = vm.wechat.pactlAccount);
      vm.wechat.status && (obj.status = vm.wechat.status.id);
      vm.wechat.idCard && (obj.idCard = vm.wechat.idCard);
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }

    /**
     * 获取机构
     */
    function getAgent() {
      restAPI.unit.units.query({}, {})
        .$promise.then(function(resp) {
          vm.agentData = resp;
          search();
        });
    }
    /**
     * 获取状态值，"CHECK"-待审核,"BIND"-已绑定,"UNBIND"-已解绑
     */
    vm.statusData = [{
      'id': 'CHECK',
      'name': '待审核'
    }, {
      'id': 'BIND',
      'name': '已绑定'
    }, {
      'id': 'UNBIND',
      'name': '已解绑'
    }];

    /**
     * 绑定
     */
    function bound(param) {
      if (param.pactlAccount) {
        withPactlBound(param);
      } else if (!param.pactlAccount) {
        withoutPactlBound(param);
      };
    }
    /**
     * 不带“系统用户”值得用户绑定
     */
    function withoutPactlBound(param) {
      var withBoDialog = $modal.open({
        template: require('./boundWechat.html'),
        controller: require('./boundWechat.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '绑定：' + param.nickname,
              agentData: vm.agentData,
              obj: {
                nickname: param.nickname,
                employeeAccount: param.employeeAccount,
                employeeName: param.employeeName,
                agentCode: param.agentCode,
                created: param.created,
                idCard: param.idCard
              },
            };
          }
        }
      });
      withBoDialog.result.then(function(data) {
        $rootScope.loading = true;
        var obj = {};
        obj.pactlAccount = data.pactlAccount ? data.pactlAccount.account : '';
        obj.id = param.id;
        restAPI.wechat.bound.get(obj, {}).$promise.then(function(resp) {
          search();
          Notification.success({
            message: '绑定用户成功'
          });
        });
      }, function(resp) {

      });
    }
    /**
     * 带了“系统用户”值得用户绑定
     */
    function withPactlBound(param) {
      var withoutBoDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '绑定：' + param.pactlAccount,
              content: '你将要绑定用户' + param.pactlAccount + '。'
            };
          }
        }
      });
      withoutBoDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.wechat.bound.get({
            id: param.id,
            pactlAccount: param.pactlAccount
          }, {})
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            search();
            Notification.success({
              message: '解绑用户成功'
            });
          });
      }, function() {

      });
    }
    /**
     * 解绑
     */
    function unbound(param) {
      var unDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '解绑：' + param.nickname,
              content: '你将要解绑用户' + param.nickname + '。'
            };
          }
        }
      });
      unDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.wechat.unbound.get({
            id: param.id
          }, {})
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            search();
            Notification.success({
              message: '解绑用户成功'
            });
          });
      }, function() {

      });
    }
    /**
     * 删除
     * 
     */
    function remove(params) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + params.nickname,
              content: '你将要删除用户' + params.nickname + '。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.wechat.delwechat.get({
            id: params.id
          }, {})
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            search();
            Notification.success({
              message: '删除用户成功'
            });
          });
      }, function() {

      });
    }
  }
];

module.exports = angular.module('app.user.weChat', []).controller('weChatCtrl', weChat_fn);