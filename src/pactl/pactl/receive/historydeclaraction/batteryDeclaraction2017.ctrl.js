'use strict';

module.exports = ['$scope', 'restAPI', 'Auth', '$modalInstance', 'items',
  function ($scope, restAPI, Auth, $modalInstance, items) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.defaultValue = items.defaultValue?items.defaultValue:'ELI';
    vm.declare = {
      type: vm.defaultValue
    };
    vm.editAble = items.editAble;
    vm.loading = false;
    vm.obj = {};
    vm.select = select;
    vm.title = items.title;
    vm.aircode = '';
    vm.transformData = transformData;
    vm.eliFlag = items.eliFlag;
	vm.elmFlag = items.elmFlag;

    search();
    
    /**
     * 根据awId来获取获取运单号
     * 
     * **/
    function getWaybillNo(awId) {
        vm.loading = true;
        restAPI.subBill.getMasterBill.save(
            awId
          )
          .$promise.then(function (resp) {
            vm.loading = false;
            if (resp.ok) {
            	vm.obj.waybillNo=resp.data.pAirWaybillInfo.waybillNo;
            	vm.aircode = resp.data.pAirWaybillInfo.carrier1;
            }
          });
      }
    /**
     * 获取数据
     */
    function search() {
      vm.loading = true;
      restAPI.declare.battaryDeclare.save({}, {
          awId: items.awId
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            vm.obj = resp.data || {};
            transformData();
          }
          getWaybillNo(items.awId);
        });
    }

    function transformData() {
      vm.obj.overpack = (vm.obj.overpack === '1' || vm.obj.overpack === true) ? true : false;
      vm.obj.eliIiOnly = (vm.obj.eliIiOnly === '1' || vm.obj.eliIiOnly === true) ? true : false;
      vm.obj.eliIbOnly = (vm.obj.eliIbOnly === '1' || vm.obj.eliIbOnly === true) ? true : false;
      vm.obj.eliIiPack = (vm.obj.eliIiPack === '1' || vm.obj.eliIiPack === true) ? true : false;
      vm.obj.eliRelation = (vm.obj.eliRelation === '1' || vm.obj.eliRelation === true) ? true : false;
      vm.obj.eliButtonFlag = (vm.obj.eliButtonFlag === '1' || vm.obj.eliButtonFlag === true) ? true : false;
      vm.obj.noeli = (vm.obj.noeli === '1' || vm.obj.noeli === true) ? true : false;
      vm.obj.elmIiOnly = (vm.obj.elmIiOnly === '1' || vm.obj.elmIiOnly === true) ? true : false;
      vm.obj.elmIbOnly = (vm.obj.elmIbOnly === '1' || vm.obj.elmIbOnly === true) ? true : false;
      vm.obj.elmIiPack = (vm.obj.elmIiPack === '1' || vm.obj.elmIiPack === true) ? true : false;
      vm.obj.elmRelation = (vm.obj.elmRelation === '1' || vm.obj.elmRelation === true) ? true : false;
      vm.obj.elmButtonFlag = (vm.obj.elmButtonFlag === '1' || vm.obj.elmButtonFlag === true) ? true : false;
      vm.obj.noelm = (vm.obj.noelm === '1' || vm.obj.noelm === true) ? true : false;
      vm.obj.lessthen5kg = (vm.obj.lessthen5kg === '1' || vm.obj.lessthen5kg === true) ? true : false;
    }
    /**
     * 选择
     */
    function select(type) {
      vm.declare.type = type;
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];