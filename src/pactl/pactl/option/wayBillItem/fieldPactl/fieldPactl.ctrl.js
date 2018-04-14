'use strict';

module.exports = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
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

    getFieldType();

    /**
     * 获取所有的分类
     */
    function getFieldType() {
      $rootScope.loading = true;
      restAPI.fieldType.queryAll.save({}, {})
        .$promise.then(function (resp) {
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
     * 获取pactl预审必录项数据
     */
    function getFieldData() {
      $rootScope.loading = true;
      restAPI.fieldPactl.fieldList.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.fieldData = resp.rows;
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
              title: '新增pactl预审必录项',
              field: vm.field,
              obj: {}
            };
          }
        }
      });
      addFieldDialog.result.then(function (data) {
        var obj = {};
        obj.fieldMaintainId = data.field.id;
        restAPI.fieldPactl.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增pactl预审必录项成功'
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
              title: '编辑pactl预审必录项: ' + param.fieldMaintain.field,
              field: vm.field,
              obj: {
                field: param.fieldMaintain.id
              }
            };
          }
        }
      });
      editFieldDialog.result.then(function (data) {
        var obj = {};
        obj.fieldMaintainId = data.field.id;
        obj.id = param.pretrialRequired.id;
        restAPI.fieldPactl.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑pactl预审必录项成功'
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
              content: '你将要删除pactl预审必录项' + name + '。此操作不能恢复。'
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
                message: '删除pactl预审必录项成功'
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