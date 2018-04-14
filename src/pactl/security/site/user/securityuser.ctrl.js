'use strict';

var jsSHA = require('../../../../lib/sha1/sha1.js');

var securityuser_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope','Auth','$state',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope,Auth,$state) {
    var vm = $scope;
    vm.securityOrgData = [];
    vm.add = add;
    vm.disabled = disabled;
    vm.enabled = enabled;
    vm.edit = edit;
    vm.modify = modify;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.securityObj = {};
    vm.securityUnitData = [];
    vm.remove = remove;
    vm.search = search;
    vm.reset = reset;
    vm.securityData = [];
    vm.addRole = addRole;
    vm.isCanEditRole = isCanEditRole;
    vm.ismanager = false;

    initCondition();
    search();
    getIsManager();

    /**
     * 初始化查询条件
     */
    function initCondition() {

      getDeptId();
    }

    function getIsManager() {
      var user = Auth.getUser();
      restAPI.saleAgent.queryUserIsManager.get({
          deptId: user.myunit,
          userid: user.userid
        }, {})
        .$promise.then(function (resp) {
          if (resp.result == "1") {
            vm.ismanager = true;
          } else {
            vm.ismanager = false;
            $state.go('index');
          }
          if(resp.isSuper == "1") {
            vm.isSuper = true;
          } else {
            vm.isSuper = false;
          }
        });
    }

    /**
     * 获取所属机构
     */
    function getDeptId() {
      var obj = {};
      obj.type = 'security';
      restAPI.securityuser.secunits.save({}, obj)
        .$promise.then(function (resp) {
          vm.securityOrgData = resp.data;
        });
      getUnitData();
    }

    function getUnitData() {
      restAPI.securityuser.seccheckunits.save({}, {})
        .$promise.then(function (resp) {
          vm.securityUnitData = resp.data;
        });
    }
    /**
     * 查询
     */
    function search() {
      getSecurityUserData();
    }
    /**
     * 获取用户数据
     */
    function getSecurityUserData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.securityuser.pageSecUsers.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.securityData = resp.data;
          Page.setPage(vm.page, resp);
        });
    }

    function modify(param) {
      var addsecurityDialog = $modal.open({
        template: require('./changepassword.html'),
        controller: require('./changepassword.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '修改密码',
              obj: param
            };
          }
        }
      });
      addsecurityDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        var hashObj = new jsSHA('SHA-1', 'TEXT');
        hashObj.update(data.password);
        obj.account = data.account;
        obj.repeatPassword = hashObj.getHash('HEX');

        restAPI.user.updatePassword.save({
          id: param.id
        }, obj).$promise.then(function (resp) {
           $rootScope.loading = false;
           if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '修改密码成功'
              });
            }
        });
      }, function (resp) {

      });
    }

    function isCanEditRole(item) {
      return item.id!==Auth.getId();
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        unitType: 'security',
        deptId: Auth.getMyUnitId()
      };
      obj.order = ' t.lastUpdate desc';
      //obj.deptId = vm.securityObj.deptId && vm.securityObj.deptId.id;
      obj.account = vm.securityObj.account;
      obj.fullname = vm.securityObj.fullname;
      obj.unitcode = vm.securityObj.unitcode;
      if(vm.securityObj.unit && vm.securityObj.unit.id) {
        obj.unit = vm.securityObj.unit.id;
      }
      //obj.unit = Auth.getMyUnitId();
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新增
     */
    function add() {
      var addsecurityDialog = $modal.open({
        template: require('./addsecurityuser.html'),
        controller: require('./addsecurityuser.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '创建安检新用户',
              obj: {
                securityOrgData: vm.securityOrgData,
                securityUnitData: vm.securityUnitData
              }
            };
          }
        }
      });
      addsecurityDialog.result.then(function (data) {
        search();
      }, function (resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(param) {
      var securityunit = {};
      angular.forEach(vm.securityUnitData, function (v, k) {
        if (v.id == param.unit) {
          securityunit = v;
        }
      });
      var editUnitDialog = $modal.open({
        template: require('./editsecurityuser.html'),
        controller: require('./editsecurityuser.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑安检用户信息',
              obj: param,
              securityOrgData: vm.securityOrgData,
              securityUnitData: vm.securityUnitData,
              securityunit: securityunit

            };
          }
        }
      });
      editUnitDialog.result.then(function (data) {
        search();
      }, function (resp) {

      });
    }
    /**
     * 禁用安检用户
     *
     */
    function disabled(param) {
      var disableDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '停用安检用户：' + param.fullname,
              content: '你将要停用安检用户' + param.fullname + '。'
            };
          }
        }
      });
      disableDialog.result.then(function () {
        var obj = {};
        restAPI.user.ableUser.put({
            id: param.id,
            type: 'disable'
          }, {})
          .$promise.then(function (resp) {
             $rootScope.loading = false;
             if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '停用安检用户成功'
              });
            }
          });
      }, function () {

      });
    }

    /**
     * 启用安检用户
     *
     */
    function enabled(param) {
      var enableDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '启用安检用户：' + param.fullname,
              content: '你将要启用安检用户' + param.fullname + '。'
            };
          }
        }
      });
      enableDialog.result.then(function () {
        restAPI.user.ableUser.put({
            id: param.id,
            type: 'enable'
          }, {})
          .$promise.then(function (resp) {
             $rootScope.loading = false;
             if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '启用安检用户成功'
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 删除
     * 
     */
    function remove(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除安检用户：' + param.fullname,
              content: '你将要删除安检用户' + param.fullname + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.user.delUser.remove({
            id: param.id
          }, {})
          .$promise.then(function (resp) {
             $rootScope.loading = false;
            if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '删除按键用户成功'
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 重置
     */
    function reset() {
      vm.securityObj = {};
      search();
    }

    function addRole(param) {
      var addUserRoleDialog = $modal.open({
        template: require('../../../agent/site/agentuser/addUserRole.html'),
        controller: require('../../../agent/site/agentuser/addUserRole.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '用户添加角色',
              obj: param
            };
          }
        }
      });
      addUserRoleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.id = param.id;
        obj.authObjType = 'USER';
        obj.unitid = param.unitDO.id;
        var roleids = '';
        angular.forEach(data.role, function (v, k) {
          roleids += v.id + ",";
        });
        obj.roleids = roleids.substr(0, roleids.length - 1);
        restAPI.user.addUserRole.save({},
          obj).$promise.then(function (resp) {
             $rootScope.loading = false;
            if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '用户添加角色成功'
              });
            }
        });
      }, function (resp) {

      });
    }
  }
];

module.exports = angular.module('app.securitySite.securityuser', []).controller('securityuserCtrl', securityuser_fn);