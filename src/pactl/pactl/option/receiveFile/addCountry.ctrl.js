'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI',
  function($scope, $modalInstance, items, $rootScope, restAPI) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.countryData = obj.countryData;
    vm.cancel = cancel;
    vm.save = save;
    vm.title = obj.title;
    vm.fileObj = {
      country: []
    };
    

    setData();

    /**
     * 显示编辑数据
     */
    function setData() {
        if (obj.obj.country) {
          var country = obj.obj.country.split(';');
          angular.forEach(country, function(v, k) {
            for (var index = 0; index < vm.countryData.length; index++) {
              var element = vm.countryData[index];
              if (v === element.countryCode) {
                vm.fileObj.country.push(element);
                break;
              }
            }
          });
        }
    }
    /**
     * 保存
     */
    function save() {
      var country = '';
      if(vm.fileObj.country && vm.fileObj.country.length>0) {
        angular.forEach(vm.fileObj.country, function(v, k) {
          if(country !== '') {
            country += ";";
          }
          country += v.countryCode;
        });
      }
      $modalInstance.close(country);
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
          vm.airportDataPart = resp.rows;
        });
    }
  }
];