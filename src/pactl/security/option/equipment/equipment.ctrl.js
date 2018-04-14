'use strict';

var equipment_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.del = del;
    vm.edit = edit;
    vm.equipmentObj = {};
    vm.equipmentData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.stationData = [];
    vm.machineData = [];
    vm.getMachine = getMachine;

    getStation();

    /**
     * 获取货站
     */
    function getStation() {
      $rootScope.loading = true;
      restAPI.cargoStation.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.stationData = resp.data;
          getMachine();
        });
    }
    /**
     * 获取安检设备
     */
    function getMachine() {
      $rootScope.loading = true;
      restAPI.machine.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.machineData = resp.data;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getEquipmentData();
    }
    /**
     * 获取安检设备数据
     */
    function getEquipmentData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.equipment.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.equipmentData = resp.rows;
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
      if (vm.equipmentObj.name) {
        obj.name = vm.equipmentObj.name;
      }
      if (vm.equipmentObj.station && vm.equipmentObj.station.id) {
        obj.ct = vm.equipmentObj.station.id;
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
      var addEquipmentDialog = $modal.open({
        template: require('./addEquipment.html'),
        controller: require('./addEquipment.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '添加安检设备',
              machineData: vm.machineData,
              stationData: vm.stationData,
              obj: {}
            };
          }
        }
      });
      addEquipmentDialog.result.then(function(data) {
        var obj = {};
        obj.id = data.id;
        obj.name = data.name;
        obj.mac = data.mac;
        obj.ct = data.ct.id;
        obj.machine = data.machine.id;
        obj.remark = data.remark;
        $rootScope.loading = true;
        restAPI.equipment.addEquipment.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加安检设备成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function(resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(params) {
      var editEquipmentDialog = $modal.open({
        template: require('./addEquipment.html'),
        controller: require('./addEquipment.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑安检设备：' + params.name,
              machineData: vm.machineData,
              stationData: vm.stationData,
              obj: {
                id: params.id,
                name: params.name,
                mac: params.mac,
                ct: params.ct,
                machine: params.machine,
                remark: params.remark
              }
            };
          }
        }
      });
      editEquipmentDialog.result.then(function(data) {
        var obj = {};
        obj.id = data.id;
        obj.name = data.name;
        obj.mac = data.mac;
        obj.ct = data.ct.id;
        obj.machine = data.machine.id;
        obj.remark = data.remark;
        $rootScope.loading = true;
        restAPI.equipment.updateEquipment.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑安检设备成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function(resp) {

      });
    }
    /**
     * 删除
     */
    function del(id, name) {
      var delEquipmentDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除安检设备：' + name,
              content: '你将要删除安检设备' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delEquipmentDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.equipment.delEquipment.remove({
            id: id
          }, {})
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除安检设备成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
  }
];

module.exports = angular.module('app.securityOption.equipment', []).controller('equipmentCtrl', equipment_fn);