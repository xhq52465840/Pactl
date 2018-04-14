		'use strict';

		module.exports = ['$scope', '$modalInstance', 'items', 'restAPI',
			function ($scope, $modalInstance, items, restAPI) {
				var vm = $scope;
				vm.cancel = cancel;
				vm.obj = {};
				vm.loading = false;
				vm.title = items.title;
				vm.save = save;

				getType();

				/**
				 * 查询是否需要开箱
				 */
				function getType() {
					vm.loading = true;
					restAPI.preJudice.checkRebook.save({}, {
						awId: items.awId
					}).$promise.then(function (resp) {
						vm.loading = false;
						if (resp.ok) {
							vm.obj.type = resp.data.ckOpenFlag;
						}
					});
				}
				/**
				 * 保存
				 */
				function save(type) {
					$modalInstance.close({
						type: type
					});
				}
				/**
				 * 取消
				 */
				function cancel() {
					$modalInstance.dismiss('cancel');
				}
			}
		];