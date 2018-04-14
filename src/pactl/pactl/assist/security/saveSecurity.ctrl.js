'use strict';

module.exports = [
    '$scope',
    '$modalInstance',
    'items',
    function($scope, $modalInstance, items) {
        var vm = $scope;
        vm.items = items;
        vm.save = save;
        vm.cancel = cancel;

        // 保存
        function save() {
            $modalInstance.close(items.refundData);
        }
        // 取消
        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
];
