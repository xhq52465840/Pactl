'use strict';

var resource_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.resourceObj = {};
    vm.resourceData = [];
    vm.remove = remove;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getResourceData();
    }
    /**
     * 获取资源管理数据
     */
    function getResourceData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.resmanage.pageRes.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.resourceData = resp.data;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        rule: []
      };
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      angular.forEach(vm.resourceObj, function (v, k) {
        obj.rule.push([{
          key: k,
          op: 'like',
          value: v
        }]);
      });
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
      var addResDialog = $modal.open({
        template: require('./addResource.html'),
        controller: require('./addResource.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增资源',
              obj: {}
            };
          }
        }
      });
      addResDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.resType = data.resType.id;
        obj.resName = data.resName;
        obj.resId = data.resId;
        obj.url = data.url;
        restAPI.resmanage.addRes.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '添加资源成功'
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
      var editResourceDialog = $modal.open({
        template: require('./addResource.html'),
        controller: require('./addResource.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑资源：' + param.resName,
              obj: param
            };
          }
        }
      });
      editResourceDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.resType = data.resType.id;
        obj.resName = data.resName;
        obj.resId = data.resId;
        obj.url = data.url;
        restAPI.resmanage.editRes.put({
            id: param.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '编辑资源成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 删除
     */
    function remove(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除资源：' + param.resName,
              content: '你将要删除资源：' + param.resName + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.resmanage.editRes.remove({
            id: param.id
          }, {})
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '删除资源成功'
              });
            }
          });
      }, function () {

      });
    }
  }
];

module.exports = angular.module('app.unit.resource', []).controller('resourceCtrl', resource_fn);