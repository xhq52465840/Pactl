'use strict';

module.exports = ['$scope', '$modalInstance', '$modal', 'restAPI', 'items', '$rootScope',
  function($scope, $modalInstance, $modal, restAPI, items, $rootScope) {
    var vm = $scope;
    vm.bookId = items.bookId;
    vm.cancel = cancel;
    vm.save = save;

    /**
     * 留存完成
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