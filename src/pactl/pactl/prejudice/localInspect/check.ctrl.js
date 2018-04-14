'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', '_upload', 'Download', 'items', 'Notification',
  function ($scope, $modalInstance, restAPI, _upload, Download, items, Notification) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.downloadFile = downloadFile;
    vm.loading = false;
    vm.title = items.title;
    vm.btnName = items.btnName;
    vm.itemObj = items.obj;
    vm.upload = upload;
    vm.removeFile = removeFile;
    vm.save = save;

    /**
     * 上传文件
     */
    function upload(data) {
      var callback = function (resp) {
        data.file = '';
        if (resp.data && resp.data.data) {
          data.fileObj = {
            id: resp.data.data.fileId,
            name: resp.data.data.oldName,
            newName: resp.data.data.oldName.substring(0, 10) + (resp.data.data.oldName.length > 10 ? '...' : '')
          };
        }
      };
      if (data.file) {
        _upload._upload(data.file, callback, restAPI.file.uploadFile);
      }
    }
    /**
     * 删除文件
     */
    function removeFile(data) {
      restAPI.file.removeFile.save({}, {
          fileId: data.itemObj.fileObj.id
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            data.itemObj.fileObj = null;
            Notification.success({
              message: '文件删除成功'
            });
          } else {
            Notification.error({
              message: '文件删除失败'
            });
          }
        });
    }
    /**
     * 下载文件
     */
    function downloadFile(data) {
      var fileId = data.itemObj.fileObj.id;
      Download.downloadFile(fileId, restAPI.file.downloadFile);
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.itemObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];