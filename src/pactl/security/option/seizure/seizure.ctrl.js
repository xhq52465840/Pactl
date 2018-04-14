'use strict';

var seizure_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.seizureObj = {};
    vm.seizureData = [];
    vm.edit = edit;
    vm.ableSeizure = ableSeizure;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getSeizureData();
    }
    /**
     * 获取扣押库数据
     */
    function getSeizureData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.seizure.queryAll.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.seizureData = resp.rows;
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
      var addSeizureDialog = $modal.open({
        template: require('./addSeizure.html'),
        controller: require('./addSeizure.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增扣押库',
              obj: {}
            };
          }
        }
      });
      addSeizureDialog.result.then(function (data) {
        var obj = {};
        obj.name = data.name;
        $rootScope.loading = true;
        restAPI.seizure.addSeizure.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增扣押库成功'
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
      var editSeizureDialog = $modal.open({
        template: require('./addSeizure.html'),
        controller: require('./addSeizure.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑扣押库：' + param.name,
              obj: {
                name: param.name
              }
            };
          }
        }
      });
      editSeizureDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.name = data.name;
        $rootScope.loading = true;
        restAPI.seizure.updateSeizure.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑扣押库成功'
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
    function ableSeizure(item, status) {
      $rootScope.loading = true;
      restAPI.seizure.updateSeizure.save({}, {
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

module.exports = angular.module('app.securityOption.seizure', []).controller('seizureCtrl', seizure_fn);