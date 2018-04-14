'use strict';

var taskRule_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.airData = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.remove = remove;
    vm.ruleObj = {};
    vm.ruleData = [];
    vm.stationData = [];

    getAirData();

    /**
     * 获取航空公司数据
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airData = resp.data || [];
          getStation();
        });
    }
    /**
     * 获取货站
     */
    function getStation() {
      $rootScope.loading = true;
      restAPI.cargoStation.cargoStationList.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.stationData = resp.rows || [];
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getRuleData();
    }
    /**
     * 获取规则数据
     */
    function getRuleData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.taskRule.ruleList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.ruleData = resp.rows || [];
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
      if (vm.ruleObj.airLine) {
        obj.fltCode = vm.ruleObj.airLine.airCode === '全部' ? '' : vm.ruleObj.airLine.airCode;
      }
      if (vm.ruleObj.goodsStation) {
        obj.goodsStation = vm.ruleObj.goodsStation.id;
      }
      return obj;
    }
    /**
     * 新增
     */
    function add() {
      var addRuleDialog = $modal.open({
        template: require('./addTaskRule.html'),
        controller: require('./addTaskRule.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增分配规则',
              airData: vm.airData,
              stationData: vm.stationData,
              obj: {

              }
            };
          }
        }
      });
      addRuleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.fltCode = data.airLine.airCode;
        obj.goodsStation = data.goodsStation.id;
        obj.percentage = data.percentage;
        restAPI.taskRule.editRule.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增分配规则成功'
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
      var editRuleDialog = $modal.open({
        template: require('./addTaskRule.html'),
        controller: require('./addTaskRule.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑分配规则',
              airData: vm.airData,
              stationData: vm.stationData,
              obj: param
            };
          }
        }
      });
      editRuleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.id = param.id
        obj.fltCode = data.airLine.airCode;
        obj.goodsStation = data.goodsStation.id;
        obj.percentage = data.percentage;
        restAPI.taskRule.editRule.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑分配规则成功'
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
              content: '你将要删除航空公司：' + name + '的规则数据。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.taskRule.delRule.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除规则数据成功'
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

module.exports = angular.module('app.pactlOption.taskRule', []).controller('taskRuleCtrl', taskRule_fn);