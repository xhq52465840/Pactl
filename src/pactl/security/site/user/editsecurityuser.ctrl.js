'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope','Auth','Notification',
  function ($scope, $modalInstance, items, restAPI, $rootScope,Auth,Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.securityOrgData = obj.securityOrgData;
    vm.securityUnitData = obj.securityUnitData;
    vm.userObj = obj.obj;
    vm.title = obj.title;
    vm.upload = upload;
    vm.upload_UNIT = upload_UNIT;
    vm.userObj.file = {};
    vm.userObj.fileObj = {};
    vm.userObj.unitfile = {};
    vm.userObj.fileUnitObj = {};
    vm.securityunit = obj.securityunit;

    setData();
    /**
     * 显示数据
     */
    function setData() {
      setExpireDate();
      vm.userObj.dept = Auth.getMyUnitId();
      vm.userObj.unit = vm.securityunit;
      vm.userObj.fileObj = {
        id: vm.userObj.avatar,
        url: vm.userObj.avatarurl
      };
      vm.userObj.fileUnitObj = {
        id: vm.userObj.securityAva,
        url: vm.userObj.unitUrl
      };
    }

    function setExpireDate() {
      if(vm.userObj.expireDate && vm.userObj.expireDate!=='') {
        var expireDate = new Date(vm.userObj.expireDate);
        var year = expireDate.getFullYear();
        var month = expireDate.getMonth()+1;
        month = month>9?month:"0"+month;
        var day = expireDate.getDate();
        day = day>9?day:"0"+day;
        var strExpireDate = year+"-"+month+"-"+day;
        vm.userObj.expireDate = strExpireDate;
      }
    }
    /**
     * 保存
     */
    function save() {
       var data = angular.copy(vm.userObj);
       $rootScope.loading = true;
        var obj = {};
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
          if (data.fileUnitObj.id.id) {
            obj.userProperties.push({
              propValue: data.fileUnitObj.id.id,
              propName: 'unitimg'
            });
          } else {
            obj.userProperties.push({
              propValue: data.fileUnitObj.id,
              propName: 'unitimg'
            });
          }
        }
        obj.userProperties = JSON.stringify(obj.userProperties);
        obj.fullname = data.fullname;
        obj.email = data.email;
        obj.expireDate = data.expireDate;
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
        }
        obj.deptId = data.dept;
        if (data.fileObj && data.fileObj.id) {
          if (data.fileObj.id.id) {
            obj.avatar = JSON.stringify(data.fileObj.id.id);
          } else {
            obj.avatar = data.fileObj.id;
          }
        }
        obj.securityUser = true;

        restAPI.user.editUser.put({
            id: data.id
          }, obj)
          .$promise.then(function (resp) {
             $rootScope.loading = false;
             if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              Notification.success({
                message: '编辑安检用户信息成功'
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

    function upload_UNIT(param) {
      var file = param.unitfile;
      vm.userObj.fileUnitObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }
  }
];