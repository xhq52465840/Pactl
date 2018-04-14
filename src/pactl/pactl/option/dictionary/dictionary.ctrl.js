'use strict';

var dictionary_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.ableStatus = ableStatus;
    vm.add = add;
    vm.allData = [];
    vm.dictObj = {};
    vm.dictData = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.typeData = [];

    getType();
    /**
     * 获取所有的分类
     */
    function getType() {
      $rootScope.loading = true;
      restAPI.dictionaryType.queryList.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.typeData = resp.rows;
        });
    }
    /**
     * 查询
     */
    function search() {
      if (valid()) {
        getDictData();
      }
    }
    /**
     * 校验分类必填
     */
    function valid() {
      if (vm.dictObj.type) {
        return true;
      } else {
        Notification.error({
          message: '请先选择字典分类'
        });
        return false;
      }
    }
    /**
     * 获取字典
     */
    function getDictData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.dictionary.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.dictData = resp.rows;
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
      if (vm.dictObj.type) {
        obj.type = vm.dictObj.type.tId;
      }
      vm.dictObj.name && (obj.name = vm.dictObj.name);
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
      var addDictDialog = $modal.open({
        template: require('./addDict.html'),
        controller: require('./addDict.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增字典',
              typeData: vm.typeData,
              obj: {
                type: vm.dictObj.type
              }
            };
          }
        }
      });
      addDictDialog.result.then(function (data) {
        var arr = [];
        var obj = getAddData(data);
        arr.push(obj);
        $rootScope.loading = true;
        restAPI.dictionary.addDict.save({}, arr)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增字典成功'
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
     * 获取增加数据
     */
    function getAddData(params) {
      var obj = {};
      obj.id = params.id;
      obj.name = params.name;
      obj.type = params.type.tId;
      obj.num = params.num ? params.num : '';
      obj.parentId = params.parentId ? params.parentId.id : '';
      obj.remarks = params.remarks ? params.remarks : '';
      return obj;
    }
    /**
     * 编辑
     */
    function edit(param) {
      var addDictDialog = $modal.open({
        template: require('./addDict.html'),
        controller: require('./addDict.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑字典：' + param.name,
              typeData: vm.typeData,
              obj: {
                id: param.id,
                name: param.name,
                num: param.sort,
                type: param.type,
                parentId: param.parentId,
                remarks: param.remarks
              }
            };
          }
        }
      });
      addDictDialog.result.then(function (data) {
        var arr = [];
        var obj = getAddData(data);
        arr.push(obj);
        $rootScope.loading = true;
        restAPI.dictionary.addDict.save({}, arr)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑字典成功'
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
              title: '删除：' + param.name,
              content: '你将要删除字典' + param.name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.dictionary.removeDict.save({}, {
            id: param.id,
            type: param.type
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除字典成功'
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
    /**
     * 状态
     */
    function ableStatus(params, status) {
      var arr = [];
      arr.push({
        id: params.id,
        type: params.type,
        status: status
      });
      restAPI.dictionary.addDict.save({}, arr)
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '操作成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
  }
];

module.exports = angular.module('app.pactlOption.dictionary', []).controller('dictionaryCtrl', dictionary_fn);