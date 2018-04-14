'use strict';

var msgTemp_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.msgObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getMsgTempData();
    }
    /**
     * 获取消息模板
     */
    function getMsgTempData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.msgTemp.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.msgData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        name: vm.msgObj.name,
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新增
     */
    function add() {
      var addMsgTempDialog = $modal.open({
        template: require('./addMsgTemp.html'),
        controller: require('./addMsgTemp.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增消息模板',
              obj: {}
            };
          }
        }
      });
      addMsgTempDialog.result.then(function (data) {
        restAPI.msgTemp.add.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加消息模板成功'
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
     * 编辑
     */
    function edit(param) {
      var editMsgTempDialog = $modal.open({
        template: require('./addMsgTemp.html'),
        controller: require('./addMsgTemp.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑消息模板：' + param.name,
              obj: param
            };
          }
        }
      });
      editMsgTempDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.msgTemp.add.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑消息模板成功'
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
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除消息模板：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.msgTemp.remove.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除消息模板成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
  }
];

module.exports = angular.module('app.systemSet.msgTemp', []).controller('msgTempCtrl', msgTemp_fn);