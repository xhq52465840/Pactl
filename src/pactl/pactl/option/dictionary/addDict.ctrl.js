'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
  function ($scope, $modalInstance, restAPI, items, $rootScope) {
    var vm = $scope;
    vm.allData = [];
    vm.cancel = cancel;
    vm.dictObj = {};
    vm.save = save;
    vm.title = items.title;
    vm.typeData = items.typeData;
    vm.isEdit = false;

    getAllData();

    /**
     * 获取所有的数据
     */
    function getAllData() {
      $rootScope.loading = true;
      restAPI.dictionary.queryList.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.allData = resp.rows;
          setData();
        });
    }
    /**
     * 显示数据
     */
    function setData() {
      if (items.obj.name) {
        vm.isEdit = true;
        vm.dictObj.id = items.obj.id;
        vm.dictObj.name = items.obj.name;
        vm.dictObj.num = items.obj.num;
        vm.dictObj.remarks = items.obj.remarks;
        if (items.obj.parentId) {
          for (var index = 0; index < vm.allData.length; index++) {
            var element = vm.allData[index];
            if (element.id === items.obj.parentId) {
              vm.dictObj.parent = element;
              break;
            }
          }
        }
        if (items.obj.type) {
          for (var index = 0; index < vm.typeData.length; index++) {
            var element = vm.typeData[index];
            if (element.tId === items.obj.type) {
              vm.dictObj.type = element;
              break;
            }
          }
        }        
      } else {
        if (items.obj.type) {
          vm.dictObj.type = items.obj.type;
        }
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.dictObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];