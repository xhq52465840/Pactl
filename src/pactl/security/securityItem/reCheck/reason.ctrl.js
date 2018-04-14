'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Notification',
  function($scope, $modalInstance, items, restAPI, $rootScope, Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    var selected = [];
    var checkedData = [];
    vm.billNo = obj.billNo;
    vm.check = check;
    vm.title = obj.title;
    vm.showSelect = obj.type;
    vm.reasonObj = {};
    vm.reasonData = [];
    vm.seizureData = obj.seizureData;
    vm.dangerData = obj.dangerData;
    vm.save = save;
    vm.type = obj.type;
    vm.cancel = cancel;

    getReason();

    /**
     * 获取通过原因
     */
    function getReason() {
        $rootScope.loading = true;
        restAPI.reason.queryAll.save({}, {
            type: obj.type
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            vm.reasonData = resp.list;
          });
      }
      /**
       * 单选
       */
    function check($e, param) {
        var checkbox = $e.target,
          id = param.id,
          index = selected.indexOf(id);
        param.checked = checkbox.checked;
        if (param.checked) {
          selected.push(id);
          checkedData.push(param);
        } else {
          selected.splice(index, 1);
          checkedData.splice(index, 1);
        }
      }
      /**
       * 保存
       * 1.当首检待定时，通过写原因，
       * 2.当扣押时，此时点通过，必须写原因；不是扣押，可以都不填；通过时没用下面两个选择框
       * 3.点扣押时，原因，下拉框填写
       */
    function save() {
        if (valid()) {
          vm.reasonObj.remarkData = checkedData;
          if (vm.reasonObj.remark) {
            vm.reasonObj.remarkData.push({
              id: 'all',
              name: vm.reasonObj.remark,
              type: obj.type
            });
          }
          $modalInstance.close(vm.reasonObj);
        } else {
          Notification.error({
            message: '有必填数据未填写'
          });
        }
      }
      /**
       * 校验
       */
    function valid() {
        var result = true;
        if (obj.type === '0') {
          if ((checkedData.length > 0 || vm.reasonObj.remark) && vm.reasonObj.seizure) {
            result = true;
          } else {
            result = false;
          }
        } else {
          if (obj.sStatus === '0' || obj.fStatus === '0') {
            if (checkedData.length > 0 || vm.reasonObj.remark) {
              result = true;
            } else {
              result = false;
            }
          } else {
            result = true;
          }
        }
        return result;
      }
      /**
       * 取消
       */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];