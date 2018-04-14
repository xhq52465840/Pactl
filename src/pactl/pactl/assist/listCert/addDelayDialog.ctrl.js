'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Notification', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, Notification, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.airData = [];
    vm.title = obj.title;
    vm.delayObj = obj.obj;
    vm.save = save;
    vm.cancel = cancel;

    getAirData();

    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.officeInfo.queryDetail.save({}, {
          ocId: items.ocId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            angular.forEach(resp.data.airLineDelayVos, function (v, k) {
              vm.airData.push(v.pAirLineDelay);
            });
            setData();
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }
    /**
     * 显示数据
     */
    function setData() {
      if (vm.delayObj.airCode) {
        for (var index = 0; index < vm.airData.length; index++) {
          var element = vm.airData[index];
          if (vm.delayObj.airCode === element.airCode) {
            vm.delayObj.air = element;
            element.saveFlag = true;
            break;
          }
        }
      }
      var data = [];
      angular.forEach(vm.airData, function (m, n) {
        if ((obj.oldData || []).indexOf(m.airCode) < 0) {
          data.push(m);
        }
      });
      vm.airData = data;
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.delayObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];