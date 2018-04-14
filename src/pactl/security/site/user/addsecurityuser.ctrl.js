'use strict';

var jsSHA = require('../../../../lib/sha1/sha1.js');

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Auth','Notification',
  function ($scope, $modalInstance, items, restAPI, $rootScope, Auth,Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.userObj = obj.obj;
    vm.roleData = [];
    vm.securityOrgData = obj.obj.securityOrgData;
    vm.securityUnitData = obj.obj.securityUnitData;
    vm.title = obj.title;
    vm.upload = upload;
    vm.upload_UNIT = upload_UNIT;
    vm.userObj.file = {};
    vm.userObj.fileObj = {};
    vm.userObj.unitfile = {};
    vm.userObj.fileUnitObj = {};
    vm.checkAccount = checkAccount;
    vm.checkaccount = true;
    vm.unit = {};
    vm.getUnit = getUnit;
    initUnit();

    function getUnit(param){
        vm.unit = param;
        restAPI.role.opagentRoles.query({
          id: vm.userObj.dept
        }, {}).$promise.then(function (resp) {
            vm.roleData = resp;
        });
    }
    function initUnit() {
      restAPI.agentuserManage.queryunits.save({
          id : Auth.getMyUnitId()
      }, {})
          .$promise.then(function (resp) {
          vm.userObj.dept = Auth.getMyUnitId();
          vm.unit = resp.unit;
          getUnit(resp.unit);
      });
    }
    /**
     * 保存
     */
    function save() {
      var data = angular.copy(vm.userObj);
      data.account = vm.unit.code+vm.userObj.account;
      $rootScope.loading = true;
      var hashObj = new jsSHA('SHA-1', 'TEXT');
      var obj = {};
      hashObj.update(data.password);
      obj.account = data.account;
      obj.repeatPassword = hashObj.getHash('HEX');
      obj.userProperties = [];
      if (data.unitcode) {
        obj.userProperties.push({
          propValue: data.unitcode,
          propName: 'unitcode'
        });
      }
      if (data.unit) {
        obj.userProperties.push({
          propValue: data.unit.id,
          propName: 'unit'
        });
      }
      if (data.fileUnitObj && data.fileUnitObj.id) {
        obj.userProperties.push({
          propValue: data.fileUnitObj.id,
          propName: 'unitimg'
        });
      }
      obj.fullname = data.fullname;
      obj.email = data.email;
      obj.deptId = data.dept;
      if(data.expireDate) {
       var dateReg1 = /^(\d{4})-(\d{2})-(\d{2})$/
          var dateReg2 = /^\d{8}$/
          if(!dateReg1.test(data.expireDate) && !dateReg2.test(data.expireDate)) { 
            Notification.error({
                message: '账户过期日期格式不正确'
            });
            $rootScope.loading = false;
            return;
          } 
        obj.expireDate =  Date.parse(data.expireDate);
      }
      if (data.fileObj && data.fileObj.id) {
        obj.avatar = {
          id: data.fileObj.id,
          type: 'user'
        }
      }
      obj.roles = [];
      angular.forEach(data.roles, function (v, k) {
        obj.roles.push({
          id: v.id
        });
      });
      //obj.securityUser = true;
      restAPI.user.users.save({}, obj)
        .$promise.then(function (resp) {
            $rootScope.loading = false;
            if(resp && resp.status===9999) {
            Notification.error({
              message: resp.msg
            });
          } else {
            Notification.success({
              message: '创建安检新用户成功'
            });
            $modalInstance.close(vm.userObj);
          }
        });

    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 上传
     */
    function upload(res,param) {
      var file = res;
      vm.userObj.fileObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }

    function upload_UNIT(res,param) {
      var file = res;
      vm.userObj.fileUnitObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }

    /**
     * 校验用户名
     */
    function  checkAccount() {
      var resp = restAPI.user.checkaccount.get({
        account: vm.userObj.account
      }, {}).$promise.then(function (data) {
        if(data.result){
          vm.checkaccount = false;
        }else{
          vm.checkaccount = true;
        }
      });
    }
  }
];