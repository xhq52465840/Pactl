'use strict';

module.exports = ['$scope', 'restAPI', '$rootScope', 'Notification', '$modalInstance', 'items',
  function($scope, restAPI, $rootScope, Notification, $modalInstance, items) {
    var vm = $scope;
    vm.afterTest = true;
    vm.title = items.title;
    vm.email = angular.copy(items.obj);
    vm.cancel = cancel;
    vm.save = save;
    vm.mailTypes = [{
      id: "0",
      name: "pop3"
    }, {
      id: "1",
      name: "imap"
    }];
    vm.test = test;

    setData();
    /**
     * 显示数据
     */
    function setData() {
      if(vm.email) {
       delete vm.email.recvPass;
       delete vm.email.sendPass;
      }
      if (vm.email.accountCode) {
        if (vm.email.recvProto) {
          for (var i = 0; i < vm.mailTypes.length; i++) {
            var element = vm.mailTypes[i];
            if (element.name === vm.email.recvProto) {
              vm.email.recvProto = element;
              break;
            }
          };
        }
      }
    }
    /**
     * 验证是否可以通过，true表示通过，可以点击保存按钮，否则不能点击保存
     */
    function test() {
      $rootScope.loading = true;
      var obj = getData();
      restAPI.systemEmail.test.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: resp.data
            });
            vm.afterTest = false;
          } else {
            Notification.error({
              message: resp.msg
            });
            vm.afterTest = true;
          }
        })
    }
    /**
     * 需要验证的数据
     */
    function getData() {
      var obj = {};
      obj.recvProto = vm.email.recvProto ? vm.email.recvProto.name : '';
      obj.recvUser = vm.email.recvUser;
      obj.recvPass = vm.email.recvPass;
      obj.recvHost = vm.email.recvHost;
      obj.recvSsl = vm.email.recvSsl ? '1' : '0';
      obj.recvPort = vm.email.recvPort;
      obj.sendUser = vm.email.sendUser;
      obj.sendPass = vm.email.sendPass;
      obj.sendHost = vm.email.sendHost;
      obj.sendSsl = vm.email.sendSsl ? '1' : '0';
      obj.sendPort = vm.email.sendPort;
      obj.sendAuth = 'true';
      return obj;
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.email);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

  }
];