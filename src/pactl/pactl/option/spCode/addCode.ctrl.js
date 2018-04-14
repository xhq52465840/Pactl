'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope',
  function ($scope, $modalInstance, items, $rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.checkData = obj.checkData;
    vm.cancel = cancel;
    vm.codeObj = {};
    vm.save = save;
    vm.title = obj.title;

    setData();

    /**
     * 显示编辑数据
     */
    function setData() {
      if(obj.obj.sccCode){
        vm.codeObj.sccCode = obj.obj.sccCode;
        vm.codeObj.sccDesc = obj.obj.sccDesc;
        vm.codeObj.dangerousMark = obj.obj.dangerousMark;
        vm.codeObj.liMark = obj.obj.liMark;
        if(obj.obj.localeCheckType){
          vm.codeObj.localeCheckType = [];
          angular.forEach(obj.obj.localeCheckType.split(';'), function(v, k) {
            for (var index = 0; index < vm.checkData.length; index++) {
              var element = vm.checkData[index];
              if (v === element.checkName) {
                vm.codeObj.localeCheckType.push(element);
                break;
              }
            }            
          });
        }                      
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.codeObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];