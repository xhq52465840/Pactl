'use strict';

module.exports = ['$scope', '$modalInstance', '$modal', 'restAPI', 'Notification', 'items', '$rootScope',
  function ($scope, $modalInstance, $modal, restAPI, Notification, items, $rootScope) {
    var vm = $scope;
    vm.certObj = items.obj;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = items.title;
    vm.send = send;
    vm.showResult = false;

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.certObj.bookSerialNumber);
    }
    /**
     * 收到正文
     */
    function send() {
      $rootScope.loading = true;
      restAPI.book.receiveBook.save({}, {
          bookId: vm.certObj.bookId,
          agentOprn: vm.certObj.agentOprn,
          auditStatus: '104'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.showResult = true;
            vm.certObj.bookSerialNumber = resp.data.bookSerialNumber;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
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