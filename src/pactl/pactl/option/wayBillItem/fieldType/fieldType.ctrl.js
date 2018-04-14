'use strict';

var fieldType_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.fieldObj = {};
    vm.fieldData = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getFieldData();
    }
    /**
     * 获取字段数据
     */
    function getFieldData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.fieldType.fieldList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.fieldData = resp.rows;
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
      vm.fieldObj.fieldSort && (obj.fieldSort = vm.fieldObj.fieldSort);
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
        template: require('./addFieldType.html'),
        controller: require('./addFieldType.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增字段分类'
            };
          }
        }
      });
      addFieldDialog.result.then(function (data) {
        restAPI.fieldType.addField.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增字段分类成功'
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
        template: require('./addFieldType.html'),
        controller: require('./addFieldType.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑字段分类：' + param.fieldSort,
              obj: {
                fieldSort: param.fieldSort,
                remark: param.remark
              }
            };
          }
        }
      });
      editFieldDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.fieldSort = data.fieldSort;
        obj.remark = data.remark;
        restAPI.fieldType.addField.save({}, obj)
          .$promise.then(function (resp) {
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
    /**
     * 删除
     * 
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../../remove/remove.html'),
        controller: require('../../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除字段分类' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.fieldType.delField.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除字段分类成功'
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

module.exports = angular.module('app.pactlOption.fieldType', []).controller('fieldTypeCtrl', fieldType_fn);