'use strict';

var permissionSetDetail_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams',
  function ($scope, restAPI, $modal, Notification, $rootScope, $stateParams) {
    var vm = $scope;
    var setObj = {
      id: '',
      name: ''
    }
    vm.add = add;
    vm.edit = edit;
    vm.remove = remove;
    vm.detailData = [];
    vm.title = $stateParams.title;
    vm.permissionsetObj = {};
    vm.setid = $stateParams.id;
    vm.resourceData = [];

    getResource();

    function getResource() {
      $rootScope.loading = true;
      restAPI.resmanage.queryAll.get({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp.ok) {
            vm.resourceData = resp.data || [];
          } else {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } 
          }
          check();
        });
    }

    /**
     * 检测id
     */
    function check() {
      setObj.id = $stateParams.id;
      setObj.name = $stateParams.name;
      vm.title = $stateParams.name;
      if (setObj.id && setObj.name) {
        search();
      } else {
        $state.go('unit.permissionSetDetail');
      }
    }

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
      restAPI.permissionset.editPermissionsets.get({
          id: setObj.id
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.detailData = resp.psetItems || [];
          vm.permissionsetObj = resp;
        });
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
              resourceData: vm.resourceData,
              obj: {}
            };
          }
        }
      });
      addDialog.result.then(function (data) {
        $rootScope.loading = true;
        data.resourceType = data.rType.id;
        restAPI.permissionset.addPermissionsetItems.save({
            id: vm.setid
          }, data)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
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
    function edit(param) {
      var editDialog = $modal.open({
        template: require('./addDetail.html'),
        controller: require('./addDetail.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑权限明细：' + param.resourceId,
              resourceData: vm.resourceData,
              obj: param
            };
          }
        }
      });
      editDialog.result.then(function (data) {
        $rootScope.loading = true;
        data.resourceType = data.rType.id;
        restAPI.permissionset.editPermissionsetItem.put({
            id: param.id
          }, data)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
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
              title: '删除：' + data.resourceId,
              content: '你将要删除权限明细:' + data.resourceId + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.permissionset.editPermissionsetItem.remove({
            id: data.id
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

module.exports = angular.module('app.unit.permissionSetDetail', []).controller('permissionSetDetailCtrl', permissionSetDetail_fn);