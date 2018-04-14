'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
  function ($scope, $modalInstance, restAPI, items) {
    var vm = $scope;
    vm.reasonData = [];
    vm.waybill_no = items.waybill_no;
    vm.cancel = cancel;

    setData();

    /**
     * 显示
     */
    function setData() {
      angular.forEach(items.reasonData, function (v, k) {
        var remark = JSON.parse(v.remark);
        var type = '';
        var personid = '';
        var createtime = '';
        var names = [];
        angular.forEach(remark, function (v1, k1) {
          if (v1.type === '0') {
            type = '扣押';
          } else {
            type = '通过';
          }
          names.push({
            name: v1.name
          });
        });
        vm.reasonData.push({
          type: type,
          names: names,
          createtime: v.createtime,
          personid : v.personid
        });
      });
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];