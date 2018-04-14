'use strict';

module.exports = ['$scope', '$modalInstance', 'items','restAPI','Notification','$rootScope','$state',
  function($scope, $modalInstance, items,restAPI,Notification,$rootScope,$state) {
    var vm = $scope;
    vm.items = items;
    vm.save = save;
    vm.cancel = cancel;
    vm.shippingWayBillAwId = items.shippingWayBillAwId;
    vm.awId = items.awId;
    vm.goodsQuoteType = items.goodsQuoteType;
    vm.pAirWaybillInfo = {};
    vm.showWayBill = showWayBill;

    searchWayBill();
    function searchWayBill() {
			$rootScope.loading = true;
			restAPI.subBill.getMasterBill.save({}, vm.shippingWayBillAwId)
				.$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					if (resp.data && resp.data.pAirWaybillInfo && resp.data.pAirWaybillInfo.awId) {
            vm.pAirWaybillInfo = resp.data.pAirWaybillInfo;
					}
				} else {
					Notification.error({
					  message: resp.msg
					});
				}
			});
		}
    /**
		 * 品名咨询
		 */
		function showWayBill() {
			if(vm.goodsQuoteType === '102') {
				var url = $state.href("pactlReceive.acceptanceListById", {
					'awId': vm.pAirWaybillInfo.awId,
          'read': 1
				});
				window.open(url);
			}else if(vm.goodsQuoteType === '103') {
				var url = $state.href("pactlReceive.acceptanceListById", {
          'awId': vm.pAirWaybillInfo.parentNo,
          'read': 1
        });
        window.open(url);
			} 
		}

    // 保存
    function save() {
      $modalInstance.close();
    }
    // 取消
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];