'use strict';

var book_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope',
  function($scope, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.airData = [];
    vm.edit = edit;
    vm.remove = remove;
    vm.bookData = [];
    vm.bookObj = {};
    vm.countryData = [];
    vm.search = search;
    vm.refreshDest = refreshDest;

    getAirData();

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
        .$promise.then(function(resp) {
          vm.airportDataPart = resp.rows;
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          getCountryData();
        });
    }

     /**
     * 获取国家
     */
    function getCountryData() {
      $rootScope.loading = true;
      restAPI.country.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.countryData = resp.data || [];
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getBookData();
    }
    /**
     * 获取数据
     */
    function getBookData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bookRule.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            var data1 = [],
              data2 = [];
            angular.forEach(resp.data, function(v, k) {
              var index = data1.indexOf(v.airCode),
                currentIndex = data2.length - 1;
              if (index < 0) {
                data1.push(v.airCode);
                currentIndex = currentIndex + 1;
                data2[currentIndex] = [];
              }
              data2[currentIndex].push(v);
              if(v.destCode === '*') {
                v.destName = '所有';
              } else {
                v.destName = v.destCode;
              }
            });
            vm.bookData = data2;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {};
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      vm.bookObj.airCode && (obj.airCode = vm.bookObj.airCode.airCode);
      vm.bookObj.destCode && (obj.destCode = vm.bookObj.destCode.airportCode);
      return obj;
    }
    /**
     * 新增
     */
    function add() {
      var addbookDialog = $modal.open({
        template: require('./addBook.html'),
        controller: require('./addBook.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增审单宝典',
              airData: vm.airData,
              countryData: vm.countryData,
              obj: {

              },
              isEdit: false
            };
          }
        }
      });
      addbookDialog.result.then(function(data) {
          search();
      }, function(resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(params) {
      var editbookDialog = $modal.open({
        template: require('./addBook.html'),
        controller: require('./addBook.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑审单宝典',
              airData: vm.airData,
              countryData: vm.countryData,
              obj: {
                airCode: params.airCode,
                destCode: params.destCode || '',
                rule: params.rule,
                coding: params.coding,
                id:params.id,
                countryCode: params.countryCode
              },
              isEdit: true
            };
          }
        }
      });
      editbookDialog.result.then(function(data) {
          search();
      }, function(resp) {

      });
    }
    /**
     * 新增数据
     */
    function getData(params) {
      var obj = {};
      obj.airCode = params.airCode.airCode;
      obj.destCode = [];
      angular.forEach(params.destCode || [], function(v, k) {
        obj.destCode.push(v.airportCode);
      });
      if(params.check.destAble) {
        obj.destCode = '*';
      } else {
        obj.destCode = obj.destCode.join(',');
      }
      obj.rule = params.rule;
      obj.coding = params.coding;
      return obj;
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
          items: function() {
            return {
              title: '删除：' + name,
              content: '你将要删除审单宝典' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.bookRule.delBoOk.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除审单宝典成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
  }
];

module.exports = angular.module('app.pactlOption.book', []).controller('bookCtrl', book_fn);