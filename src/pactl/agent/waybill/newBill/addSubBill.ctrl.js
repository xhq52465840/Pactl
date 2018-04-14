'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI', 'Notification', 'Auth',
  function ($scope, $modalInstance, items, $rootScope, restAPI, Notification, Auth) {
    var vm = $scope;
    vm.add = add;
    vm.billData = [];
    vm.billObj = {};
    vm.cancel = cancel;
    vm.changeText = changeText;
    vm.select = select;
    vm.search = search;
    vm.title = items.title;

    search();

    /**
     * 获取分单
     */
    function search() {
      $rootScope.loading = true;
      restAPI.subBill.billList.save({}, {
          parentNo: '',
          waybillNo: vm.billObj.waybillNo
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.billData = resp.rows;
        });
    }
    /**
     * 确认
     * 1.检验能否使用该分单号创建
     * 2.创建该分单
     * 3.和主单关联
     */
    function add() {
      if (!vm.billObj.waybillNo) {
        Notification.error({
          message: '请填写分单号'
        });
        return false;
      }
      var obj = {};
      obj.type = '1';
      obj.parentNo = items.awId;
      obj.waybillNo = vm.billObj.waybillNo;
      obj.agentOprnId = Auth.getUnitId() + '';
      obj.agentSalesId = Auth.getMyUnitId() + '';
      obj.agentOprn = Auth.getUnitCode();
      obj.agentSales = Auth.getMyUnitCode();
      check(obj);
    }
    /**
     * 校验分单号
     */
    function check(obj) {
      $rootScope.loading = true;
      restAPI.subBill.checksubwbno.save({}, obj)
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
            Notification.success({
              message: '关联主单成功'
            });
            $modalInstance.close(resp.data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 关联主单
     */
    function select(data) {
      restAPI.preJudice.disConnect.save({}, {
          parentNo: items.awId,
          awId: data.awId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '关联主单成功'
            });
            $modalInstance.close({
              pAirWaybillInfo: data
            });
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
        vm.billObj.waybillNo = vm.billObj.waybillNo.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
  }
];