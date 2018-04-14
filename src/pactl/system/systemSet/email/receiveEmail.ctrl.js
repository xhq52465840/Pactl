'use strict';

var receiveEmail_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.addReceive = addReceive;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.receiveTypes = [];
    vm.receiveEmails = [];
    vm.search = search;

    receiveType();

    /**
     * 获取收件类型
     */
    function receiveType() {
      restAPI.baseData.queryAll.save({}, {
        type: "1481616652592469",
        emailType: '1'
      }).$promise.then(function (resp) {
        $rootScope.loading = false;
        vm.receiveTypes = resp.rows;
        receiveEmail();
      });
    }
    /**
     * 获取所有收件箱
     */
    function receiveEmail() {
      restAPI.systemEmail.queryAllEmails.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.receiveEmails = resp;
          search();
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 查询收件箱
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
        "emailType": "1"
      };
      return obj;
    }
    /**
     * 新建收件箱
     */
    function addReceive() {
      var addReDialog = $modal.open({
        template: require('./addReceive.html'),
        controller: require('./addReceive.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新建收件箱',
              receiveTypes: vm.receiveTypes,
              receiveEmails: vm.receiveEmails,
              obj: {}
            };
          }
        }
      });
      addReDialog.result.then(function (data) {
        var obj = {};
        obj.receiveTypeTid = '1481616652592469';
        obj.receiveTypeDid = data.receiveTypeDid ? data.receiveTypeDid.id : '';
        obj.emailId = data.emailId ? data.emailId.id : '';
        obj.remark = data.remark;
        obj.emailType = '1';
        $rootScope.loading = true;
        restAPI.systemEmail.updateList.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加收件箱成功'
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
     * 编辑收件箱
     */
    function edit(params) {
      var editReDialog = $modal.open({
        template: require('./addReceive.html'),
        controller: require('./addReceive.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑收件箱',
              receiveTypes: vm.receiveTypes,
              receiveEmails: vm.receiveEmails,
              obj: {
                receiveTypeTid: '1481616652592469',
                receiveTypeDid: params.receiveType,
                emailId: params.eamil.emailId,
                remark: params.eamil.remark,
                emailType: '1'
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
     * 删除收件箱
     */
    function remove(name) {
      var delReDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name.mailAccount.emailAddr,
              content: '你将要删除收件箱' + name.mailAccount.emailAddr + '。此操作不能恢复。'
            };
          }
        }
      });
      delReDialog.result.then(function (data) {
        restAPI.systemEmail.delList.save({}, {
            id: name.eamil.id
          })
          .$promise.then(function (resp) {
            search();
            Notification.success({
              message: '删除收件箱成功'
            });
          });
      }, function () {

      });
    }

  }
];

module.exports = angular.module('app.systemSet.receiveEmail', []).controller('receiveEmailCtrl', receiveEmail_fn);