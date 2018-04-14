'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Auth',
	function ($scope, $modalInstance, items, restAPI, $rootScope, Auth) {
		var vm = $scope;
		vm.title = items.title;
		vm.proxyObj = {};
		vm.save = save;
		vm.cancel = cancel;

		check();

		function check() {
			if (items.type === 'all') {
				getAllSales();
			} else {
				getAgentSales();
			}
		}
		/**
		 * 获取所有的销售代理
		 */
		function getAgentSales() {
			$rootScope.loading = true;
			restAPI.agent.saleAgents.query({
					id: Auth.getUnitId()
				}, {})
				.$promise.then(function (resp) {
					$rootScope.loading = false;
					vm.salesData = resp;
				});
		}
		/**
		 * 获取所有的操作代理
		 */
		function getAllSales() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.salesData = resp;
        });
		}
		/**
		 * 保存
		 */
		function save() {
			$modalInstance.close(vm.proxyObj);
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}

	}
];