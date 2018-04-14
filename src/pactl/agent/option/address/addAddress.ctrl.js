'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function($scope, $modalInstance, items) {
    var vm = $scope;
    vm.address = items.obj;
    vm.cancel = cancel;
    vm.title = items.title;
    vm.scData = [];
    vm.setScData = setScData;
    vm.save = save;

    /**
     * 邮箱地址类型
     */
    vm.addressData = [{
      id: '0',
      name: 'SITA地址'
    }, {
      id: '1',
      name: '邮箱地址'
    }];

    /**
     * 报文类型
     */
    vm.messageData = [{
      id: '1',
      name: 'fwb'
    }, {
      id: '0',
      name: 'fhl'
    }];


    /**
     * 报文类型选择
     */
    function setScData(params, $e) {
      var index = vm.scData.indexOf(params.id);
      var checked = $e.target.checked;
      if (checked) {
        vm.scData.push(params.id);
      } else {
        if (index > -1) {
          vm.scData.splice(index, 1);
        }
      }
      vm.address.messageType = vm.scData.join(';');
    }

    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.address);
    }

    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];