'use strict';

var certCode_fn = ['$scope', '$rootScope', 'restAPI', '$stateParams', '$window', 'Notification',
  function ($scope, $rootScope, restAPI, $stateParams, $window, Notification) {
    var vm = $scope;
    vm.certData = [];
    vm.printCode = printCode;
    vm.goodTypeData = [];

    getCargoType();

    /**
     * 获取所有货物类型
     */
    function getCargoType() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.goodTypeData = resp.rows;
          search();
        });
    }
    /**
     * 获取数据
     */
    function search() {
      $rootScope.loading = true;
      restAPI.book.bookList.save({}, {
          bookId: $stateParams.printCode
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.certData = resp.rows || [];
          setData();
        });
    }

    function setData() {
      var ids = [];
      angular.forEach(vm.certData, function (v, k) {
        ids.push({
          id: v.pAgentShareBook.bookNo
        });
        v.barCode = 'data:image/jpeg;base64,' + v.pAgentShareBook.bookNo;
      });


      $rootScope.loading = true;
      restAPI.code.onebarcodes.save({}, ids)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            var data = resp.data;
            angular.forEach(vm.certData, function (v, k) {
              v.barCode = 'data:image/jpeg;base64,' + data[v.pAgentShareBook.bookNo];
            });
          } else {
            Notification.warning({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 打印
     */
    function printCode() {
      $window.print();
    }
  }
];

module.exports = angular.module('app.agentAssist.certCode', []).controller('certCodeCtrl', certCode_fn);