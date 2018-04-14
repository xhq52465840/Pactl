		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI', 
			function($scope, $modalInstance, items, $rootScope, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.remark = {};
				vm.save = save;
				vm.title = items.title;
				/**
				 * 标记为未进场
				 */
				function save() {
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