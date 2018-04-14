'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.cleanTag = cleanTag;
    vm.save = save;
    vm.tagData = [];
    vm.tagObj = {};
    vm.tagDisable = false;
    vm.title = items.title;
    vm.type = items.type;
    
    getTag();

    /**
     * 获取标签
     */
    function getTag() {
      restAPI.tag.tagList.save({}, {
        status: '0'
      })
        .$promise.then(function (resp) {
          vm.tagData = resp.rows;
          if(vm.type === '0'){
            vm.tagObj.tag = [];
            angular.forEach(items.labels, function(v, k) {
             for (var index = 0; index < vm.tagData.length; index++) {
               var element = vm.tagData[index];
               if(v.id === element.id){
                 vm.tagObj.tag.push(element);
                 break;
               }
             } 
            });
          }
        });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.tagObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 清空标签
     */
    function cleanTag($e) {
      var checkbox = $e.target;
      vm.tagDisable = checkbox.checked;
      vm.tagObj.tag = [];
    }    
  }
];