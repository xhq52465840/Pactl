'use strict';

module.exports = ['$scope', '$modalInstance', 'items', '$rootScope', 'restAPI','$modal','Notification',
  function($scope, $modalInstance, items, $rootScope, restAPI, $modal,Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.airData = obj.airData;
    vm.airportData = obj.airportData;
    vm.agentIataData = obj.agentIataData;
    vm.countryData = obj.countryData;
    vm.cancel = cancel;
    vm.save = save;
    vm.specialGoodsData = obj.specialGoodsData;
    vm.title = obj.title;
    vm.fileObj = {
      check: {
        airAble: false,
        destAble: false,
        agentAble: false,
        codeAble: false,
        countryAble: false
      },
      airLine: [],
      dest: [],
      agentIataCode: [],
      specialGoodsCode: [],
      country: ''
    };
    vm.airportDataPart = [];
    vm.refreshDest = refreshDest;
    vm.editCountry = editCountry;

    setData();

    /**
     * 显示编辑数据
     */
    function setData() {
      if (obj.obj.filename) {
        vm.fileObj.coding = obj.obj.coding;
        vm.fileObj.filename = obj.obj.filename;
        if (obj.obj.fltCode === '所有') {
          vm.fileObj.check.airAble = true;
        } else {
          if (obj.obj.fltCode) {
            var fltCode = obj.obj.fltCode.split(';');
            angular.forEach(fltCode, function(v, k) {
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
        if (obj.obj.dest === '所有') {
          vm.fileObj.check.destAble = true;
        } else {
          if (obj.obj.dest) {
            var dest = obj.obj.dest.split(';');
            angular.forEach(dest, function(v, k) {
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
        if (obj.obj.country === '所有') {
          vm.fileObj.check.countryAble = true;
        } else {
          if (obj.obj.country) {
            vm.fileObj.country = obj.obj.country;
          }
        }

        if (obj.obj.agentIataCode === '所有') {
          vm.fileObj.check.agentAble = true;
        } else {
          if (obj.obj.agentIataCode) {
            var agentIataCode = obj.obj.agentIataCode.split(';');
            angular.forEach(agentIataCode, function(v, k) {
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
        if (obj.obj.specialGoodsCode === '所有') {
          vm.fileObj.check.codeAble = true;
        } else {
          if (obj.obj.specialGoodsCode) {
            var specialGoodsCode = obj.obj.specialGoodsCode.split(';');
            angular.forEach(specialGoodsCode, function(v, k) {
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

    function editCountry() {
      var addRuleDialog = $modal.open({
        template: require('./addCountry.html'),
        controller: require('./addCountry.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑国家',
              countryData: vm.countryData,
              obj: {
                country:vm.fileObj.country
              }
            };
          }
        }
      });
      addRuleDialog.result.then(function(data) {
        vm.fileObj.country = data;
      }, function(resp) {

      });
    }
    /**
     * 保存
     */
    function save() {
      var fileObj = vm.fileObj;
      //航空公司 2选 1
      if((!fileObj.airLine || fileObj.airLine.length===0) && !fileObj.check.airAble) {
        Notification.error({
          message: '请填写航空公司或选择所有'
        });
        return;
      }

      //目的港 3选1
      if((!fileObj.dest || fileObj.dest.length===0) && !fileObj.check.destAble && !fileObj.country) {
        Notification.error({
          message: '请填写目的港或选择所有，或者选择国家'
        });
        return;
      }
      //代理人 2 选1
      if((!fileObj.agentIataCode || fileObj.agentIataCode.length===0) && !fileObj.check.agentAble) {
        Notification.error({
          message: '请填写代理人或选择所有'
        });
        return;
      }
      //特货代码2选1
      if((!fileObj.specialGoodsCode || fileObj.specialGoodsCode.length===0) && !fileObj.check.codeAble) {
        Notification.error({
          message: '请填写特货代码或选择所有'
        });
        return;
      }
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