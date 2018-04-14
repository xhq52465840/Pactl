'use strict';

module.exports = ['$scope', '$modalInstance', 'items','$modal',
  function ($scope, $modalInstance, items,$modal) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.detailObj = obj.obj;
    vm.resourceid = {};
    vm.rType =  {};
    vm.resourceData = [{id:'M',name:'菜单'},{id:'P',name:'权限'},{id:'R',name:'报表'}];
    vm.resourceRows = obj.resourceData;
    vm.selectResource = selectResource;

    init();

    function  init() {
        if(vm.detailObj) {
            vm.detailObj.resourceid = obj.obj.resourceId;
            if (obj.obj.resourceType == 'M') {
                vm.detailObj.rType = vm.resourceData[0];
            }else if(obj.obj.resourceType == 'P'){
                vm.detailObj.rType = vm.resourceData[1];
            }else if(obj.obj.resourceType == 'R'){
              vm.detailObj.rType = vm.resourceData[2];
          }
        }
    }


    function selectResource() {
      var resourceDialog = $modal.open({
        template: require('./resourceDialog.html'),
        controller: require('./resourceDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '选择资源',
              resourceRows: vm.resourceRows
            };
          }
        }
      });
      resourceDialog.result.then(function(data) {
        vm.detailObj.resourceid = data.resId;
        vm.detailObj.rType = data.resType;
      }, function(resp) {

      });
    }


    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.detailObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];