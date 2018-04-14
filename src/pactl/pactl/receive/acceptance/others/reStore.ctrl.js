		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
			function($scope, $modalInstance, items, $rootScope, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.restore = items.obj;
				vm.save = save;
				vm.title = items.title;

				/**
				 *重新入库
				 */
				function save(type) {
					vm.restore.type = type;
					$modalInstance.close(vm.restore);
				}
				/**
				 * 取消
				 */
				function cancel() {
					$modalInstance.dismiss('cancel');
				}

			}
		];