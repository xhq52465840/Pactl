'use strict';

var machine_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.del = del;
    vm.machineObj = {};
    vm.machineData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    getStation();

    /**
     * 获取货站
     */
    function getStation() {
      $rootScope.loading = true;
      restAPI.cargoStation.cargoStationList.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.stationData = resp.rows;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getMachineData();
    }
    /**
     * 获取安检机数据
     */
    function getMachineData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.machine.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.machineData = resp.rows;
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
      if (vm.machineObj.name) {
        obj.name = vm.machineObj.name;
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
      var addMachineDialog = $modal.open({
        template: require('./addMachine.html'),
        controller: require('./addMachine.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加安检机',
              stationData: vm.stationData,
              obj: {}
            };
          }
        }
      });
      addMachineDialog.result.then(function (data) {
        var obj = {};
        obj.id = data.id;
        obj.name = data.name;
        obj.ctid = data.ctid.id;
        obj.remark = data.remark;
        $rootScope.loading = true;
        restAPI.machine.addMachine.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加安检机成功'
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
      var editMachineDialog = $modal.open({
        template: require('./addMachine.html'),
        controller: require('./addMachine.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑安检机：' + param.name,
              stationData: vm.stationData,
              obj: {
                id: param.id,
                name: param.name,
                ctid: param.ctid,
                remark: param.remark
              }
            };
          }
        }
      });
      editMachineDialog.result.then(function (data) {
        var obj = {};
        obj.id = data.id;
        obj.name = data.name;
        obj.ctid = data.ctid.id;
        obj.remark = data.remark;
        $rootScope.loading = true;
        restAPI.machine.updateMachine.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑安检机成功'
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
     */
    function del(params) {
      var name = params.name,
        id = params.id;
      var delMachineDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除安检机：' + name,
              content: '你将要删除安检机' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delMachineDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.machine.delMachine.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除安检机成功'
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

module.exports = angular.module('app.securityOption.machine', []).controller('machineCtrl', machine_fn);