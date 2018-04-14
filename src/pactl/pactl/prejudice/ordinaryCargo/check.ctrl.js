'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', '_upload', 'Download', 'items', 'Notification',
  function ($scope, $modalInstance, restAPI, _upload, Download, items, Notification) {
    var vm = $scope;
    var selected = [];
    var checkedData = [];
    vm.cancel = cancel;
    vm.check = check;
    vm.downloadFile = downloadFile;
    vm.loading = false;
    vm.title = items.title;
    vm.btnName = items.btnName;
    vm.itemObj = items.obj;
    vm.itemObj.checkTypeData = [];
    vm.upload = upload;
    vm.removeFile = removeFile;
    vm.reasonData = [];
    vm.save = save;

    getReason();
    /**
     * 获取不通过原因
     */
    function getReason() {
      vm.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480492445286861'
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          vm.reasonData = resp.rows;
          getCheckType();
        });
    }
    /**
     * 获取所有的现场检查类型
     */
    function getCheckType() {
      vm.loading = true;
      restAPI.specialcargo.checklist.save({}, {})
        .$promise.then(function (resp) {
          vm.loading = false;
          vm.itemObj.checkTypeData = resp.rows;
        });
    }
    /**
     * 单选
     */
    function check($e, param) {
      var checkbox = $e.target,
        id = param.id,
        index = selected.indexOf(id);
      param.checked = checkbox.checked;
      if (param.checked) {
        selected.push(id);
        checkedData.push(param);
      } else {
        selected.splice(index, 1);
        checkedData.spliceh(index, 1);
      }
    }
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
     * 校验
     */
    function valid() {
      var result = true;
      if (checkedData.length > 0 || vm.itemObj.actionComments) {
        result = true;
      } else {
        result = false;
      }
      return result;
    }
    /**
     * 保存
     */
    function save() {
      if (valid()) {
        vm.itemObj.remarkData = checkedData;
        if (vm.itemObj.actionComments) {
          vm.itemObj.remarkData.push({
            id: 'all',
            name: vm.itemObj.actionComments
          });
        }
        $modalInstance.close(vm.itemObj);
      } else {
        Notification.error({
          message: '有必填数据未填写'
        });
      }
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];