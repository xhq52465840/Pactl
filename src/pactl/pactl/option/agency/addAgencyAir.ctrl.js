'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
  function ($scope, $modalInstance, restAPI, items, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.airData = [];
    vm.airObj = obj.obj;
    vm.changeText = changeText;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;

    getAirData();

    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp.data, function (v, k) {
            vm.airData.push({
              airCode: v.airCode,
              airName: v.airName,
              alId: v.alId,
              id: v.id
            });
          });
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.airObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 计算
     */
    function changeText(params) {
      if (+(params.days || 0) <= +(params.maxDays || 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
];