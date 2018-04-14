'use strict';

var reason_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.reasonObj = {
      type: {
        id: '0',
        name: '扣押'
      }
    };
    vm.reasonData = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.typeData = [{
      id: '0',
      name: '扣押'
    }, {
      id: '1',
      name: '通过'
    }];

    search();

    /**
     * 查询
     */
    function search() {
      getReasonData();
    }
    /**
     * 获取原因数据
     */
    function getReasonData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.reason.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.reasonData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      vm.reasonObj.name && (obj.name = vm.reasonObj.name);
      if (vm.reasonObj.type) {
        obj.type = vm.reasonObj.type.id;
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
      var addReasonDialog = $modal.open({
        template: require('./addReason.html'),
        controller: require('./addReason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增原因',
              typeData: vm.typeData,
              obj: {}
            };
          }
        }
      });
      addReasonDialog.result.then(function (data) {
        var obj = {};
        obj.type = data.type.id;
        obj.name = data.name;
        $rootScope.loading = true;
        restAPI.reason.addReason.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增原因成功'
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
      var editReasonDialog = $modal.open({
        template: require('./addReason.html'),
        controller: require('./addReason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑原因：' + param.name,
              typeData: vm.typeData,
              obj: {
                type: param.type,
                name: param.name
              }
            };
          }
        }
      });
      editReasonDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.type = data.type.id;
        obj.name = data.name;
        $rootScope.loading = true;
        restAPI.reason.updateReason.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑原因成功'
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
     * 
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
              content: '你将要删除原因' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.reason.removeReason.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除原因成功'
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

module.exports = angular.module('app.securityOption.reason', []).controller('reasonCtrl', reason_fn);