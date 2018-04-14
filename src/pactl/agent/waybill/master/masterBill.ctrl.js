'use strict';

var masterBill_fn = ['$scope', 'restAPI', '$rootScope', 'Notification', '$state', 'niceBar', '$timeout',
  function ($scope, restAPI, $rootScope, Notification, $state, niceBar, $timeout) {
    var vm = $scope;
    vm.billObj = {};
    vm.contentLoading = false;
    vm.newBill = newBill;
    vm.search = search;
    vm.showNew = showNew;
    vm.showSearch = showSearch;
    vm.doNewBill = doNewBill;
    vm.showResult = false;
    vm.recentlyData = [];

    getRecentlyData();

    /**
     * 获取最近的20条数据
     */
    function getRecentlyData() {
      vm.contentLoading = true;
      restAPI.bill.recentlyData.save({}, {
          rows: 20,
          page: 1
        })
        .$promise.then(function (resp) {
          vm.contentLoading = false;
          vm.recentlyData = resp.rows || [];
          $timeout(function () {
            niceBar.init(document.getElementById('bill-right-body'));
          }, 10);
        });
    }
    /**
     * 查询
     */
    function search() {
      if (valid('srh')) {
        $rootScope.loading = true;
        restAPI.airData.queryList.save({}, {
            destCode: vm.billObj.srh_code
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.rows.length) {
              doSearch();
            } else {
              Notification.error({
                message: '没有维护该航空公司的数据，请先增加该航空公司'
              });
            }
          });
      }
    }
    /**
     * 查询
     */
    function doSearch() {
      $rootScope.loading = true;
      var billNo = vm.billObj.srh_code + vm.billObj.srh_no;
      restAPI.bill.billInfo.save({}, {
          waybillNo: billNo,
          type: '0'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
              goToBill(billNo);
            } else {
              vm.showResult = true;
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

    /**
     * 新建运单
     */
    function newBill() {
      if (valid('new')) {
        $rootScope.loading = true;
        restAPI.airData.queryList.save({}, {
            destCode: vm.billObj.new_code
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.rows.length) {
              doNewBill();
            } else {
              Notification.error({
                message: '没有维护该航空公司的数据，请先增加该航空公司'
              });
            }
          });
      }
    }

    /**
     * 新建运单
     */
    function doNewBill() {
      if (valid('new')) {
        $rootScope.loading = true;
        var waybillNo = vm.billObj.new_code + vm.billObj.new_no;
        restAPI.bill.checkBill.save({}, {
          waybillNo: waybillNo
        }).$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            goToBill(waybillNo);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
      }
    }
    /**
     * 跳转到主单
     * @param {any} params
     */
    function goToBill(params) {
      $state.go('agentWaybill.newMasterBill', {
        billNo: params
      });
    }
    /**
     * 校验数据
     * 
     */
    function valid(type) {
      if (type === 'srh') {
        if (vm.billObj.srh_code && vm.billObj.srh_no) {
          return true;
        } else {
          Notification.error({
            message: '请填写运单号'
          });
          return false;
        }
      } else if (type === 'new') {
        if (vm.billObj.new_code && vm.billObj.new_no) {
          return true;
        } else {
          Notification.error({
            message: '请填写运单号'
          });
          return false;
        }
      }
    }
    /**
     * 回到查询
     */
    function showSearch() {
      vm.showResult = false;
      vm.billObj = {};
    }
    /**
     * 直接新建
     */
    function showNew() {
      vm.billObj.new_code = vm.billObj.srh_code;
      vm.billObj.new_no = vm.billObj.srh_no;
      newBill();
    }
    $scope.$watch('billObj.srh_code', function (newVal, oldVal) {
      if (newVal) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length < 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
        } else if (newVal.length === 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          angular.element('#srh_no').focus();
        } else if (newVal.length > 3) {
          $scope.billObj.srh_code = newVal.substr(0, 3);
          $scope.billObj.srh_no = newVal.substr(3);
          angular.element('#srh_no').focus();
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
            angular.element('#srh_code').focus();
          } else {
            $scope.billObj.srh_no = newVal;
          }
        }
      }
    });
    $scope.$watch('billObj.new_code', function (newVal, oldVal) {
      if (newVal) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length < 3) {
          $scope.billObj.new_code = newVal.substr(0, 3);
        } else if (newVal.length === 3) {
          $scope.billObj.new_code = newVal.substr(0, 3);
          angular.element('#new_no').focus();
        } else if (newVal.length > 3) {
          $scope.billObj.new_code = newVal.substr(0, 3);
          $scope.billObj.new_no = newVal.substr(3);
          angular.element('#new_no').focus();
        }
      }
    });
    $scope.$watch('billObj.new_no', function (newVal, oldVal) {
      if (angular.isString(newVal)) {
        newVal = newVal.replace(/[^0-9]/g, '');
        if (newVal.length) {
          $scope.billObj.new_no = newVal.substr(0, 8);
        } else {
          if (oldVal && oldVal.length > 0 && newVal.length === 0) {
            angular.element('#new_code').focus();
          } else {
            $scope.billObj.new_no = newVal;
          }
        }
      }
    });
  }
];

module.exports = angular.module('app.agentWaybill.masterBill', []).controller('masterBillCtrl', masterBill_fn);