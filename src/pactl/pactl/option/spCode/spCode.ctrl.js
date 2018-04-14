'use strict';

var spCode_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.checkData = [];
    vm.codeObj = {};
    vm.codeData = [];
    vm.ableSatatus = ableSatatus;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.remove = remove;

    getCheckData();

    /**
     * 获取检查类型
     */
    function getCheckData() {
      $rootScope.loading = true;
      restAPI.specialcargo.checklist.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.checkData = resp.rows || [];
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getcodeData();
    }
    /**
     * 获取特货代码数据
     */
    function getcodeData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.specialcargo.specialcargoList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.codeData = resp.rows || [];
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
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      obj.sccCode = vm.codeObj.sccCode;
      obj.sccDesc = vm.codeObj.sccDesc;
      obj.dangerousMark = vm.codeObj.dangerousMark ? '1' : '0';
      obj.liMark = vm.codeObj.liMark ? '1' : '0';
      return obj;
    }
    /**
     * 新增
     */
    function add() {
      var addCodeDialog = $modal.open({
        template: require('./addCode.html'),
        controller: require('./addCode.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增特货代码',
              checkData: vm.checkData,
              obj: {}
            };
          }
        }
      });
      addCodeDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = getAddData(data);
        restAPI.specialcargo.addSpecialcargo.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增特货代码成功'
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
     * 获取新增的数据
     */
    function getAddData(param) {
      var obj = {};
      obj.sccCode = param.sccCode;
      obj.dangerousMark = param.dangerousMark ? '1' : '0';
      obj.liMark = param.liMark ? '1' : '0';
      obj.localeCheckType = [];
      if (param.localeCheckType) {
        angular.forEach(param.localeCheckType, function (v, k) {
          obj.localeCheckType.push(v.checkName);
        });
      }
      obj.localeCheckType = obj.localeCheckType.join(';');
      obj.sccDesc = param.sccDesc;
      return obj;
    }
    /**
     * 编辑
     */
    function edit(param) {
      var editData = getEditData(param);
      var editRuleDialog = $modal.open({
        template: require('./addCode.html'),
        controller: require('./addCode.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑特货代码',
              airData: vm.airData,
              checkData: vm.checkData,
              obj: editData
            };
          }
        }
      });
      editRuleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = getAddData(data);
        obj.sccId = param.sccId;
        restAPI.specialcargo.addSpecialcargo.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑特货代码成功'
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
     * 获取编辑数据
     */
    function getEditData(param) {
      var obj = {};
      obj.sccCode = param.sccCode;
      obj.dangerousMark = param.dangerousMark === '1' ? true : false;
      obj.liMark = param.liMark === '1' ? true : false;
      obj.sccDesc = param.sccDesc;
      obj.localeCheckType = param.localeCheckType;
      return obj;
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
              content: '你将要删除特货代码：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.specialcargo.delSpecialcargo.save({}, {
            sccId: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除特货代码成功'
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
     * 启用/禁用
     * 
     */
    function ableSatatus(id, status) {
      restAPI.specialcargo.ableSpecialcargo.save({}, {
          sccId: id,
          useful: status
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '操作成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

  }
];

module.exports = angular.module('app.pactlOption.spCode', []).controller('spCodeCtrl', spCode_fn);