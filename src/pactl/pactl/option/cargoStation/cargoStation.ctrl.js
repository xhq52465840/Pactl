'use strict';

var cargoStation_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.disable = disable;
    vm.enable = enable;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.stationObj = {};
    vm.stationData = [];
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getStationData();
    }
    /**
     * 获取货站数据
     */
    function getStationData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.cargoStation.getAllCargos.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.stationData = resp.rows || [];
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
      obj.name = vm.stationObj.name;
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
      var addStationDialog = $modal.open({
        template: require('./addCargoStation.html'),
        controller: require('./addCargoStation.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增货站',
              obj: {}
            };
          }
        }
      });
      addStationDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.cargoStation.addCargoStation.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增货站成功'
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
      var editStationDialog = $modal.open({
        template: require('./editCargoStation.html'),
        controller: require('./addCargoStation.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑货站：' + param.name,
              obj: {
                id: param.id,
                name: param.name,
                remark: param.remark
              }
            };
          }
        }
      });
      editStationDialog.result.then(function (data) {
        $rootScope.loading = true;
        data.id = param.id;
        restAPI.cargoStation.editCargoStation.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑货站成功'
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
     * 停用
     * 
     * @param {any} id
     */
    function disable(id) {
      var data = {};
      data.id = id;
      data.deleted = '1';
      restAPI.cargoStation.editCargoStation.save({}, data)
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '停用成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 启用
     */
    function enable(id) {
      var data = {};
      data.id = id;
      data.deleted = '0';
      restAPI.cargoStation.editCargoStation.save({}, data)
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '启用成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除
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
              content: '你将要删除货站：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.cargoStation.delCargoStation.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除货站成功'
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

module.exports = angular.module('app.pactlOption.cargoStation', []).controller('cargoStationCtrl', cargoStation_fn);