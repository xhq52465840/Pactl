'use strict';

var nameAdvice_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.airData = [];
    vm.airportData = [];
    vm.airportDataPart = [];
    vm.nameObj = {
      type: '0'
    };
    vm.nameData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.add = add;
    vm.edit = edit;
    vm.remove = remove;
    vm.reset = reset;
    vm.search = search;
    vm.select = select;
    vm.refreshDest = refreshDest;

    getAirData();

    /**
     * 获取航空公司数据
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          getAirPortData();
        });
    }
    /**
     * 获取目的港
     */
    function getAirPortData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airportData = resp.data || [];
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getNameData();
    }
    /**
     * 获取品名数据
     */
    function getNameData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.goods.nameList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.nameData = resp.rows;
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
      var dest = [];
      angular.forEach(vm.nameObj.dest || [], function (v, k) {
        dest.push(v.airportCode);
      });
      obj.dest = dest.join(';');
      var fltCode = [];
      angular.forEach(vm.nameObj.fltCode || [], function (v, k) {
        fltCode.push(v.airCode);
      });
      obj.fltCode = fltCode.join(';');
      var noFltCode = [];
      angular.forEach(vm.nameObj.noFltCode || [], function (v, k) {
        noFltCode.push(v.airCode);
      });
      obj.noFltCode = noFltCode.join(';');
      obj.goodsName = vm.nameObj.goodsName;
      obj.embargo = vm.nameObj.type;
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 重置
     */
    function reset() {
      var type = vm.nameObj.type;
      vm.nameObj = {
        type: type
      };
    }
    /**
     * 切换
     */
    function select(type) {
      vm.nameObj.type = type;
      vm.page.currentPage = 1;
      search();
    }
    /**
     * 新增
     */
    function add() {
      var addDialog = $modal.open({
        template: require('./addName.html'),
        controller: require('./addName.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              airData: vm.airData,
              airportData: vm.airportData,
              title: vm.nameObj.type === '0' ? '品名白名单' : '禁运品名',
              obj: {}
            };
          }
        }
      });
      addDialog.result.then(function (resp) {
        $rootScope.loading = true;
        var obj = getAddData(resp);
        restAPI.goods.saveName.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加成功'
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
    /**
     * 获取添加的数据
     */
    function getAddData(params) {
      var obj = {};
      if (params.dest) {
        obj.dest = params.dest.airportCode;
      }
      if (params.dest.length) {
        obj.dest = [];
        angular.forEach(params.dest, function (v, k) {
          obj.dest.push(v.airportCode);
        });
        obj.dest = obj.dest.join(';');
      }
      if (params.fltCode.length) {
        obj.fltCode = [];
        angular.forEach(params.fltCode, function (v, k) {
          obj.fltCode.push(v.airCode);
        });
        obj.fltCode = obj.fltCode.join(';');
      }
      if (params.noFltCode.length) {
        obj.noFltCode = [];
        angular.forEach(params.noFltCode, function (v, k) {
          obj.noFltCode.push(v.airCode);
        });
        obj.noFltCode = obj.noFltCode.join(';');
      }
      obj.goodsName = params.goodsName;
      obj.embargo = vm.nameObj.type;
      return obj;
    }
    /**
     * 编辑
     */
    function edit(data) {
      var editDialog = $modal.open({
        template: require('./addName.html'),
        controller: require('./addName.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑：' + data.goodsName,
              airData: vm.airData,
              airportData: vm.airportData,
              obj: {
                dest: data.dest,
                fltCode: data.fltCode,
                noFltCode: data.noFltCode,
                goodsName: data.goodsName
              }
            };
          }
        }
      });
      editDialog.result.then(function (resp) {
        var obj = getAddData(resp);
        obj.id = data.id;
        $rootScope.loading = true;
        restAPI.goods.saveName.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑成功'
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
              content: '你将要删除' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.goods.delName.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {});
    }
    /**
     * 
     * 根据参数查询机场数据
     * 
     * @param {any} param
     */
    function refreshDest(param) {
      var searchObj = {};
      vm.airportDataPart = [];
      if (param) {
        searchObj = {
          airportCode: param
        };
      } else {
        searchObj = {
          airportCode: param,
          isCommon: '1'
        };
      }
      restAPI.airPort.queryList.save({}, searchObj)
        .$promise.then(function (resp) {
          vm.airportDataPart = resp.rows;
        });
    }
  }
];

module.exports = angular.module('app.pactlOption.nameAdvice', []).controller('nameAdviceCtrl', nameAdvice_fn);