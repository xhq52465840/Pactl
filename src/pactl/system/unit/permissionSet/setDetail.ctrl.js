'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, $modalInstance, items, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.add = add;
    vm.cancel = cancel;
    vm.edit = edit;
    vm.remove = remove;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.detailData = [];
    vm.title = obj.title;

    search();

    /**
     * 查询
     */
    function search() {
      getDetailById();
    }
    /**
     * 根据权限来获取明细
     */
    function getDetailById() {
      $rootScope.loading = true;
      restAPI.permissionset.editPermissionsets.save({
          id: obj.id
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.detailData = resp.data;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 添加权限明细
     */
    function add() {
      var addDialog = $modal.open({
        template: require('./addDetail.html'),
        controller: require('./addDetail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加权限明细',
              obj: {}
            };
          }
        }
      });
      addDialog.result.then(function (data) {
        restAPI.role.editPlan.save({}, data)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              getRoleById();
              Notification.success({
                message: '添加权限明细成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(data) {
      var editDialog = $modal.open({
        template: require('./addDetail.html'),
        controller: require('./addDetail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑：' + data.name,
              obj: {}
            };
          }
        }
      });
      editDialog.result.then(function (data) {
        restAPI.role.editPlan.save({}, data)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              getRoleById();
              Notification.success({
                message: '编辑权限明细成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 删除
     */
    function remove(data) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + data.name,
              content: '你将要删除权限明细' + data.name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.role.editPlan.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '删除权限明细成功'
              });
            }
          });
      }, function () {

      });
    }
  }
];