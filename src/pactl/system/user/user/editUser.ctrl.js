'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI',
  function ($scope, $modalInstance, items, restAPI) {
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
    vm.roleData = [];

    getUnitRole();
    function getUnitRole(){
      restAPI.role.allOpagentRoles.query({
        id: vm.userObj.dept.id
      }, {}).$promise.then(function (resp) {
            vm.roleData = resp;
            setData();
      });
    }

    /**
     * 显示数据
     */
    function setData() {
      setExpireDate();
      vm.userObj.userGroup = vm.userObj.userGroups;
      vm.userObj.roles = [];
      if (vm.userObj.roleDOs && vm.userObj.roleDOs.length) {
        angular.forEach(vm.userObj.roleDOs, function (v, k) {
          angular.forEach(vm.roleData, function (m, n) {
            if(v.id === m.id) {
              vm.userObj.roles.push(m);
            }
          });
        });
      }

      vm.userObj.fileObj = {
        id: vm.userObj.avatar,
        url: vm.userObj.avatarUrl
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
      $modalInstance.close(vm.userObj);
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