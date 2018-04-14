'use strict';

var verifyField_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.fieldObj = {};
    vm.fieldData = [];
    vm.field = [];
    vm.fieldType = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.typeData = [];

    getTypeData();

    /**
     * 获取校验分类
     */
    function getTypeData() {
      $rootScope.loading = true;
      restAPI.verifyType.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.typeData = resp.data;
          getFieldType();
        });
    }
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
     * 获取所有的字段
     */
    function getField() {
      $rootScope.loading = true;
      restAPI.field.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.field = resp.data;
        });
    }
    /**
     * 查询
     */
    function search() {
      if (vm.fieldObj.type) {
        getFieldData();
      } else {
        Notification.error({
          message: '请先选择分类'
        });
      }
    }
    /**
     * 获取运单校验字段数据
     */
    function getFieldData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.fieldPactl.fieldList.save({}, obj)
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
      if (vm.fieldObj.type) {
        obj.sid = vm.fieldObj.type.sid;
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
      var addFieldDialog = $modal.open({
        template: require('./addField.html'),
        controller: require('./addField.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增运单校验字段',
              field: vm.field,
              typeData: vm.typeData,
              obj: {}
            };
          }
        }
      });
      addFieldDialog.result.then(function (data) {
        var obj = {};
        obj.fieldMaintainId = data.field.id;
        obj.sid = data.type.sid;
        restAPI.fieldPactl.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增运单校验字段成功'
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
              title: '编辑运单校验字段: ' + param.fieldMaintain.field,
              field: vm.field,
              type: vm.typeData,
              obj: {
                field: param.fieldMaintain.id,
                checkSort: param.checkSort
              }
            };
          }
        }
      });
      editFieldDialog.result.then(function (data) {
        var obj = {};
        obj.fieldMaintainId = data.field.id;
        obj.id = param.pretrialRequired.id;
        obj.sid = data.type.sid;
        restAPI.fieldPactl.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑运单校验字段成功'
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
              content: '你将要删除运单校验字段' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.fieldPactl.delField.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除运单校验字段成功'
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

module.exports = angular.module('app.pactlOption.verifyField', []).controller('verifyFieldCtrl', verifyField_fn);