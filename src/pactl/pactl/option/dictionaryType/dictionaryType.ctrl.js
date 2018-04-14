'use strict';

var dictionaryType_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.typeObj = {};
    vm.typeData = [];
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
      getTypeData();
    }
    /**
     * 获取字典分类数据
     */
    function getTypeData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.dictionaryType.queryList.save({}, obj)
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
      if (vm.numObj && vm.numObj.name) {
        obj.orderBy = vm.numObj.name + ' ' + vm.numObj.num;
      }
      vm.typeObj.name && (obj.name = vm.typeObj.name);
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
      var addTypeDialog = $modal.open({
        template: require('./addType.html'),
        controller: require('./addType.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增字典分类',
              obj: {}
            };
          }
        }
      });
      addTypeDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.dictionaryType.addType.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增字典分类成功'
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
      var editTypeDialog = $modal.open({
        template: require('./addType.html'),
        controller: require('./addType.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑字典分类：' + param.name,
              obj: {
                name: param.name,
                num: param.num
              }
            };
          }
        }
      });
      editTypeDialog.result.then(function (data) {
        var obj = {};
        obj.tId = param.tId;
        obj.name = data.name;
        obj.num = data.num;
        $rootScope.loading = true;
        restAPI.dictionaryType.addType.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑字典分类成功'
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
              content: '你将要删除字典分类' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.dictionaryType.removeType.save({}, {
            tId: id
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除字典分类成功'
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

module.exports = angular.module('app.pactlOption.dictionaryType', []).controller('dictionaryTypeCtrl', dictionaryType_fn);