'use strict';

var currency_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.currencyObj = {};
    vm.currencyData = [];
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
      getCurrencyData();
    }
    /**
     * 获取货币数据
     */
    function getCurrencyData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.currency.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.currencyData = resp.rows;
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
      obj.currencyName = vm.currencyObj.currencyName;
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
      var addCurrencyDialog = $modal.open({
        template: require('./addCurrency.html'),
        controller: require('./addCurrency.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增货币',
              obj: {}
            };
          }
        }
      });
      addCurrencyDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.currency.addCurrency.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增货币成功'
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
      var editCurrencyDialog = $modal.open({
        template: require('./addCurrency.html'),
        controller: require('./addCurrency.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑货币：' + param.currencyName,
              obj: {
                currencyName: param.currencyName,
                currencyCode: param.currencyCode
              }
            };
          }
        }
      });
      editCurrencyDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.currencyCode = data.currencyCode;
        obj.currencyName = data.currencyName;
        $rootScope.loading = true;
        restAPI.currency.addCurrency.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑货币成功'
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
              content: '你将要删除货币' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.currency.removeCurrency.save({}, {
            id: id,
            delStatus: '1'
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除货币成功'
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

module.exports = angular.module('app.pactlOption.currency', []).controller('currencyCtrl', currency_fn);