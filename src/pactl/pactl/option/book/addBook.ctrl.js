'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI','$modal','Notification','$rootScope',
  function($scope, $modalInstance, items, restAPI,$modal,Notification,$rootScope) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.airData = obj.airData;
    vm.itemObj = obj.obj;
    vm.itemObj.check = {destAble: false};
    vm.save = save;
    vm.title = obj.title;
    vm.cancel = cancel;
    vm.onlyEn = onlyEn;
    vm.refreshDest = refreshDest;
    vm.editCountry = editCountry;
    vm.countryData = obj.countryData;
    vm.isEdit = obj.isEdit;

     /**
     * 获取国家
     */
    function getCountryData() {
      $rootScope.loading = true;
      restAPI.country.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.countryData = resp.data || [];
          getAgentIataData();
        });
    }

    setData();
    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.airCode) {
        for (var index = 0; index < vm.airData.length; index++) {
          var element = vm.airData[index];
          if (element.airCode === vm.itemObj.airCode) {
            vm.itemObj.airCode = element;
            break;
          }
        }
        if(vm.itemObj.destCode === '*') {
          vm.itemObj.check.destAble = true;
          vm.itemObj.destCode = '';
        } else {
          var destCode = vm.itemObj.destCode.split(',');
          vm.itemObj.destCode = [];
          angular.forEach(destCode, function(v, k) {
            if(v && v.length>0) {
              restAPI.airData.getDataByCode.save({}, v)
              .$promise.then(function(resp) {
                var airportData = resp.data;
                if (airportData) {
                  vm.itemObj.destCode.push(airportData);
                }
              });
            }
          });
        }
      }
    }
    /**
     * 保存
     */
    function save() {
      var obj = getData(vm.itemObj);
      $rootScope.loading = true;
      restAPI.bookRule.editBook.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: (vm.isEdit?'编辑':'新增')+'审单宝典成功'
            });
            $modalInstance.close(vm.itemObj);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
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
        .$promise.then(function(resp) {
          vm.airportDataPart = resp.rows;
        });
    }

    function editCountry() {
      var addRuleDialog = $modal.open({
        template: require('../receiveFile/addCountry.html'),
        controller: require('../receiveFile/addCountry.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑国家',
              countryData: vm.countryData,
              obj: {
                country:vm.itemObj.countryCode
              }
            };
          }
        }
      });
      addRuleDialog.result.then(function(data) {
        vm.itemObj.countryCode = data;
      }, function(resp) {

      });
    }

     /**
     * 新增数据
     */
    function getData(params) {
      var obj = {};
      obj.airCode = params.airCode.airCode;
      obj.countryCode = params.countryCode;
      obj.destCode = [];
      angular.forEach(params.destCode || [], function(v, k) {
        obj.destCode.push(v.airportCode);
      });
      if(params.check.destAble) {
        obj.destCode = '*';
      } else {
        obj.destCode = obj.destCode.join(',');
      }
      obj.rule = params.rule;
      obj.coding = params.coding;
      if(vm.isEdit) {
        obj.id = params.id;
      }
      return obj;
    }
    /**
     * 只能输入数字和字母
     */
    function onlyEn() {
      try {
        vm.itemObj.coding = vm.itemObj.coding.replace(/[^\w\.\/]/ig, '');
      } catch (error) {
        return;
      }
    }
  }
];