'use strict';

module.exports = ['$scope', 'restAPI', 'Auth', '$modalInstance', 'items', '$modal', '$window', '$state', 'Notification','$rootScope',
  function($scope, restAPI, Auth, $modalInstance, items, $modal, $window, $state, Notification,$rootScope) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.declare = {
      type: 'printSet'
    };
    vm.loading = false;
    vm.save = save;
    vm.select = select;
    vm.title = items.title;
    /**
     * 当前时间
     */
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    /**
     * 选择
     */
    function select(type) {
      vm.declare.type = type;
    }
    /**
     * 保存
     */
    function save() {
    }

    
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];