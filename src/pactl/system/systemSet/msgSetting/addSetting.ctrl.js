'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    vm.airData = angular.copy(items.airData);
    vm.base = {
      type: ''
    };
    vm.cancel = cancel;
    vm.itemObj = angular.copy(items.obj);
    vm.msgTypeData = angular.copy(items.msgTypeData);
    vm.msgSendDirData = angular.copy(items.msgSendDirData);
    vm.save = save;
    vm.sendTypeData = angular.copy(items.sendTypeData)
    vm.sendTypeSelected = sendTypeSelected;
    vm.showAir = showAir;
    vm.showFltNo = showFltNo;
    vm.showStation = showStation;
    // vm.showSendAddr = showSendAddr;
    vm.airportData = [];
    vm.stationData = angular.copy(items.stationData);
    vm.title = items.title;
    vm.refreshDest = refreshDest;
    vm.notShowAirData = items.notShowAirData;
    vm.showmVersion = showmVersion;

    setData();

    /**
     * 显示数据
     */
    function setData() {
      if (vm.itemObj.sendType) {
        for (var index = 0; index < vm.sendTypeData.length; index++) {
          var element = vm.sendTypeData[index];
          if (vm.itemObj.sendType === element.code) {
            vm.itemObj.sendType = element;
            break;
          }
        }
        sendTypeSelected(vm.itemObj.sendType);
      }
      if (vm.itemObj.airId) {
        for (var index = 0; index < vm.airData.length; index++) {
          var element = vm.airData[index];
          if (vm.itemObj.airId === element.alId) {
            vm.itemObj.airId = element;
            break;
          }
        }
      }
      if (vm.itemObj.msgType) {
        for (var index = 0; index < vm.msgTypeData.length; index++) {
          var element = vm.msgTypeData[index];
          if (vm.itemObj.msgType === element.code) {
            vm.itemObj.msgType = element;
            break;
          }
        }
      }
      if (vm.itemObj.station) {
        for (var index = 0; index < vm.stationData.length; index++) {
          var element = vm.stationData[index];
          if (vm.itemObj.station === element.airportCode) {
            vm.itemObj.station = element;
            break;
          }
        }
      }
      if (vm.itemObj.msgSendDir) {
        for (var index = 0; index < vm.msgSendDirData.length; index++) {
          var element = vm.msgSendDirData[index];
          if (vm.itemObj.msgSendDir === element.id) {
            vm.itemObj.msgSendDir = element;
            break;
          }
        }
      }
    }
    /**
     * 报文地址的选择
     */
    function sendTypeSelected(item) {
      if (item.name === 'HERMS') {
        vm.base.type = '1';
      } else if (item.name === '货代给航空公司') {
        vm.base.type = '2';
      } else if (item.name === '货站给航空公司') {
        vm.base.type = '3';
      } else if (item.name === '英迪数据对接') {
        vm.base.type = '4';
      }
    }
    /**
     * 航空公司是否只读
     */
    function showAir() {
      if (vm.base.type === '1' || vm.base.type === '4') {
        vm.itemObj.airId = '';
        return true;
      } else {
        return false;
      }
    }

    /**
     * 版本是否只读
     */
    function showmVersion(item) {
      if (vm.base.type === '4') {
        vm.itemObj[item] = '';
        return true;
      } else {
        return false;
      }
    }
    /**
     * 发报地址是否可见
     */
    // function showSendAddr() {
    //   if (vm.base.type === '1') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    /**
     * 卸机站是否只读
     */
    function showStation() {
      if (vm.base.type === '1' || vm.base.type === '2' || vm.base.type === '4') {
        vm.itemObj.station = '';
        return true;
      } else {
        return false;
      }
    }
    /**
     * 航班号是否只读
     */
    function showFltNo() {
      if (vm.base.type === '1' || vm.base.type === '2' || vm.base.type === '4') {
        vm.itemObj.fltNo = '';
        return true;
      } else {
        return false;
      }
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
    /**
     * 
     * 根据参数查询机场数据
     * 
     * @param {any} param
     */
    function refreshDest(param) {
      var searchObj = {};
      vm.airportData = [];
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
        .$promise.then(function(resp) {
          vm.airportData = resp.rows;
        });
    }
  }
];