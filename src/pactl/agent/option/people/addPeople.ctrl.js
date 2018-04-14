'use strict';

module.exports = ['$scope', '$modalInstance', 'items',
  function ($scope, $modalInstance, items) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.awData = [];
    vm.scData = [];
    vm.cancel = cancel;
    vm.countryData = items.countryData;
    vm.peopleObj = obj.obj;
    vm.save = save;
    vm.setAwData = setAwData;
    vm.setScData = setScData;
    vm.title = obj.title;
    vm.type1 = [{
      id: '0',
      name: '主单'
    }, {
      id: '1',
      name: '分单'
    }];
    vm.type2 = [{
      id: '0',
      name: '收货人'
    }, {
      id: '1',
      name: '发货人'
    }, {
      id: '2',
      name: '通知人'
    }];

    setData();
    /**
     * 编辑时显示数据
     */
    function setData() {
      if (vm.peopleObj.scType) {
        vm.awData = vm.peopleObj.awType.split(';');
        vm.scData = vm.peopleObj.scType.split(';');
        if (vm.peopleObj.country) {
          for (var index = 0; index < vm.countryData.length; index++) {
            var element = vm.countryData[index];
            if (vm.peopleObj.country === element.countryCode) {
              vm.peopleObj.country = element;
              break;
            }
          }
        }
      }
    }
    /**
     * 保存
     */
    function save() {
      if (vm.peopleObj.country) {
        vm.peopleObj.country = vm.peopleObj.country.countryCode;
      }
      $modalInstance.close(vm.peopleObj);
    }
    /**
     * 主分单选择
     * 
     * @param {any} params
     */
    function setAwData(params, $e) {
      var index = vm.awData.indexOf(params.id);
      var checked = $e.target.checked;
      if (checked) {
        vm.awData.push(params.id);
      } else {
        if (index > -1) {
          vm.awData.splice(index, 1);
        }
      }
      vm.peopleObj.awType = vm.awData.join(';');
    }
    /**
     * 类型选择
     * 
     * @param {any} params
     */
    function setScData(params, $e) {
      var index = vm.scData.indexOf(params.id);
      var checked = $e.target.checked;
      if (checked) {
        vm.scData.push(params.id);
      } else {
        if (index > -1) {
          vm.scData.splice(index, 1);
        }
      }
      vm.peopleObj.scType = vm.scData.join(';');
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    $scope.$watch('peopleObj.name', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.name = newVal.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.name = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.zipcode', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.zipcode = newVal.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.zipcode = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.state', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.state = newVal.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.state = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.city', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.city = newVal.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.city = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.contacts', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.contacts = newVal.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.contacts = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.address', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.address = newVal.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.address = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.tel', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.tel = newVal.replace(/[^0-9-]/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.tel = oldVal;
          return;
        }
      }
    });
    $scope.$watch('peopleObj.fax', function (newVal, oldVal) {
      if (newVal) {
        try {
          vm.peopleObj.fax = newVal.replace(/[^0-9-]/g, '').toUpperCase();
        } catch (error) {
          vm.peopleObj.fax = oldVal;
          return;
        }
      }
    });                             
  }
];