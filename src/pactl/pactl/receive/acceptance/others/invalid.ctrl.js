		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI', 
			function($scope, $modalInstance, items, $rootScope, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.remark = items.obj;
				vm.wFlag = items.wFlag;
				vm.save = save;
				vm.title = items.title;
				/**
				 * 标记为无效/有效运单
				 */
				function save(type) {
					vm.remark.wFlag = type;
					$modalInstance.close(vm.remark);
				}
				/**
				 * 取消
				 */
				function cancel() {
					$modalInstance.dismiss('cancel');
				}

			}
		];