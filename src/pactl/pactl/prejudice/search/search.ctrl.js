'use strict';

module.exports = ['$scope', '$modalInstance', '$state', '$rootScope', 'restAPI', 'Notification',
  function ($scope, $modalInstance, $state, $rootScope, restAPI, Notification) {
    var vm = $scope;
    vm.billObj = {};
    vm.cancel = cancel;
    vm.search = search;

    /**
     * 查询
     */
    function search() {
      var data = vm.billObj.srh_code + vm.billObj.srh_no;
      if (data) {
        $rootScope.loading = true;
        restAPI.preJudice.querySingleCargo.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (angular.isObject(resp.data) && resp.data.parentBillInfo) {
              $state.go('pactlPrejudice.singleCargo', {
                waybill: data
              });
              cancel();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      } else {
        Notification.error({
          message: '运单号为空'
        });
      }
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
          angular.element('#pre_srh_no').focus();
        } else if (newVal.length > 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          $scope.billObj.srh_no = newVal.substr(3);
          angular.element('#pre_srh_no').focus();
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
            angular.element('#pre_srh_code').focus();
          } else {
            $scope.billObj.srh_no = newVal;
          }
        }
      }
    });
  }
];