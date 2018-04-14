'use strict';

module.exports = ['$scope', 'restAPI', '$modalInstance', '$state', 'Notification',
  function ($scope, restAPI, $modalInstance, $state, Notification) {
    var vm = $scope;
    vm.billObj = {};
    vm.cancel = cancel;
    vm.search = search;
    /**
     * 查询
     */
    function search() {
      var obj = getCondition();
      vm.loading = true;
      restAPI.waybill.billdetail.save({}, obj)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            $state.go('pactlReceive.acceptanceList', {
              'billNO': vm.billObj.srh_code + vm.billObj.srh_no
            });
            $modalInstance.dismiss('cancel');
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 查询条件
     */
    function getCondition() {
      var obj = {};
      obj.billNO = vm.billObj.srh_code + vm.billObj.srh_no;
      obj.page = 1;
      obj.rows = 1;
      return obj;
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    $scope.$watch('billObj.srh_code', function (newVal, oldVal) {
      if (newVal) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length < 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
        } else if (newVal.length === 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          angular.element('#s_srh_no').focus();
        } else if (newVal.length > 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          $scope.billObj.srh_no = newVal.substr(3);
          angular.element('#s_srh_no').focus();
        }
      }
    });
    $scope.$watch('billObj.srh_no', function (newVal, oldVal) {
      if (angular.isString(newVal)) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length) {
          $scope.billObj.srh_no = newVal.substr(0, 8);
        } else {
          if (oldVal && oldVal.length > 0 && newVal.length === 0) {
            angular.element('#s_srh_code').focus();
          } else {
            $scope.billObj.srh_no = newVal;
          }
        }
      }
    });
  }
];