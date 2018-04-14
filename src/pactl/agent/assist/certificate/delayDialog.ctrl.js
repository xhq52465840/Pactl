'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, $rootScope) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.airData = [];
    vm.airDelay = [];
    vm.goodTypeData = [];
    vm.officeDelay = [];
    vm.officeCodeData = [];
    vm.bookDelay = [];
    vm.showOfficeSub = false;
    vm.showAirSub = false;
    vm.goodsType = items.goodsType;

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
          setData();
        });
    }
    /**
     * 显示数据
     */
    function setData() {
      var officeDelay = angular.copy(items.officeDelay),
        airDelay = angular.copy(items.airDelay),
        officeInfo = angular.copy(items.officeInfo),
        bookDelay = angular.copy(items.bookAirDelay);
      angular.forEach(officeDelay, function (v, k) {
        v.shortName = officeInfo.shortName;
        v.days && vm.officeDelay.push(v);
      });
      angular.forEach(airDelay, function (v, k) {
        v.shortName = officeInfo.shortName;
        v.days && vm.airDelay.push(v);
      });
      angular.forEach(bookDelay, function (v, k) {
        v.shortName = officeInfo.shortName;
        v.days && vm.bookDelay.push(v);
      });
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];