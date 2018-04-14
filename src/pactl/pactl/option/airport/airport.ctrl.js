'use strict';

var airPort_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.airPortObj = {};
    vm.airPortData = [];
    vm.currencyData = [];
    vm.disable = disable;
    vm.edit = edit;
    vm.enable = enable;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;


    getCurrency();
    /**
     * 货币
     */
    function getCurrency() {
      restAPI.currency.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.currencyData = resp.data;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getAirPortData();
    }
    /**
     * 获取机场数据
     */
    function getAirPortData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.airPort.query.save({}, obj)
        .$promise.then(function (resp) {
        	console.log(resp)
          $rootScope.loading = false;
          vm.airPortData = resp.rows;
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
      vm.airPortObj.airportCode && (obj.airportCode = vm.airPortObj.airportCode);
      vm.airPortObj.cityName && (obj.cityName = vm.airPortObj.cityName);
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
      var addPortDialog = $modal.open({
        template: require('./addAirPort.html'),
        controller: require('./addAirPort.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增机场',
              currencyData: vm.currencyData,
              obj: {}
            };
          }
        }
      });
      addPortDialog.result.then(function (data) {
        if(data.currency) {
          data.currencyName = data.currency.currencyName;
          data.currencyCode = data.currency.currencyCode;
          delete data.currency;
        } else {
           delete data.currencyName;
           delete data.currencyCode;
        }
        $rootScope.loading = true;
        restAPI.airPort.editAirPort.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增机场成功'
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
    function edit(item) {
      var obj = {};
      obj.cityCode = item.cityCode;
      obj.cityName = item.cityName;
      obj.countryCode = item.countryCode;
      obj.stateCode = item.stateCode;
      obj.airportCode = item.airportCode;
      obj.airportName = item.airportName;
      obj.currencyName = item.currencyName;
      obj.currencyCode = item.currencyCode;
      var editPortDialog = $modal.open({
        template: require('./addAirPort.html'),
        controller: require('./addAirPort.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑机场',
              currencyData: vm.currencyData,
              obj: obj
            };
          }
        }
      });
      editPortDialog.result.then(function (data) {
        data.id = item.id;
        if(data.currency) {
          data.currencyName = data.currency.currencyName;
          data.currencyCode = data.currency.currencyCode;
          delete data.currency;
        } else {
           delete data.currencyName;
           delete data.currencyCode;
        }
        $rootScope.loading = true;
        restAPI.airPort.editAirPort.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑机场成功'
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
      restAPI.airPort.disable.save({}, {
          id: id
        })
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
      restAPI.airPort.enable.save({}, {
          id: id
        })
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
              content: '你将要删除机场' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.airPort.delAirPort.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除机场成功'
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

module.exports = angular.module('app.pactlOption.airPort', []).controller('airPortCtrl', airPort_fn);