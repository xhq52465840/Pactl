'use strict';

module.exports = ['$rootScope','$scope', '$modalInstance', 'items', 'restAPI', 'Auth','Page',
  function ($rootScope,$scope, $modalInstance, items, restAPI, Auth,Page) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.uploadCallback = uploadCallback;
    vm.userObj = obj.obj;
    vm.userObj.file = {};
    vm.userObj.fileObj = {};
    vm.checkAccount = checkAccount;
    vm.checkaccount = false;
    vm.unit = {};
    vm.userObj.unitRoleDOs = [];
    vm.showItem = {
			start: 0,
			end: 0
		};
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();

    initUnit();

    function initUnit() {
      initUnitRoles();
      restAPI.agentuserManage.queryunits.save({
          id: Auth.getMyUnitId()
        }, {})
        .$promise.then(function (resp) {
          vm.unit = resp.unit;
        });
    }

    // /**
    //  * 获取角色
    //  */
    // function initRole() {
    //   restAPI.agentuserManage.queryroles.query({
    //       id: Auth.getMyUnitId()
    //     }, {})
    //     .$promise.then(function (resp) {
    //       vm.roleData = resp;
    //     });
    // }

    /**
     * 获取多机构角色
     */
    function initUnitRoles() {
      $rootScope.loading = true;
      restAPI.role.allUnitRolesOfAgent.query({
          id: Auth.getMyUnitId()
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.userObj.unitRoleDOs = resp;
          showUnitRoleDOs();
        });
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
      vm.userObj.account = vm.unit.code + vm.userObj.account;
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
    /**
     * 校验用户名
     */
    function checkAccount() {
      var resp = restAPI.user.checkaccount.get({
        account: vm.userObj.account
      }, {}).$promise.then(function (data) {
        if (data.result) {
          vm.checkaccount = false;
        } else {
          vm.checkaccount = true;
        }
      });
    }
  }
];