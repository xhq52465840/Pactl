'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Notification', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, Notification, $rootScope) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.changeText = changeText;
    vm.obj = angular.copy(items.obj);
    vm.save = save;
    vm.title = items.title;

    setData();
    /**
     * 初始化数据
     */
    function setData() {
      vm.obj.waybillNo = '';
      delete vm.obj.awId;
    }
    /**
     * 保存
     */
    function save() {
      var obj = vm.obj;
      $rootScope.loading = true;
      restAPI.subBill.checksubwbno.save({}, {
          parentNo: obj.parentNo,
          waybillNo: obj.waybillNo
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            saveBill(obj);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 保存运单
     */
    function saveBill(obj) {
      $rootScope.loading = true;
      restAPI.bill.saveBill.save({}, {
          pAirWaybillInfo: obj
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            $modalInstance.close(resp.data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 分单号校验
     */
    function changeText() {
      try {
        vm.obj.waybillNo = vm.obj.waybillNo.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
  }
];