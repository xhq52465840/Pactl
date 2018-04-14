'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', 'Notification',
  function ($scope, $modalInstance, restAPI, items, Notification) {
    var vm = $scope;
    vm.airObj = {
      file: null
    };
    vm.cancel = cancel;
    vm.changeText = changeText;
    vm.changeText2 = changeText2;
    vm.save = save;
    vm.title = items.title;
    vm.uploadCallback = uploadCallback;

    /**
     * 上传文件
     */
    function uploadCallback(res, param) {
      var file = res;
      var respDt = file.data;
      if (file && file.ok) {
        vm.airObj.fileObj = {
          id: respDt.fileId,
          url: respDt.fileHttpPath
        };
      } else {
        Notification.error({
          message: '上传失败'
        });
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.airObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 二字码校验
     */
    function changeText() {
      try {
        vm.airObj.airCode = vm.airObj.airCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (/^[A-Z0-9]{2}$/g.test(vm.airObj.airCode)) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    /**
     * 三字码校验
     */
    function changeText2() {
      try {
        vm.airObj.destCode = vm.airObj.destCode.replace(/[^0-9]/g, '');
        if (/^[0-9]{3}$/g.test(vm.airObj.destCode)) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
  }
];