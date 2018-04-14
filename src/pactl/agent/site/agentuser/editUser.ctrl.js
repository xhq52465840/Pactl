'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI','Page','$rootScope','Notification',
  function ($scope, $modalInstance, items, restAPI,Page,$rootScope,Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.agentData = obj.agentData;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.uploadCallback = uploadCallback;
    vm.userObj = obj.obj;
    vm.userObj.file = {};
    vm.userObj.fileObj = {};
    vm.userGroupData = obj.userGroupData;
    vm.showItem = {
			start: 0,
			end: 0
		};
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();
    vm.isForbidden = obj.isForbidden;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      setExpireDate();
      vm.userObj.userGroup = vm.userObj.userGroups;
      angular.forEach(vm.userObj.userProperties, function (v, k) {
        if (v.propName == 'employid') {
          vm.userObj.employid = v.propValue;
        }
      });
      if (vm.userObj.avatar && vm.userObj.avatar.id) {
        vm.userObj.fileObj = {
          id: vm.userObj.avatar.id,
          url: vm.userObj.avatarurl
        };
      }
      if(vm.userObj.unitRoleDOs && vm.userObj.unitRoleDOs.length) { 
        angular.forEach(vm.userObj.unitRoleDOs, function (m, n) {
          m.roleDos = [];
          if(m.roles) {
            angular.forEach(m.roles, function (x, z) {
              angular.forEach(m.availableRoles, function (l, i) {
                if(x.id === l.id) {
                  m.roleDos.push(l);
                }
              });
            });
          }
        });
        showUnitRoleDOs();
      }
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

    function showUnitRoleDOs() {
        var resp = {
          rows: vm.userObj.unitRoleDOs,
          total: vm.userObj.unitRoleDOs.length
        };
        vm.showItem = {
          start: (vm.page.currentPage - 1) * vm.page.length - 1,
          end: vm.page.currentPage * vm.page.length
        };
        Page.setPage(vm.page, resp);
    }
     /**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, showUnitRoleDOs);
		}
    /**
     * 保存
     */
    function save() {
      var data = vm.userObj;
      $rootScope.loading = true;
      var obj = {};
      if (!data.employid) {
        data.employid = '';
      }
      obj.userProperties = [];
      obj.userProperties.push({
        propValue: data.employid,
        propName: 'employid'
      });
      obj.userProperties = JSON.stringify(obj.userProperties);
      obj.fullname = data.fullname;
      obj.email = data.email;
      obj.expireDate = data.expireDate;
      //obj.deptId = Auth.getMyUnitId();
      if (data.fileObj && data.fileObj.id) {
        /*obj.avatar = JSON.stringify({
          fileName: data.fileObj.id,
          type: 'user'
          })*/
        obj.avatar = data.fileObj.id
      }

      if (data.unitRoleDOs && data.unitRoleDOs.length) {
        obj.unitRoleDOs = [];
        angular.forEach(data.unitRoleDOs, function (v, k) {
          var unitRoleDO = { unit: { id: v.unit.unitId }, roles: [] };
          angular.forEach(v.roleDos, function (m, n) {
            unitRoleDO.roles.push({
              id: m.id
            });
          });
          angular.forEach(v.invisibleRoles, function (m, n) {
            unitRoleDO.roles.push({
              id: m.id
            });
          });
          obj.unitRoleDOs.push(unitRoleDO);
        });
        obj.unitRoleDOs = JSON.stringify(obj.unitRoleDOs);
      }


      obj.ismanager = data.manager;
      obj.isSuper = data.isSuper;
      if (vm.isForbidden) {
        obj.isForbidden = true;
      }

      if (obj.isSupe) {
          obj.ismanager = true;
      }

      restAPI.user.editUser.put({
        id: vm.userObj.id
      }, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp && resp.status === 9999) {
            Notification.error({
              message: resp.msg
            });
          } else {
            Notification.success({
              message: '编辑用户成功'
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
     * 上传图片
     * 
     * @param {any} params 
     */
    function uploadCallback(res, param) {
      var file = res;
      vm.userObj.fileObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }
  }
];