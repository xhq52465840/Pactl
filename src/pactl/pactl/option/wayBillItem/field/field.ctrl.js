'use strict';

var field_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.field = [];
    vm.fieldObj = {};
    vm.fieldData = [];
    vm.fieldType = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;

    getFieldType();

    /**
     * 获取所有的分类
     */
    function getFieldType() {
      $rootScope.loading = true;
      restAPI.fieldType.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.fieldType = resp.data;
          getField();
        });
    }
    /**
     * 获取所有的分类
     */
    function getField() {
      $rootScope.loading = true;
      restAPI.field.queryField.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.field = resp.data;
          search();
        });
    }
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
      restAPI.field.fieldList.save({}, obj)
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
      if (vm.fieldObj.fieldSort) {
        obj.fieldSort = vm.fieldObj.fieldSort.id;
      }
      obj.field = vm.fieldObj.field;
      obj.fieldDescriptionEn = vm.fieldObj.fieldDescriptionEn;
      obj.fieldDescriptionCn = vm.fieldObj.fieldDescriptionCn;
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
        template: require('./addField.html'),
        controller: require('./addField.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增字段',
              fieldType: vm.fieldType,
              field: vm.field,
              obj: {}
            };
          }
        }
      });
      addFieldDialog.result.then(function (data) {
        var obj = {};
        obj.fieldSort = data.fieldSort.id;
        obj.field = data.field.columnName;
        obj.fieldDescriptionCn = data.fieldDescriptionCn;
        obj.fieldDescriptionEn = data.fieldDescriptionEn;
        restAPI.field.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增字段成功'
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
        template: require('./addField.html'),
        controller: require('./addField.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑字段：' + param.field,
              fieldType: vm.fieldType,
              field: vm.field,
              obj: {
                fieldSort: param.fieldSort,
                field: param.field,
                fieldDescriptionEn: param.fieldDescriptionEn,
                fieldDescriptionCn: param.fieldDescriptionCn
              }
            };
          }
        }
      });
      editFieldDialog.result.then(function (data) {
        var obj = {};
        obj.fieldSort = data.fieldSort.id;
        obj.field = data.field.columnName;
        obj.fieldDescriptionCn = data.fieldDescriptionCn;
        obj.fieldDescriptionEn = data.fieldDescriptionEn;
        obj.id = param.id;
        restAPI.field.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑字段成功'
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
              content: '你将要删除字段' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.field.delField.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除字段成功'
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

module.exports = angular.module('app.pactlOption.field', []).controller('fieldCtrl', field_fn);