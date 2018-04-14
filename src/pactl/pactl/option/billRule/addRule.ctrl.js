'use strict';

module.exports = ['$rootScope', '$scope', '$modalInstance', 'items', 'restAPI',
  function($rootScope, $scope, $modalInstance, items, restAPI) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.itemObj = obj.obj;
    vm.airData = [];
    vm.peopleData = obj.peopleData;
    vm.stationData = obj.stationData;
    vm.save = save;
    vm.title = obj.title;
    vm.cancel = cancel;
    vm.getAirData = getAirData;

    setData();
    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.littleGroup) {
        // 货站
        for (var index = 0; index < vm.stationData.length; index++) {
          var element = vm.stationData[index];
          if (element.id === vm.itemObj.goodsStation) {
            vm.itemObj.goodsStation = element;
            break;
          }
        }
        // 航空公司
        getAirData(vm.itemObj.goodsStation.id, setAirData);
        // 小组成员
        var member = vm.itemObj.member.split(',');
        vm.itemObj.member = [];
        angular.forEach(member, function(v, k) {
          for (var index = 0; index < vm.peopleData.length; index++) {
            var element = vm.peopleData[index];
            if (element.id == v) {
              vm.itemObj.member.push(element);
              break;
            }
          }
        });
      }
    }
    /**
     * 根据货站获取航空公司
     */
    function getAirData(param, callback) {
      $rootScope.loading = true;
      restAPI.taskRule.ruleList.save({}, {
          'goodsStation': param
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.airData = resp.rows;
          !callback && (vm.itemObj.fltCode = '');
          callback && callback();
        });
    }

    // 航空公司
    function setAirData() {
      var fltCode = vm.itemObj.fltCode.split(',');
      vm.itemObj.fltCode = [];
      angular.forEach(fltCode, function(v, k) {
        for (var index = 0; index < vm.airData.length; index++) {
          var element = vm.airData[index];
          if (element.fltCode === v) {
            vm.itemObj.fltCode.push(element);
            break;
          }
        }
      });
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.itemObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];