'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Notification',
  function ($scope, $modalInstance, items, restAPI, Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.remarkObj = obj.obj;
    vm.remarkData = [];
    vm.save = save;
    vm.cancel = cancel;

    /**
     * 保存
     */
    function save() {
      restAPI.tag.addTag.save({}, obj)
        .$promise.then(function (resp) {
          vm.search();
          Notification.success({
            message: '添加备注成功'
          });
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