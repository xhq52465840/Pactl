'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function ($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    var air = [];
    var noair = [];
    vm.cancel = cancel;
    vm.airData = items.airData;
    vm.airportData = items.airportData;
    vm.nameObj = {};
    vm.save = save;
    vm.title = items.title;
    vm.refreshDest = refreshDest;
    vm.airData1 = [];
    vm.airData2 = [];
    vm.selectAir1 = selectAir1;
    vm.selectAir2 = selectAir2;

    setData();
    /**
     * 显示数据
     */
    function setData() {
      if (items.obj.goodsName) {
        if (items.obj.fltCode) {
          vm.nameObj.fltCode = [];
          angular.forEach(items.obj.fltCode.split(';'), function (v, k) {
            for (var index = 0; index < vm.airData.length; index++) {
              var element = vm.airData[index];
              if (v === element.airCode) {
                vm.nameObj.fltCode.push(element);
                break;
              }
            }
          });
          selectAir1();
        }
        if (items.obj.noFltCode) {
          vm.nameObj.noFltCode = [];
          angular.forEach(items.obj.noFltCode.split(';'), function (v, k) {
            for (var index = 0; index < vm.airData.length; index++) {
              var element = vm.airData[index];
              if (v === element.airCode) {
                vm.nameObj.noFltCode.push(element);
                break;
              }
            }
          });
          selectAir2();
        }
        if (items.obj.dest) {
          vm.nameObj.dest = [];
          angular.forEach(items.obj.dest.split(';'), function (v, k) {
            for (var index = 0; index < vm.airportData.length; index++) {
              var element = vm.airportData[index];
              if (v === element.airportCode) {
                vm.nameObj.dest.push(element);
                break;
              }
            }
          });
        }
        vm.nameObj.goodsName = items.obj.goodsName;
      } else {
        vm.airData2 = angular.copy(vm.airData);
        vm.airData1 = angular.copy(vm.airData);
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.nameObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 
     * 根据参数查询机场数据
     * 
     * @param {any} param
     */
    function refreshDest(param) {
      var searchObj = {};
      vm.airportDataPart = [];
      if (param) {
        searchObj = {
          airportCode: param
        };
      } else {
        searchObj = {
          airportCode: param,
          isCommon: '1'
        };
      }
      restAPI.airPort.queryList.save({}, searchObj)
        .$promise.then(function (resp) {
          vm.airportDataPart = resp.rows;
        });
    }
    /**
     * 
     * @param {*}  
     */
    function selectAir1() {
      var data = angular.copy(vm.airData);
      var selectedItems = vm.nameObj.fltCode;
      if (data !== undefined && data !== null) {
        var filteredItems = data.filter(function (i) {
          return angular.isArray(selectedItems) ? selectedItems.every(function (selectedItem) {
            return !angular.equals(i, selectedItem);
          }) : !angular.equals(i, selectedItems);
        });
        vm.airData2 = filteredItems;
      }
    }
    /**
     * 
     * @param {*}  
     */
    function selectAir2() {
      var data = angular.copy(vm.airData);
      var selectedItems = vm.nameObj.noFltCode;
      if (data !== undefined && data !== null) {
        var filteredItems = data.filter(function (i) {
          return angular.isArray(selectedItems) ? selectedItems.every(function (selectedItem) {
            return !angular.equals(i, selectedItem);
          }) : !angular.equals(i, selectedItems);
        });
        vm.airData1 = filteredItems;
      }
    }
  }
];