'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Year', 'Notification', '$modal', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, Year, Notification, $modal, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.newItems = [{
      officeCode: '',
      bookNo: '',
      file: '',
      fileObj: null,
      year: Year.getNowYear(),
      progress: ''
    }];
    vm.yearData = Year.getTwoYear();
    vm.addCert = addCert;
    vm.removeCert = removeCert;
    vm.removeFile = removeFile;
    vm.save = save;
    vm.cancel = cancel;
    vm.officeCodeData = obj.officeCodeData;
    vm.uploadCallback = uploadCallback;
    vm.openDialog = openDialog;

    /**
     * 添加新项目
     */
    function addCert() {
      vm.newItems.push({
        officeCode: '',
        bookNo: '',
        file: '',
        fileObj: null,
        year: Year.getNowYear(),
        progress: ''
      });
    }
    /**
     * 删除项目
     */
    function removeCert(index) {
      vm.newItems.splice(index, 1);
    }
    /**
     * 上传回调
     * 
     * @param {any} param 
     */
    function uploadCallback(res, param) {
      param.srcArr = [];
      var file = res;
      if (file && file.ok) {
        angular.forEach(file.data, function (v, k) {
          if (v.suffix && /[pP][dD][fF]/.test(v.suffix)) {
            param.fileObj = {
              id: v.fileId,
              name: v.oldName,
              newName: v.oldName.substring(0, 10) + (v.oldName.length > 10 ? '...' : '')
            };
            param.pdfPath = v.fileHttpPath;
          } else {
            param.srcArr.push(v.fileHttpPath);
          }
          if (!param.fileObj.ids) {
            param.fileObj.ids = [];
          }
          param.fileObj.ids.push(v.fileId);
        });
      } else {
        Notification.error({
          message: '文件上传失败'
        });
      }
    }
    /**
     * 删除文件
     */
    function removeFile(data) {
      restAPI.file.removeFile.save({}, {
          fileId: data.fileObj.id
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            data.fileObj = null;
            data.pdfPath = null;
            data.progress = '';
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
     * 保存按钮
     */
    function save() {
      for (var i = 0; i < vm.newItems.length; i++) {
        if (!vm.newItems[i].bookNo || !vm.newItems[i].fileObj || !vm.newItems[i].officeCode) {
          Notification.error({
            message: '有数据未填写'
          });
          return false;
        }
      }
      doSave(vm.newItems);
    }
    /**
     * 真实保存
     * @param {*} data 
     */
    function doSave(data) {
      var arr = [];
      angular.forEach(data, function (v, k) {
        arr.push({
          officeCode: v.officeCode.officeCode,
          officeName: v.officeCode.shortName,
          ocId: v.officeCode.ocId,
          bookNo: v.bookNo,
          validityYear: v.year.id + '',
          fileIds: v.fileObj && v.fileObj.ids.join(';')
        });
      });
      $rootScope.loading = true;
      restAPI.book.addBookList.save({}, arr)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '添加鉴定证书成功'
            });
            $modalInstance.close();
          } else {
            Notification.error({
              message: resp.msg || ''
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
    /**
     * 显示pdf
     */
    function openDialog(params) {
      var pdfDialog = $modal.open({
        template: require('../../../showPDF/showPDF.html'),
        controller: require('../../../showPDF/showPDF.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              src: params.src,
              srcArr: params.srcArr
            };
          }
        }
      });
    }
  }
];