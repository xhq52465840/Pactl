'use strict';

var waybillTemp_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state', 'Auth',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $state, Auth) {
    var vm = $scope;
    vm.editMaster = editMaster;
    vm.editSub = editSub;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.typeData = [{
      id: '0',
      name: '主单'
    }, {
      id: '1',
      name: '分单'
    }];
    vm.waybillObj = {};
    vm.waybillData = [];
    vm.showRemark = showRemark;

    search();

    /**
     * 查询
     */
    function search() {
      getWaybillData();
    }
    /**
     * 获取运单模板数据
     */
    function getWaybillData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.bill.billTempList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.waybillData = resp.rows || [];
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.waybillObj.labelName) {
        obj.labelName = vm.waybillObj.labelName;
      }
      if (vm.waybillObj.dept) {
        obj.dept = vm.waybillObj.dept;
      }
      if (vm.waybillObj.dest) {
        obj.dest = vm.waybillObj.dest;
      }
      if (vm.waybillObj.type) {
        obj.type = vm.waybillObj.type.id;
      }
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 编辑分单
     */
    function editMaster(id) {
      $state.go('agentOption.ediyWaybillMasterTemp', {
        id: id
      });
    }
    /**
     * 编辑
     */
    function editSub(id) {
      $state.go('agentOption.ediyWaybillSubTemp', {
        id: id
      });
    }
    /**
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除运单模板' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.bill.delBillTemp.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除运单模板成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }

     /**
     * 备注
     *
     * @param {any} param
     */
    function showRemark(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: param.labelName,
              content: param.mRemark,
              isInfo: true
            };
          }
        }
      });
      delDialog.result.then(function () {
      }, function () {
      });
    }
    
    
  }
];

module.exports = angular.module('app.agentOption.waybillTemp', []).controller('waybillTempCtrl', waybillTemp_fn);