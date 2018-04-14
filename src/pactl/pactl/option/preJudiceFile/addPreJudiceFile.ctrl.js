'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function ($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.airData = obj.airData;
    vm.airportData = obj.airportData;
    vm.agentIataData = obj.agentIataData;
    vm.cancel = cancel;
    vm.save = save;
    vm.specialGoodsData = obj.specialGoodsData;
    vm.title = obj.title;
    vm.fileObj = {
      check: {
        airAble: false,
        destAble: false,
        agentAble: false,
        codeAble: false
      },
      airLine: [],
      dest: [],
      agentIataCode: [],
      specialGoodsCode: []
    };
    vm.refreshDest = refreshDest;

    setData();

    /**
     * 显示编辑数据
     */
    function setData() {
      if (obj.obj.name) {
        vm.fileObj.code = obj.obj.code;
        vm.fileObj.name = obj.obj.name;
        vm.fileObj.type = obj.obj.type;
        vm.fileObj.upload = obj.obj.upload === '1' ? true : false;
        if (obj.obj.airCode === '所有') {
          vm.fileObj.check.airAble = true;
        } else {
          if (obj.obj.airCode) {
            var airCode = obj.obj.airCode.split(';');
            angular.forEach(airCode, function (v, k) {
              for (var index = 0; index < vm.airData.length; index++) {
                var element = vm.airData[index];
                if (v === element.airCode) {
                  vm.fileObj.airLine.push(element);
                  break;
                }
              }
            });
          }
        }
        if (obj.obj.destCode === '所有') {
          vm.fileObj.check.destAble = true;
        } else {
          if (obj.obj.destCode) {
            var dest = obj.obj.destCode.split(';');
            angular.forEach(dest, function (v, k) {
              for (var index = 0; index < vm.airportData.length; index++) {
                var element = vm.airportData[index];
                if (v === element.airportCode) {
                  vm.fileObj.dest.push(element);
                  break;
                }
              }
            });
          }
        }
        if (obj.obj.agent === '所有') {
          vm.fileObj.check.agentAble = true;
        } else {
          if (obj.obj.agent) {
            var agentIataCode = obj.obj.agent.split(';');
            angular.forEach(agentIataCode, function (v, k) {
              for (var index = 0; index < vm.agentIataData.length; index++) {
                var element = vm.agentIataData[index];
                if (v === element.code) {
                  vm.fileObj.agentIataCode.push(element);
                  break;
                }
              }
            });
          }
        }
        if (obj.obj.specialCode === '所有') {
          vm.fileObj.check.codeAble = true;
        } else {
          if (obj.obj.specialCode) {
            var specialGoodsCode = obj.obj.specialCode.split(';');
            angular.forEach(specialGoodsCode, function (v, k) {
              for (var index = 0; index < vm.specialGoodsData.length; index++) {
                var element = vm.specialGoodsData[index];
                if (v === element.sccId) {
                  vm.fileObj.specialGoodsCode.push(element);
                  break;
                }
              }
            });
          }
        }
      }
    }
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.fileObj);
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
  }
];