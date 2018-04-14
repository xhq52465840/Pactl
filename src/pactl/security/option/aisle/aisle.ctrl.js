'use strict';

var aisle_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.aisleData = [];
    vm.edit = edit;
    vm.ableAisle = ableAisle;
    vm.stationData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    getStation();

    /**
     * 获取货站
     */
    function getStation() {
      $rootScope.loading = true;
      restAPI.cargoStation.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.stationData = resp.data;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getAisleData();
    }

     /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      return obj;
    }

    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 获取24小时货通道数据
     */
    function getAisleData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.aisle.queryAll.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.aisleData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 新增
     */
    function add() {
      var addAisleDialog = $modal.open({
        template: require('./addAisle.html'),
        controller: require('./addAisle.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增24小时货通道',
              stationData: vm.stationData,
              obj: {}
            };
          }
        }
      });
      addAisleDialog.result.then(function (data) {
        var obj = {};
        obj.name = data.name;
        obj.ctid = data.ctid.id;
        obj.remark = data.remark;
        $rootScope.loading = true;
        restAPI.aisle.addPAisle.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增24小时货通道成功'
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
      var editAisleDialog = $modal.open({
        template: require('./addAisle.html'),
        controller: require('./addAisle.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑24小时货通道：' + param.name,
              stationData: vm.stationData,
              obj: param
            };
          }
        }
      });
      editAisleDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.name = data.name;
        obj.ctid = data.ctid.id;
        obj.remark = data.remark;
        $rootScope.loading = true;
        restAPI.aisle.updatePAisle.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑24小时货通道成功'
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
     * 启用/禁用
     * 
     */
    function ableAisle(item, status) {
      $rootScope.loading = true;
      restAPI.aisle.updatePAisle.save({}, {
          id: item.id,
          ctid: item.ctid.id ? item.ctid.id : item.ctid,
          status: status
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            item.status = status;
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

module.exports = angular.module('app.securityOption.aisle', []).controller('aisleCtrl', aisle_fn);