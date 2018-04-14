'use strict';

var tag_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Expexcel',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Expexcel) {
    var vm = $scope;
    vm.tagObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.addTag = addTag;
    vm.editTag = editTag;
    vm.disableTag = disableTag;
    vm.enableTag = enableTag;
    vm.delTag = delTag;
    vm.exportExl = exportExl;
    vm.batchAdd = batchAdd;

    getTagStatus();
    search();

    /**
     * 获取标签状态
     */
    function getTagStatus() {
      vm.statusData = [{
        id: '',
        name: '全部'
      }, {
        id: '0',
        name: '有效'
      }, {
        id: '1',
        name: '无效'
      }];
    }
    /**
     * 查询按钮
     */
    function search() {
      getTag();
    }
    /**
     * 获取标签数据
     */
    function getTag() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.tag.tagList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp.rows, function (v, k) {
            v.styleObj = {
              'background-color': v.style
            }
          });
          vm.tagData = resp.rows;
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
        name: vm.tagObj.name,
        status: vm.tagObj.status ? vm.tagObj.status.id : '',
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      return obj;
    }
    /**
     * 添加标签
     */
    function addTag() {
      var addTagDialog = $modal.open({
        template: require('./addTag.html'),
        controller: require('./addTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加标签',
              obj: {}
            };
          }
        }
      });
      addTagDialog.result.then(function (data) {
        var obj = {};
        obj.name = data.name;
        obj.style = data.style;
        obj.remark = data.remark;
        restAPI.tag.addTag.save({}, [obj])
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加标签成功'
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
    /**批量新增 */
    function batchAdd() {
      var addTagDialog = $modal.open({
        template: require('./batchAddTags.html'),
        controller: require('./batchAddTags.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '批量添加标签',
              obj: {}
            };
          }
        }
      });
      addTagDialog.result.then(function (data) {
        var tags = data;
        for (var i = 0; i < tags.length; i++) {
          delete tags[i].styleObj;
        }
        restAPI.tag.addTag.save({}, tags)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '批量添加标签成功'
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
     * 编辑标签
     */
    function editTag(params) {
      var editTagDialog = $modal.open({
        template: require('./addTag.html'),
        controller: require('./addTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑标签：' + params.name,
              obj: {
                name: params.name,
                style: params.style,
                remark: params.remark
              }
            };
          }
        }
      });
      editTagDialog.result.then(function (data) {
        data.id = params.id;
        restAPI.tag.addTag.save({}, [data])
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑标签成功'
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
     * 禁用标签
     * 
     * @param {any} params
     */
    function disableTag(params) {
      var obj = {};
      obj.id = params.id;
      obj.name = params.name;
      obj.style = params.style;
      obj.remark = params.remark;
      obj.status = '1';
      restAPI.tag.addTag.save({}, [obj])
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '禁用标签成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 启用标签
     * 
     * @param {any} params
     */
    function enableTag(params) {
      var obj = {};
      obj.id = params.id;
      obj.name = params.name;
      obj.style = params.style;
      obj.remark = params.remark;
      obj.status = '0';
      restAPI.tag.addTag.save({}, [obj])
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '启用标签成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除标签
     */
    function delTag(name, id) {
      var delTagDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除标签' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delTagDialog.result.then(function () {
        restAPI.tag.delTag.save({}, id)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除标签成功'
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
     * 标签导出
     */
    function exportExl() {
      var obj = getCondition();
      Expexcel.exp(obj, restAPI.tag.exportExl);
    }
  }
];

module.exports = angular.module('app.agentAssist.tag', []).controller('tagCtrl', tag_fn);