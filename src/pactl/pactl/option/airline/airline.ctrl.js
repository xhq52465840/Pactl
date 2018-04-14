'use strict';

var airline_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.airObj = {};
    vm.airData = [];
    vm.disable = disable;
    vm.edit = edit;
    vm.enable = enable;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;

    search();

    /**
     * 查询
     */
    function search() {
      getAirData();
    }
    /**
     * 获取航空公司数据
     */
    function getAirData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.airData.queryList.save({}, obj)
        .$promise.then(function (resp) {
        	console.log(resp)
          $rootScope.loading = false;
          vm.airData = resp.rows;
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
      vm.airObj.airCode && (obj.airCode = vm.airObj.airCode);
      vm.airObj.destCode && (obj.destCode = vm.airObj.destCode);
      vm.airObj.airName && (obj.airName = vm.airObj.airName);
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
      var addAirDialog = $modal.open({
        template: require('./addAirBase.html'),
        controller: require('./addAirBase.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增航空公司基本信息'
            };
          }
        }
      });
      addAirDialog.result.then(function (data) {
        var obj = {
          pApplyAirLine: {}
        };
        obj.pApplyAirLine = getAddData(data);
        restAPI.airData.addAir.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增航空公司成功'
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
     * 返回需要添加的数据
     */
    function getAddData(data) {
      var obj = {};
      obj.airCode = data.airCode;
      obj.destCode = data.destCode;
      if (data.fileObj && data.fileObj.id) {
        obj.fileId = data.fileObj.id
      }
      obj.airName = data.airName;
      obj.tel = data.tel;
      obj.fax = data.fax;
      obj.email = data.email;
      return obj;
    }
    /**
     * 编辑
     */
    function edit(id) {
      $state.go('pactlOption.airlineDetail', {
        alid: id
      })
    }
    /**
     * 停用
     * 
     * @param {any} id
     */
    function disable(id) {
      restAPI.airData.disable.save({}, {
          alId: id
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
      restAPI.airData.enable.save({}, {
          alId: id
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
              content: '你将要删除航空公司' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.airData.delAir.save({}, {
            alId: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除航空公司成功'
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

module.exports = angular.module('app.pactlOption.airline', []).controller('airlineCtrl', airline_fn);