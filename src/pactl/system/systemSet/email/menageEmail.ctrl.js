'use strict';

var menageEmail_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.addMailAccount = addMailAccount;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    search();
    /**
     * *根据页码获取查询条件
     * 
     *
    function getCondition() {
        var obj = {
        pagesize: vm.page.length,
        pagenum: vm.page.currentPage
        };
        return obj;
      } */
    /**
     * 查询邮件账号
     */
    function search() {
    	//console.log(121)
      $rootScope.loading = true;
     // var obj = getCondition();
      restAPI.systemEmail.queryAllEmailsByPage.get({
          pagenum: vm.page.currentPage,
          pagesize: vm.page.length
        }, {})
        .$promise.then(function(resp) {
        	console.log(resp)
          $rootScope.loading = false;
          vm.rows = resp.data;
          Page.setPage(vm.page, resp);
        })
    };
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新建邮件账号
     */
    function addMailAccount() {
      var addMailDialog = $modal.open({
        template: require('./addManegeEmail.html'),
        controller: require('./addManegeEmail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新建邮件账号',
              obj: {}
            };
          }
        }
      });
      addMailDialog.result.then(function(data) {
        var obj = getData(data);
        $rootScope.loading = true;
        restAPI.systemEmail.addAllEmails.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            search();
            Notification.success({
              message: '添加邮件账号成功'
            });
          });
      }, function(resp) {

      });
    }
    /**
     * 编辑邮件账号
     */
    function edit(param) {
      var editReDialog = $modal.open({
        template: require('./addManegeEmail.html'),
        controller: require('./addManegeEmail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑邮件账号',
              obj: param
            };
          }
        }
      });
      editReDialog.result.then(function(data) {
        var obj = getData(data);
        restAPI.systemEmail.editAllEmails.put({
            accountId: param.id
          }, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            search();
            Notification.success({
              message: '编辑邮件账号成功'
            });
          });
      }, function(resp) {

      });
    }
    /**
     * 获取需要保存的数据
     * @return {[type]} [description]
     */
    function getData(data) {
      var obj = {};
      console.log(data)
      obj.accountCode = data.accountCode;
      obj.emailAddr = data.emailAddr;
      obj.accountName = data.accountName;
      obj.accountDesc = data.accountDesc;
      obj.recvProto = data.recvProto ? data.recvProto.name : '';
      obj.recvUser = data.recvUser;
      obj.recvPass = data.recvPass;
      obj.recvHost = data.recvHost;
      obj.recvPort = data.recvPort;
      obj.recvSsl = data.recvSsl ? '1' : '0';
      obj.sendHost = data.sendHost;
      obj.sendPort = data.sendPort;
      obj.sendAuth = 'true';
      obj.sendUser = data.sendUser;
      obj.sendPass = data.sendPass;
      obj.sendSsl = data.sendSsl ? '1' : '0';
      return obj;
    }
    /**
     * 删除邮件账号
     */
    function remove(name, id) {
      var delReDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + name.accountName,
              content: '你将要删除邮件账号' + name.accountName + '。此操作不能恢复。'
            };
          }
        }
      });
      delReDialog.result.then(function(data) {
        restAPI.systemEmail.delAllEmails.remove({
            accountId: id
          }, {})
          .$promise.then(function(resp) {;
            search();
            Notification.success({
              message: '删除邮件账号成功'
            });
          });
      }, function() {

      });
    }
  }
];

module.exports = angular.module('app.systemSet.menageEmail', []).controller('menageEmailCtrl', menageEmail_fn);