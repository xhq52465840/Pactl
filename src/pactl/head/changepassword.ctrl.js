'use strict';
var jsSHA = require('../../lib/sha1/sha1.js');

module.exports = ['$scope', '$modalInstance', 'restAPI', '$rootScope','Auth','Notification',
  function ($scope, $modalInstance, restAPI, $rootScope,Auth,Notification) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.save = save;
    vm.passwordObj = {};

    /**
     * 保存
     */
    function save() {
      $rootScope.loading = true;
      var obj = {};
      var oldpassword = new jsSHA('SHA-1', 'TEXT'),
      newpassword = new jsSHA('SHA-1', 'TEXT');
      oldpassword.update(vm.passwordObj.oldpassword);
      newpassword.update(vm.passwordObj.newpassword);
      obj.oldpassword = oldpassword.getHash('HEX');
      obj.newpassword = newpassword.getHash('HEX');

      restAPI.user.changePassword.save({
        id: Auth.getId()
      }, obj).$promise.then(function (resp) {
        $rootScope.loading = false;
        if (resp && resp.status === 9999) {
          Notification.error({
            message: resp.msg
          });
        } else {
          $modalInstance.close();
          Notification.success({
            message: '修改密码成功'
          });
        }
      });
    }

    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss();
    }
  }
];