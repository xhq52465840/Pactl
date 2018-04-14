'use strict';

var sentEmail_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.addSent = addSent;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.sentTypes = [];
    vm.sentEmails = [];
    vm.search = search;

    sentType();

    /**
     * 获取发件类型
     */
    function sentType() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
        type: "1481616865075847",
        emailType: '2'
      }).$promise.then(function (resp) {
        $rootScope.loading = false;
        vm.sentTypes = resp.rows;
        sentEmail();
      });
    }
    /**
     * 获取所有发件箱
     */
    function sentEmail() {
      $rootScope.loading = true;
      restAPI.systemEmail.queryAllEmails.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.sentEmails = resp;
          search();
        });
    }

    /**
     * 查询发件箱
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.systemEmail.queryList.save({}, obj)
      .$promise.then(function (resp) {
        $rootScope.loading = false;
        vm.rows = resp.rows;
        Page.setPage(vm.page, resp);
      });
    }

     /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage,
        "emailType": "2"
      };
      return obj;
    }

    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新建发件箱
     */
    function addSent() {
      var addSeDialog = $modal.open({
        template: require('./addSentEmail.html'),
        controller: require('./addSentEmail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新建发件箱',
              sentTypes: vm.sentTypes,
              sentEmails: vm.sentEmails,
              obj: {}
            };
          }
        }
      });
      addSeDialog.result.then(function (data) {
        var obj = {};
        obj.receiveTypeTid = '1481616865075847';
        obj.receiveTypeDid = data.receiveTypeDid ? data.receiveTypeDid.id : '';
        obj.emailId = data.emailId ? data.emailId.id : '';
        obj.remark = data.remark;
        obj.emailType = '2';
        $rootScope.loading = true;
        restAPI.systemEmail.updateList.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加发件箱成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 编辑发件箱
     */
    function edit(params) {
      var editReDialog = $modal.open({
        template: require('./addSentEmail.html'),
        controller: require('./addSentEmail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑发件箱',
              sentTypes: vm.sentTypes,
              sentEmails: vm.sentEmails,
              obj: {
                receiveTypeTid: '1481616865075847',
                receiveTypeDid: params.receiveType,
                emailId: params.eamil.emailId,
                remark: params.eamil.remark,
                emailType: '2'
              }
            };
          }
        }
      });
      editReDialog.result.then(function (data) {
        data.receiveTypeDid = data.receiveTypeDid ? data.receiveTypeDid.id : '';
        data.emailId = data.emailId ? data.emailId.id : '';
        data.id = params.eamil.id;
        restAPI.systemEmail.updateList.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑收件箱成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 删除发件箱
     */
    function remove(name) {
      var delSeDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name.mailAccount.emailAddr,
              content: '你将要删除发件箱' + name.mailAccount.emailAddr + '。此操作不能恢复。'
            };
          }
        }
      });
      delSeDialog.result.then(function (data) {
        restAPI.systemEmail.delList.save({}, {
            id: name.eamil.id
          })
          .$promise.then(function (resp) {
            search();
            Notification.success({
              message: '删除发件箱成功'
            });
          });
      }, function () {

      });
    }

  }
];

module.exports = angular.module('app.systemSet.sentEmail', []).controller('sentEmailCtrl', sentEmail_fn);