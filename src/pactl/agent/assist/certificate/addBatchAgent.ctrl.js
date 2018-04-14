'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items','Auth',
  function ($scope, $modalInstance, restAPI, items,Auth) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.save = save;
    vm.agentData = angular.copy(items.agent);
    vm.oldAgent = items.oldAgent;
    vm.agentObj = {
      agentSales: []
    };
    vm.title = items.title;
    vm.isBatch = items.batch; 
    vm.isCancel = items.cancel;
    
    setData();

    /**
     * 显示数据
     */
    function setData() {

      var deIndex = -1;
      for (var index = 0; index < vm.agentData.length; index++) {
        var element = vm.agentData[index];
        if(element.id === Auth.getMyUnitId()){
          deIndex = index;
          break;
        }
      }
      if(deIndex>=0) {
        vm.agentData.splice(deIndex,1);
      }

      angular.forEach(vm.oldAgent, function(v, k) {
        for (var index = 0; index < vm.agentData.length; index++) {
          var element = vm.agentData[index];
          if(+v.agentSalesId === element.id){
            vm.agentObj.agentSales.push({
              id: element.id,
              code: element.code,
              description: element.description,
            });
            break;
          }
        }
      });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.agentObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }    
  }
];