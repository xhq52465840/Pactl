'use strict';

var nameAdvice_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.batchAdd = batchAdd;
    vm.nameAdviceObj = {};
    vm.nameAdviceData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.changeText7 = changeText7;


    search();

    /**
     * 查询
     */
    function search() {
      getNameAdviceData();
    }
    /**
     * 获取品名数据
     */
    function getNameAdviceData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.nameAdviceManege.nameAdviceList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.nameAdviceData = resp.rows || [];
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
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        goodsName: vm.nameAdviceObj.goodsName ? vm.nameAdviceObj.goodsName : '',
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      return obj;
    }

    /**批量新增 */
    function batchAdd() {
      var addTagDialog = $modal.open({
        template: require('./batchAddNameAdvice.html'),
        controller: require('./batchAddNameAdvice.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '批量添加品名',
              obj: {}
            };
          }
        }
      });
      addTagDialog.result.then(function (data) {
        var arr = [];
        var goodsNames = data.goodsName.split("\n");
        for (var i = 0; i < goodsNames.length; i++) {
          var obj = {};
          obj.goodsName = goodsNames[i];
          obj.remark = data.remark;
          obj.agentCode = Auth.getMyUnitId();
          arr.push(obj);
        }
        restAPI.nameAdviceManege.batchNameAdvice.save({}, arr)
          .$promise.then(function (resp) {
            vm.search();
            Notification.success({
              message: '添加品名成功'
            });
          });
      }, function (resp) {

      });
    }
    /**
     * 新建
     */
    function add() {
      var addTagDialog = $modal.open({
        template: require('./addNameAdvice.html'),
        controller: require('./addNameAdvice.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加品名',
              obj: {}
            };
          }
        }
      });
      addTagDialog.result.then(function (data) {
        var obj = {};
        obj.goodsName = data.goodsName;
        obj.remark = data.remark;
        obj.agentCode = Auth.getMyUnitId();
        restAPI.nameAdviceManege.addNameAdvice.save({}, obj)
          .$promise.then(function (resp) {
            vm.search();
            Notification.success({
              message: '添加品名成功'
            });
          });
      }, function (resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(item) {
      var editNameDialog = $modal.open({
        template: require('./editAddress.html'),
        controller: require('./editAddress.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑品名',
              obj: item
            };
          }
        }
      });
      editNameDialog.result.then(function (data) {
        $rootScope.loading = true;
        data.id = item.id;
        restAPI.nameAdviceManege.addNameAdvice.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑品名成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 删除
     */
    function remove(item) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + item.goodsName,
              content: '你将要删除品名' + item.goodsName + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.nameAdviceManege.delNameAdvice.save({}, {
            id: item.id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除品名成功'
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
     * 只能输入大写和特殊字符
     */
    function changeText7(text) {
      try {
        vm.nameAdviceObj[text] = vm.nameAdviceObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }

  }
];

module.exports = angular.module('app.agentOption.nameAdvice', []).controller('nameAdviceCtrl', nameAdvice_fn);