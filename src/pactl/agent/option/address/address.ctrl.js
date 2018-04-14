'use strict';

var address_fn = ['$scope', '$rootScope', 'restAPI', 'Page', '$modal', 'Notification','Auth',
  function ($scope, $rootScope, restAPI, Page, $modal, Notification,Auth) {
    var vm = $scope;
    vm.address = {};
    vm.add = add;
    vm.allowable = false;
    vm.edit = edit;
    vm.isEWaybill = isEWaybill;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.save = save;
    vm.search = search;
    vm.sameAgent = sameAgent;

    function save(allowable) {
      restAPI.address.editEwayAddress.save({}, {
        allow: allowable ? '1' : '0',
        sendAddr: vm.sendAddr,
        id: vm.id ? vm.id : ''
      }).$promise.then(function (resp) {
        if (resp.ok) {
          Notification.success({
            message: '操作成功'
          });
          searchEwaybill();
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 邮箱状态,0为正常1为删除2为停用
     */
    vm.addressStatus = [{
      id: '0',
      name: '正常'
    }, {
      id: '1',
      name: '删除'
    }, {
      id: '2',
      name: '停用'
    }];
    /**
     * 邮箱地址类型
     */
    vm.addressData = [{
      id: '0',
      name: 'SITA地址'
    }, {
      id: '1',
      name: '邮箱地址'
    }];

    /**
     * 报文类型
     */
    vm.messageData = [{
      id: '1',
      name: 'fwb'
    }, {
      id: '0',
      name: 'fhl'
    }];

    search();
    searchEwaybill();
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.address.addressList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.rows = resp.rows;
          vm.total = resp.total;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        addrType: vm.address.addrType ? vm.address.addrType.id : '',
        addrExplain: vm.address.addrExplain ? vm.address.addrExplain : '',
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 查询是否电子运单更新报文信息
     */
    function searchEwaybill() {
      restAPI.address.queryAddress.save({}, {})
        .$promise.then(function (resp) {
          if (resp.ok) {
            if (resp.data.agentInfo) {
              vm.id = resp.data.agentInfo.id;
              vm.sendAddr = resp.data.agentInfo.sendAddr;
              vm.allowable = resp.data.agentInfo.allow === "1" ? true : false;
            }
            vm.recAddr = resp.data.recAddr;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 新增报文地址允许电子运单更新报文信息
     */
    function isEWaybill($e) {
      restAPI.address.editEwayAddress.save({}, {
        allow: $e.target.checked ? '1' : '0',
        id: vm.id ? vm.id : ''
      }).$promise.then(function (resp) {
        if (resp.ok) {
          Notification.success({
            message: $e.target.checked ? '操作成功' : '取消成功'
          });
          vm.allowable = false;
          searchEwaybill();
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }

    function sameAgent() {
      if (Auth.getUnitId() === Auth.getMyUnitId()) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * 新增
     */
    function add() {
      var addAddrDialog = $modal.open({
        template: require('./addAddress.html'),
        controller: require('./addAddress.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加报文地址授权',
              obj: {}
            };
          }
        }
      });
      addAddrDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.addrType = data.addrType;
        obj.messageAddr = data.messageAddr;
        obj.addrExplain = data.addrExplain;
        obj.messageType = data.messageType ? data.messageType : '';
        restAPI.address.editAddress.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加报文地址授权成功'
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
     * 编辑
     */
    function edit(item) {
      var editAddrDialog = $modal.open({
        template: require('./editAddress.html'),
        controller: require('./editAddress.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑报文地址授权',
              obj: {
                addrType: item.addrType,
                messageType: item.messageType,
                messageAddr: item.messageAddr,
                addrExplain: item.addrExplain,
                creater: item.creater,
                updateTime: item.updateTime,
                updater: item.updater
              }
            };
          }
        }
      });
      editAddrDialog.result.then(function (data) {
        $rootScope.loading = true;
        data.id = item.id;
        restAPI.address.editAddress.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑报文地址授权成功'
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
     * 报文地址启用、停用、删除,0为正常1为删除2为停用
     */
    function remove(id, name, type) {
      var title = '',
        content = '',
        msg = '';
      switch (type) {
        case '0':
          title = '启用：' + name;
          content = '你将要启用报文地址授权：' + name + '。';
          msg = '启用报文授权地址成功';
          break;
        case '1':
          title = '删除：' + name;
          content = '你将要删除报文地址授权：' + name + '。此操作不能恢复。';
          msg = '删除报文授权地址成功';
          break;
        case '2':
          title = '停用：' + name;
          content = '你将要停用报文地址授权：' + name + '。';
          msg = '停用报文授权地址成功';
          break;
      }
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: title,
              content: content
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.address.delAddress.save({}, {
            id: id,
            delStatus: type
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: msg
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    };
  }
];

module.exports = angular.module('app.agentOption.address', []).controller('addressCtrl', address_fn);