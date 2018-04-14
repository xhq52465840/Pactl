		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI', 
			function($scope, $modalInstance, items, $rootScope, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.elec = items.obj;
				vm.save = save;
				vm.title = items.title;
				vm.wbEle = items.wbEle;
				/**
				 * 标记为电子运单
				 */
				function save(type) {
					vm.elec.wb_ele = type;
					$modalInstance.close(vm.elec);
				}
				/**
				 * 取消
				 */
				function cancel() {
					$modalInstance.dismiss('cancel');
				}

			}
		];