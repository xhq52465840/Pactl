'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'Notification',
  function ($scope, $modalInstance, items, Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.planObj = obj.obj;
    vm.planTypeData = obj.planTypeData;

    initData();

    function  initData() {
        if(obj.obj.type){
            angular.forEach(vm.planTypeData,function (v,k) {
                if(obj.obj.type == v.id){
                    vm.planObj.type = v;
                }
            });
        }
    }

    /**
     * 保存
     */
    function save() {
      if(!vm.planObj.type) {
        Notification.error({
                message: "请填写方案类型"
        });
      } else {
        $modalInstance.close(vm.planObj);
      }
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];