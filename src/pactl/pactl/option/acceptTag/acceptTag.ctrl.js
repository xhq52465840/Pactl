'use strict';

var acceptTag_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.tagObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.addTag = addTag;
    vm.editTag = editTag;
    vm.disableTag = disableTag;
    vm.enableTag = enableTag;
    vm.delTag = delTag;

    search();

    /**
     * 查询按钮
     */
    function search() {
      getTag();
    }
    /**
     * 获取标签数据
     */
    function getTag() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.receiveTag.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.tagData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        markName: vm.tagObj.name,
        markCode: vm.tagObj.code,
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      return obj;
    }
    /**
     * 添加收单标签
     */
    function addTag() {
      var addTagDialog = $modal.open({
        template: require('./addTag.html'),
        controller: require('./addTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加收单标签',
              obj: {}
            };
          }
        }
      });
      addTagDialog.result.then(function (data) {
        var obj = {};
        obj.markName = data.name;
        obj.markCode = data.code;
        $rootScope.loading = true;
        restAPI.receiveTag.addTag.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加收单标签成功'
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
     * 编辑收单标签
     */
    function editTag(params) {
      var editTagDialog = $modal.open({
        template: require('./addTag.html'),
        controller: require('./addTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑收单标签：' + params.markName,
              obj: {
                name: params.markName,
                code: params.markCode
              }
            };
          }
        }
      });
      editTagDialog.result.then(function (data) {
        var obj = {};
        obj.markName = data.name;
        obj.markCode = data.code;
        obj.rwmId = params.rwmId;
        $rootScope.loading = true;
        restAPI.receiveTag.addTag.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑收单标签成功'
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
     * 禁用标签
     * 
     * @param {any} params
     */
    function disableTag(params) {
      var obj = {};
      obj.rwmId = params.rwmId;
      obj.status = '0';
      restAPI.receiveTag.addTag.save({}, obj)
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '禁用标签成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 启用标签
     * 
     * @param {any} params
     */
    function enableTag(params) {
      var obj = {};
      obj.rwmId = params.rwmId;
      obj.status = '1';
      restAPI.receiveTag.addTag.save({}, obj)
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '启用标签成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除标签
     */
    function delTag(name, id) {
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
              content: '你将要删除标签' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delTagDialog.result.then(function () {
        restAPI.receiveTag.removeTag.save({}, {
            rwmId: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除标签成功'
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

module.exports = angular.module('app.pactlOption.acceptTag', []).controller('acceptTagCtrl', acceptTag_fn);