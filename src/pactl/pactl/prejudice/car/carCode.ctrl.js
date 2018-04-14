'use strict';

var carCode_fn = ['$scope', '$rootScope', 'restAPI', '$stateParams', '$window', 'Notification', 'printHtml',
  function ($scope, $rootScope, restAPI, $stateParams, $window, Notification, printHtml) {
    var vm = $scope;
    var truckBill = $stateParams.truckBill;
    vm.carData = [];
    vm.printCode = printCode;
    vm.wStatusData = [];
    vm.listData = [];

    getAuditData();

    function check() {
      if (truckBill) {
        getAuditData();
      }
    }
    /**
     * 获取所有的预审状态
     */
    function getAuditData() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314336069737'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.wStatusData = resp.rows;
          search();
        });
    }

    /**
     * 获取数据
     */
    function search() {
      $rootScope.loading = true;
      restAPI.car.carCode.save({}, {
          truckBill: truckBill
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.carData = resp.data;
            vm.carData.truckBillBarCode = 'data:image/jpeg;base64,' + vm.carData.truckBillBarCode;
            angular.forEach(vm.carData.waybillList, function (v, k) {
              v.barCode = 'data:image/jpeg;base64,' + v.barCode;
            });
            setData();
          } else {
            Notification.warning({
              message: resp.msg
            });
          }
        });
    }

    function setData() {
      var waybillList = vm.carData.waybillList;
      var data = waybillList.slice(0, 6);
      var data1 = waybillList.slice(6);
      vm.listData.push(data);
      angular.forEach(data1, function (v, k) {
        var index = parseInt(k / 8) + 1;
        !vm.listData[index] && (vm.listData[index] = []);
        vm.listData[index].push(v);
      });
      var index = 0;
      angular.forEach(vm.listData, function(v) {
        angular.forEach(v, function(m) {
         m.index = ++index;
        });
      });
    }
    /**
     * 打印
     */
    function printCode() {
      printHtml.print({
        top: '0.2',
        bottom: '0.2',
        left: '0.2',
        right: '0.2'
      });
    }
  }
];

module.exports = angular.module('app.pactlPrejudice.carCode', []).controller('carCodeCtrl', carCode_fn);