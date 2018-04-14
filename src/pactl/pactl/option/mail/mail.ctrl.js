'use strict';

var mail_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.mailObj = {
      type: '0'
    };
    vm.mailData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.add = add;
    vm.edit = edit;
    vm.enable = enable;
    vm.disable = disable;
    vm.remove = remove;
    vm.search = search;
    vm.select = select;

    search();

    /**
     * 查询
     */
    function search() {
      getMailData();
    }
    /**
     * 获取邮件数据
     */
    function getMailData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.mail.queryMail.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.mailData = resp.rows;
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
        addressType: vm.mailObj.type,
        emailAddress: vm.mailObj.emailAddress,
        mark: vm.mailObj.mark
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      obj.addressType = vm.mailObj.type;
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 切换
     */
    function select(type) {
      vm.mailObj.type = type;
      vm.page.currentPage = 1;
      search();
    }
    /**
     * 新增
     */
    function add() {
      var addDialog = $modal.open({
        template: require('./addMail.html'),
        controller: require('./addMail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: vm.mailObj.type === '0' ? '新增白名单' : '新增黑名单',
              obj: {}
            };
          }
        }
      });
      addDialog.result.then(function (resp) {
        $rootScope.loading = true;
        restAPI.mail.editMail.save({}, {
            addressType: vm.mailObj.type,
            emailAddress: resp.emailAddress,
            mark: resp.mark
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 编辑
     */
    function edit(data) {
      var editDialog = $modal.open({
        template: require('./addMail.html'),
        controller: require('./addMail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑：' + data.emailAddress,
              obj: {
                emailAddress: data.emailAddress,
                mark: data.mark
              }
            };
          }
        }
      });
      editDialog.result.then(function (resp) {
        $rootScope.loading = true;
        restAPI.mail.editMail.save({}, {
            addressType: vm.mailObj.type,
            emailAddress: resp.emailAddress,
            mark: resp.mark,
            id: data.id
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 启用邮件地址
     * 
     * @param {any} params
     */
    function enable(params) {
      var obj = {};
      obj.id = params.id;
      obj.status = '0';
      restAPI.mail.changeStatus.save({}, obj)
        .$promise.then(function (resp) {
          vm.search();
          Notification.success({
            message: '启用邮件地址成功'
          });
        });
    }
    /**
     * 禁用邮件地址
     * 
     * @param {any} params
     */
    function disable(params) {
      var obj = {};
      obj.id = params.id;
      obj.status = '2';
      restAPI.mail.changeStatus.save({}, obj)
        .$promise.then(function (resp) {
          vm.search();
          Notification.success({
            message: '禁用邮件地址成功'
          });
        });
    }
    /**
     * 删除邮件地址
     */
    function remove(id, name) {
      var obj = {};
      obj.id = id;
      obj.status = "1";
      var delTagDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除邮件地址' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delTagDialog.result.then(function () {
        restAPI.mail.changeStatus.save({}, obj)
          .$promise.then(function (resp) {
            search();
            Notification.success({
              message: '删除邮件地址成功'
            });
          });
      }, function () {});
    }
  }
];

module.exports = angular.module('app.pactlOption.mail', []).controller('mailCtrl', mail_fn);