		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI', 
			function($scope, $modalInstance, items, $rootScope, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.remark = items.obj;
				vm.formalFlag = items.formalFlag;
				vm.save = save;
				vm.title = items.title;
				/**
				 * 标记为无效/有效运单
				 */
				function save(type) {
					vm.remark.formalFlag = type;
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