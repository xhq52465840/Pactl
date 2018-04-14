'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.resourceObj = obj.obj;
    vm.resTypeData = [];

    getResType();

    initData();

    function initData() {
      if (obj.obj.id) {
        vm.isedit = true;
      }
      angular.forEach(vm.resTypeData, function (v, k) {
        if (obj.obj.resType == v.id) {
          vm.resourceObj.resType = v;
        }
      });
    }
    /**
     * 获取所有权限集合列表
     */
    function getResType() {
      vm.resTypeData = [{
        id: 'M',
        name: '菜单'
      }, {
        id: 'P',
        name: '权限管理'
      }, {
        id: 'R',
        name: '报表'
      }];
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.resourceObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];