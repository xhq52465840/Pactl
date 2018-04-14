'use strict';

var country_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.countryObj = {};
    vm.countryData = [];
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
      getCountryData();
    }
    /**
     * 获取国家数据
     */
    function getCountryData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.country.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.countryData = resp.rows;
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
      vm.countryObj.countryName && (obj.countryName = vm.countryObj.countryName);
      vm.countryObj.countryCode && (obj.countryCode = vm.countryObj.countryCode);
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
      var addCountryDialog = $modal.open({
        template: require('./addCountry.html'),
        controller: require('./addCountry.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增国家'
            };
          }
        }
      });
      addCountryDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.country.addCountry.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增国家成功'
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
      var editCountryDialog = $modal.open({
        template: require('./addCountry.html'),
        controller: require('./addCountry.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑国家：' + param.countryName,
              obj: {
                countryCode: param.countryCode,
                countryName: param.countryName,
                iataArea: param.iataArea,
                currencyName: param.currencyName,
                currencyCode: param.currencyCode
              }
            };
          }
        }
      });
      editCountryDialog.result.then(function (data) {
        var obj = {};
        obj.id = param.id;
        obj.countryCode = data.countryCode;
        obj.countryName = data.countryName;
        obj.iataArea = data.iataArea;
        obj.currencyName = data.currencyName;
        obj.currencyCode = data.currencyCode;
        $rootScope.loading = true;
        restAPI.country.addCountry.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑国家成功'
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
              content: '你将要删除国家' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.country.delCountry.save({}, {
            id: id,
            status: '1'
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除国家成功'
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

module.exports = angular.module('app.pactlOption.country', []).controller('countryCtrl', country_fn);