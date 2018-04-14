'use strict';

var jsSHA = require('../../../../lib/sha1/sha1.js');

var agentuser_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams', 'Auth',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $stateParams, Auth) {
    var vm = $scope;
    vm.add = add;
    vm.addAdmin = addAdmin;
    vm.unitData = [];
    vm.disable = disable;
    vm.enable = enable;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.reset = reset;
    vm.search = search;
    vm.userObj = {};
    vm.userData = [];
    vm.userStatusData = [];
    vm.unit = {};
    vm.unitId = '';
    vm.userid = '';
    vm.addRole = addRole;
    vm.operunitid = '';
    vm.modify = modify;
    vm.ismanager = false;
    vm.isSuper = false;


    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getUnitData();
    }
    /**
     * 查询
     */
    function search() {
      getUserData();
      getIsManager();
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
          }
          if(resp.isSuper == "1") {
            vm.isSuper = true;
          } else {
            vm.isSuper = false;
          }
        });
    }

    /**
     * 新增管理员
     */
    function addAdmin() {
      var addAdminUserDialog = $modal.open({
        template: require('./addAdmin.html'),
        controller: require('./addAdmin.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增管理员',
              obj: {}
            };
          }
        }
      });
      addAdminUserDialog.result.then(function (data) {
        var unit = Auth.getUnitId();
        $rootScope.loading = true;
        var hashObj = new jsSHA('SHA-1', 'TEXT');
        var obj = {};
        hashObj.update(data.password);
        obj.account = data.account;
        obj.repeatPassword = hashObj.getHash('HEX');
        obj.fullname = data.fullname;
        obj.email = data.email;
        obj.deptId = data.dept && data.dept.id;
        obj.roles = [];
        obj.manager = '1';
        obj.agentunit = unit;
        obj.isSuper = data.isSuper;
        obj.expireDate = data.expireDate;
        angular.forEach(data.roles, function (v, k) {
          obj.roles.push({
            id: v.id
          });
        });
        restAPI.agentuserManage.addManager.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if(resp && resp.status===9999) {
                Notification.error({
                  message: resp.msg
                });
              } else {
                search();
                Notification.success({
                  message: '添加管理员成功'
                });
              }
          });
      }, function (resp) {

      });
    }
    /**
     * 获取用户数据
     */
    function getUserData() {
      vm.userid = Auth.getId();
      $rootScope.loading = true;
      var obj = getCondition();

      var unit = Auth.getUnitId();
      if (Auth.getMyUnitId() != unit) {
        unit = Auth.getMyUnitId();
      }
      restAPI.agentuserManage.queryAgentUsers.save({
          id: unit,
          unitid: Auth.getUnitId()
        }, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
            if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              vm.userData = resp.data || [];

              Page.setPage(vm.page, resp);
            }
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var user = Auth.getUser();
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        rule: []
      }
      if (user.unitType == 'salesAgent') {
        obj.rule.push([{
          key: 'deptId',
          op: '=',
          value: user.myunit
        }]);
      }
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      angular.forEach(vm.userObj, function (v, k) {
        obj.rule.push([{
          key: k,
          op: (k === 'status' || k === 'deptId') ? '=' : 'like',
          value: v.id || v
        }]);
      });
      return obj;
    }
    /**
     * 重置
     */
    function reset() {
      vm.userObj = {};
      search();
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
      var addUserDialog = $modal.open({
        template: require('./addUser.html'),
        controller: require('./addUser.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增用户',
              obj: {},
            };
          }
        }
      });
      addUserDialog.result.then(function (data) {
        $rootScope.loading = true;
        var hashObj = new jsSHA('SHA-1', 'TEXT');
        var obj = {};
        hashObj.update(data.password);
        obj.account = data.account;
        obj.repeatPassword = hashObj.getHash('HEX');
        if (data.employid) {
          obj.userProperties = [];
          obj.userProperties.push({
            propValue: data.employid,
            propName: 'employid'
          });
        }
        obj.fullname = data.fullname;
        obj.email = data.email;
        obj.expireDate = data.expireDate;
        obj.deptId = Auth.getMyUnitId();
        if (data.fileObj && data.fileObj.id) {
          obj.avatar = {
            id: data.fileObj.id,
            type: 'user'
          }
        }
        // obj.roles = [];
        // angular.forEach(data.roles, function (v, k) {
        //   obj.roles.push({
        //     id: v.id
        //   });
        // });
        var userObj = {agentUser:obj};
        userObj.unitRolesDTOs = [];
        angular.forEach(data.unitRoleDOs, function (v, k) {
          var unitRoleDO = {unit:{id:v.unit.id},roles:[]};
          angular.forEach(v.roleDos, function (m, n) {
            unitRoleDO.roles.push({
              id: m.id
            });
          });
          userObj.unitRolesDTOs.push(unitRoleDO);
        });
        restAPI.user.addAgentUsers.save({}, userObj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if(resp && resp.status===9999) {
                Notification.error({
                  message: resp.msg
                });
              } else {
                search();
                Notification.success({
                  message: '添加用户成功'
                });
              }
          });
      }, function (resp) {

      });
    }
    /**
     * 修改密码
     */
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
    /**
     * 编辑
     */
    function edit(param,isForbidden) {
      var editUserDialog = $modal.open({
        template: require('./editUser.html'),
        controller: require('./editUser.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑用户：' + param.fullname,
              obj: param,
              isForbidden: isForbidden
            };
          }
        }
      });
      editUserDialog.result.then(function (data) {
       search();
      }, function (resp) {

      });
    }
    /**
     * 获取机构
     */
    function getUnitData() {
      vm.unitId = Auth.getMyUnitId();
      vm.operunitid = Auth.getUnitId();
      getUserStatusData();
      restAPI.agentuserManage.queryunits.save({
          id: Auth.getMyUnitId()
        }, {})
        .$promise.then(function (resp) {
          vm.unitData = resp.data;
          vm.unit = resp.unit;
          search();
        });
    }

    /**
     * 获取用户状态
     */
    function getUserStatusData() {
      vm.userStatusData = [{
        name: '正常',
        id: '正常'
      }, {
        name: '禁用',
        id: '禁用'
      }];
    }
    /**
     * 无效
     */
    function disable(params) {
      restAPI.user.ableUser.put({
          id: params.id,
          type: 'disable'
        }, {})
        .$promise.then(function (resp) {
          delete params.status;
          Notification.success({
            message: '操作成功'
          });
        });
    }
    /**
     * 有效
     */
    function enable(params) {
      restAPI.user.ableUser.put({
          id: params.id,
          type: 'enable'
        }, {})
        .$promise.then(function (resp) {
          params.status = '正常';
          Notification.success({
            message: '操作成功'
          });
        });
    }
    /**
     * 删除
     *
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
              content: '你将要删除用户' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.user.delUser.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            search();
            Notification.success({
              message: '删除用户成功'
            });
          });
      }, function () {

      });
    }

    /**
     * 用户添加角色
     * @param param
     */
    function addRole(param) {
      var addUserRoleDialog = $modal.open({
        template: require('./addUserRole.html'),
        controller: require('./addUserRole.ctrl.js'),
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
        obj.unitid = Auth.getUnitId(); //param.unitDO.id;
        var roleids = '';
        angular.forEach(data.role, function (v, k) {
          roleids += v.id + ",";
        });
        obj.roleids = roleids.substr(0, roleids.length - 1);
        restAPI.user.addUserRole.save({},
          obj).$promise.then(function (resp) {
          search();
          Notification.success({
            message: '用户添加角色成功'
          });
        });
      }, function (resp) {

      });
    }
  }
];

module.exports = angular.module('app.agentSite.agentuser', []).controller('agentuserCtrl', agentuser_fn);