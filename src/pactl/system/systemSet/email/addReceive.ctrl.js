'use strict';

module.exports = ['$scope', 'restAPI', '$rootScope', '$modalInstance', 'items',
  function($scope, restAPI, $rootScope, $modalInstance, items) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.receive = angular.copy(items.obj);
    vm.receiveTypes = items.receiveTypes;
    vm.receiveEmails = items.receiveEmails;
    vm.save = save;
    vm.title = items.title;

    setData();
    /**
     * 显示编辑时的数据
     */
    function setData() {
      if (vm.receive.emailId) {
        for (var i = 0; i < vm.receiveEmails.length; i++) {
          var element = vm.receiveEmails[i];
          if (element.id === +vm.receive.emailId) {
            vm.receive.emailId = element;
            break;
          }
        };
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.receive);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];