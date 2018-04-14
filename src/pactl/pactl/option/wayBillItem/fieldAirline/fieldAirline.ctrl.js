'use strict';

module.exports = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.airData = [];
    vm.airportData = [];
    vm.countryData = [];
    vm.edit = edit;
    vm.fieldObj = {};
    vm.fieldData = [];
    vm.field = [];
    vm.fieldType = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
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
          getCountry();
        });
    }
    /**
     * 获取国家
     */
    function getCountry() {
      $rootScope.loading = true;
      restAPI.country.queryAll.save({}, {})
        .$promise.then(function (resp) {
          vm.countryData = resp.data;
          getFieldType();
        });
    }
    /**
     * 获取所有的分类
     */
    function getFieldType() {
      $rootScope.loading = true;
      restAPI.fieldType.queryAll.save({}, {})
        .$promise.then(function (resp) {
          vm.fieldType = resp.data;
          getField();
        });
    }
    /**
     * 获取所有的字段
     */
    function getField() {
      $rootScope.loading = true;
      restAPI.field.queryAll.save({}, {})
        .$promise.then(function (resp) {
          vm.field = resp.data;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getFieldData();
    }
    /**
     * 获取航空公司必录项数据
     */
    function getFieldData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.fieldAirline.fieldList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.fieldData = resp.rows;
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
      if (vm.fieldObj.dest) {
        obj.dest = vm.fieldObj.dest.airportCode;
      }
      if (vm.fieldObj.air) {
        obj.air = vm.fieldObj.air.airCode;
      }
      if (vm.fieldObj.country) {
        obj.country = vm.fieldObj.country.countryName;
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
      var addFieldDialog = $modal.open({
        template: require('./addField.html'),
        controller: require('./addField.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增航空公司必录项',
              field: vm.field,
              airData: vm.airData,
              airportData: vm.airportData,
              countryData: vm.countryData,
              obj: {}
            };
          }
        }
      });
      addFieldDialog.result.then(function (data) {
        var obj = {};
        obj.airline = data.air.airCode;
        obj.country = data.country.countryName;
        obj.dest = data.dest.airportCode;
        obj.fieldMaintainId = data.field.id;
        $rootScope.loading = true;
        restAPI.fieldAirline.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增航空公司必录项成功'
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
      var editFieldDialog = $modal.open({
        template: require('./addField.html'),
        controller: require('./addField.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑航空公司必录项: ' + param.fieldMaintain.field,
              field: vm.field,
              airData: vm.airData,
              airportData: vm.airportData,
              countryData: vm.countryData,
              obj: {
                field: param.fieldMaintain.id,
                airline: param.requiredField.airline,
                country: param.requiredField.country,
                dest: param.requiredField.dest
              }
            };
          }
        }
      });
      editFieldDialog.result.then(function (data) {
        var obj = {};
        obj.airline = data.air.airCode;
        obj.country = data.country.countryName;
        obj.dest = data.dest.airportCode;
        obj.fieldMaintainId = data.field.id;
        obj.id = param.requiredField.id;
        $rootScope.loading = true;
        restAPI.fieldAirline.addField.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑航空公司必录项成功'
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
        template: require('../../../../remove/remove.html'),
        controller: require('../../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除航空公司必录项' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.fieldAirline.delField.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除航空公司必录项成功'
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