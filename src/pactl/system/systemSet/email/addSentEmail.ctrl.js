'use strict';

module.exports = ['$scope', 'restAPI', '$rootScope', '$modalInstance', 'items',
  function ($scope, restAPI, $rootScope, $modalInstance, items) {
    var vm = $scope;
    vm.title = items.title;
    vm.cancel = cancel;
    vm.sent = angular.copy(items.obj);
    vm.save = save;
    vm.sentTypes = items.sentTypes;
    vm.sentEmails = items.sentEmails;
    setData();
    /**
     * 显示编辑时的数据
     */
    function setData() {
      if (vm.sent.emailId) {
        for (var i = 0; i < vm.sentEmails.length; i++) {
          var element = vm.sentEmails[i];
          if (element.id === +vm.sent.emailId) {
            vm.sent.emailId = element;
            break;
          }
        };
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.sent);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];