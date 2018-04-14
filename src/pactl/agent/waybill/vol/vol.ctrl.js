'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Notification', '$rootScope',
  function ($scope, $modalInstance, items, restAPI, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.cancel = cancel;
    vm.changeNum = changeNum;
    vm.changeNum2 = changeNum2;
    vm.newItems = items.data;
    vm.srcData = [];
    vm.remove = remove;
    vm.save = save;
    vm.itemObj = {};
    vm.weightCodeData = [];
    vm.unitCodeData = [];
    vm.getWeightCode = getWeightCode;
    vm.changeUnitCode = changeUnitCode;
    vm.totalObj = {};

    copySrcData();
    sumTotalObj();
    getUnitCodeData();
    /**
     * 尺寸单位
     */
    function getUnitCodeData() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1486365302346574'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.unitCodeData = resp.rows;
          getWeightCode();
        });
    }

    /**
     * kg lb
     */
    function getWeightCode() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480573443228570'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.weightCodeData = resp.rows;
          setData();
        });
    }

    function copySrcData() {

      for (var i = 0; i < vm.newItems.length; i++) {
        var data = {};
        for (var attr in vm.newItems[i]) {
          if (vm.newItems[i].hasOwnProperty(attr)) {
            data[attr] = vm.newItems[i][attr];
          }
        }
        vm.srcData[i] = data;
      }
    }

    //初始化数据
    function setData() {
      for (var i = 0; i < vm.newItems.length; i++) {
        var data = vm.newItems[i];
        if (data.unitcode === 'NDA') {
          data.unitcodeCheck = true;
        }
        if (data.weightCode) {
          for (var index = 0; index < vm.weightCodeData.length; index++) {
            var element = vm.weightCodeData[index];
            if (element.id === data.weightCode) {
              data.weightCode = element;
              break;
            }
          }
        }

        for (var index = 0; index < vm.unitCodeData.length; index++) {
          var element = vm.unitCodeData[index];
          if ((data.unitcode === 'NDA' || !data.unitcode) && element.id === 'CM') {
            data.unitcode = element;
            break;
          } else if (element.id === data.unitcode) {
            data.unitcode = element;
            break;
          }
        }
      }
      sumTotalObj();
    }

    function sumTotalObj() {
      vm.totalObj.pieces = 0;
      for (var i = 0; i < vm.newItems.length; i++) {
        var data = vm.newItems[i];
        if (data.pieces) {
          vm.totalObj.pieces += parseInt(data.pieces);
        }
      }
    }

    function changeUnitCode(item) {
      if (item.unitcodeCheck) {
        item.length = '';
        item.width = '';
        item.height = '';
        item.pieces = '';
        item.unitcode = '';
      }
    }

    /**
     * 添加新项目
     */
    function add() {
      var unitcode = null;
      for (var index = 0; index < vm.unitCodeData.length; index++) {
        var element = vm.unitCodeData[index];
        if (element.id === 'CM') {
          unitcode = element;
        }
      }

      vm.newItems.push({
        length: '',
        width: '',
        height: '',
        pieces: '',
        unitcode: unitcode
      });
    }
    /**
     * 删除项目
     */
    function remove(index) {
      vm.newItems.splice(index, 1);
    }
    /**
     * 只能输入数字
     * 
     * @param {any} text
     */
    function changeNum(param, text) {
      try {
        param[text] = param[text].replace(/[^0-9]/g, '');
      } catch (error) {
        return;
      }
      if (text === 'pieces') {
        sumTotalObj();
      }
    }
    /**
     * 只能输入数字和小数点
     * 
     * @param {any} text
     */
    function changeNum2(text) {
      try {
        vm.billObj[text] = vm.billObj[text].replace(/[^0-9.]/g, '');
      } catch (error) {
        return;
      }
    }
    /**
     * 保存
     */
    function save() {
      for (var i = 0; i < vm.newItems.length; i++) {
        var data = vm.newItems[i];
        if ((!data.unitcodeCheck && (!data.length || !data.width || !data.height || !data.pieces || !data.unitcode)) || (data.unitcodeCheck && (!data.weightCode || !data.weight))) {
          Notification.error({
            message: '有数据未填写'
          });
          return false;
        }
        if (!data.weightCode && data.weight) {
          Notification.error({
            message: '重量单位未填写'
          });
          return false;
        }
        if (data.weightCode && !data.weight) {
          Notification.error({
            message: '重量未填写'
          });
          return false;
        }
      }
      for (var i = 0; i < vm.newItems.length; i++) {
        var data = vm.newItems[i];
        if (data.unitcodeCheck) {
          data.unitcode = 'NDA';
        } else {
          data.unitcode = data.unitcode.id;
        }
        if (data.weightCode) {
          data.weightCode = data.weightCode.id;
        }
      }
      $modalInstance.close(vm.newItems);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.close(vm.srcData);
    }
  }
];