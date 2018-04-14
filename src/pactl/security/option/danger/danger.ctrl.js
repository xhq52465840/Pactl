'use strict';

var danger_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.dangerObj = {};
    vm.dangerData = [];
    vm.edit = edit;
    vm.ableDanger = ableDanger;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getDangerData();
    }
    /**
     * 获取危险品分类数据
     */
    function getDangerData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.danger.queryAll.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.dangerData = resp.rows;
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
      var addDangerDialog = $modal.open({
        template: require('./addDanger.html'),
        controller: require('./addDanger.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增危险品分类',
              obj: {}
            };
          }
        }
      });
      addDangerDialog.result.then(function (data) {
        var obj = {};
        obj.name = data.name;
        $rootScope.loading = true;
        restAPI.danger.addPDgoods.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增危险品分类成功'
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
      var editDangerDialog = $modal.open({
        template: require('./addDanger.html'),
        controller: require('./addDanger.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑危险品分类：' + param.name,
              obj: {
                name: param.name
              }
            };
          }
        }
      });
      editDangerDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.name = data.name;
        $rootScope.loading = true;
        restAPI.danger.updatePDgoods.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑危险品分类成功'
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
    function ableDanger(item, status) {
      $rootScope.loading = true;
      restAPI.danger.updatePDgoods.save({}, {
          id: item.id,
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

module.exports = angular.module('app.securityOption.danger', []).controller('dangerCtrl', danger_fn);