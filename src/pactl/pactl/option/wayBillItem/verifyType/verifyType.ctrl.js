'use strict';

var verifyType_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.typeObj = {};
    vm.typeData = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getFieldData();
    }
    /**
     * 获取分类数据
     */
    function getFieldData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.verifyType.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.typeData = resp.rows;
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
      obj.sortName = vm.typeObj.sortName;
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
      var addFieldDialog = $modal.open({
        template: require('./addType.html'),
        controller: require('./addType.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增校验分类',
              obj: {}
            };
          }
        }
      });
      addFieldDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.verifyType.addType.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增校验分类成功'
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
      var editFieldDialog = $modal.open({
        template: require('./addType.html'),
        controller: require('./addType.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑校验分类：' + param.sortName,
              obj: {
                sortName: param.sortName,
                sid: param.sid
              }
            };
          }
        }
      });
      editFieldDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.sid = param.sid;
        obj.sortName = data.sortName;
        $rootScope.loading = true;
        restAPI.verifyType.addType.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑字段分类成功'
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
  }
];

module.exports = angular.module('app.pactlOption.verifyType', []).controller('verifyTypeCtrl', verifyType_fn);