		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
			function($scope, $modalInstance, items, $rootScope, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.back = items.obj;
				vm.save = save;
				vm.title = items.title;

				/**
				 *保存
				 */
				function save() {
					$modalInstance.close(vm.back);
				}
				/**
				 * 取消说
				 */
				function cancel() {
					$modalInstance.dismiss('cancel');
				}

			}
		];