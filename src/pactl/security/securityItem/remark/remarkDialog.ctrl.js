'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', 'Notification', '$rootScope','$modal',
  function ($scope, $modalInstance, restAPI, items, Notification, $rootScope,$modal) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.edit = edit;
    vm.editItem = editItem;
    vm.remarkData = [];
    vm.remarkObj = {
      awId: items.awId,
      waybillNo: items.waybillNo
    };
    vm.save = save;
    vm.delRemark = delRemark;
    vm.openDialog = openDialog;

    getRemarkList();

    /**
     * 获取备注数据
     */
    function getRemarkList() {
      $rootScope.loading = true;
      restAPI.reCheck.remarkList.save({}, {
          awId: items.awId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.remarkData = resp.data;
        });
    }
    /**
     * 保存
     */
    function save() {
      $rootScope.loading = true;
      restAPI.reCheck.addRemrak.save({}, {
          awId: vm.remarkObj.awId,
          remark: vm.remarkObj.remark
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.remarkObj.remark = '';
          getRemarkList();
        });
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss(vm.remarkData.length+"");
    }
    /**
     * 编辑
     */
    function edit(param) {
      param.editShow = true;
    }
    /**
     * 删除
     */
    function delRemark(item) {
      var cleDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除备注',
              content: '你将要删除备注:' + item.pCheckRemark.remark 
            };
          }
        }
      });
      cleDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.reCheck.delRemark.remove({
            id: item.pCheckRemark.id
          },{})
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '删除成功'
              });
              getRemarkList();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 编辑内容
     */
    function editItem(param) {
      restAPI.reCheck.updateRemrak.save({}, {
          id: param.pCheckRemark.id,
          awId: items.awId,
          remark: param.pCheckRemark.remark
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            Notification.success({
              message: '编辑成功'
            });
            param.editShow = false;
          } else {
            Notification.error({
              message: resp.msg || '编辑失败'
            });
          }
        });
    }

    /**
     * 
     */
    function openDialog(params) {
      var pdfDialog = $modal.open({
        template: require('../../../showPDF/showPDF.html'),
        controller: require('../../../showPDF/showPDF.ctrl.js'),
        size: 'lg',
        windowClass: 'windowClassLX',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return params;
          }
        }
      });
    }


  }
];