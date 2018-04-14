'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$modal', '$rootScope', 'Notification',
  function ($scope, $modalInstance, items, restAPI, $modal, $rootScope, Notification) {
    var vm = $scope;
    vm.alsoObj = angular.copy(items.obj);
    vm.cancel = cancel;
    vm.changeNum = changeNum;
    vm.changeText = changeText;
    vm.changeText1 = changeText1;
    vm.countryData = items.countryData;
    vm.save = save;
    vm.saveUser = saveUser;
    vm.searchUser = searchUser;
    vm.title = items.title;

    setData();
    /**
     * 显示已存在的数据
     */
    function setData() {
      if (vm.alsoObj.notifyCountry) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryCode === vm.alsoObj.notifyCountry) {
            vm.alsoObj.notifyCountry = element;
            break;
          }
        }
      }
    }
    /**
     * 人名搜索
     */
    function searchUser() {
      var searchUserDialog = $modal.open({
        template: require('../newBill/searchName.html'),
        controller: require('../newBill/searchName.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '客户数据搜索调用界面',
              type1: '2',
              type2: '0'
            };
          }
        }
      });
      searchUserDialog.result.then(function (data) {
        setUser(data);
      }, function (resp) {

      });
    }
    /**
     * 显示人信息
     */
    function setUser(data) {
      vm.alsoObj.notifyName = data.name;
      vm.alsoObj.notifyAddress = data.address;
      vm.alsoObj.notifyZipcode = data.zipcode;
      vm.alsoObj.notifyCity = data.city;
      vm.alsoObj.notifyState = data.state;
      if (data.country) {
        for (var index = 0; index < vm.countryData.length; index++) {
          var element = vm.countryData[index];
          if (element.countryCode === data.country) {
            vm.alsoObj.notifyCountry = element;
            break;
          }
        }
      }
      vm.alsoObj.notifyTel = data.tel;
      vm.alsoObj.notifyFax = data.fax;
      vm.alsoObj.notifyContractor = data.contacts;
    }
    /**
     * 保存人名
     */
    function saveUser(type) {
      var obj = getSaveUserData(type);
      var addPeoplDialog = $modal.open({
        template: require('../../option/people/addPeople.html'),
        controller: require('../../option/people/addPeople.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: obj.title,
              countryData: vm.countryData,
              obj: obj.data
            };
          }
        }
      });
      addPeoplDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.people.savePeople.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: obj.title + '成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 保存需要的信息
     */
    function getSaveUserData(type) {
      var obj = {
        data: {},
        title: ''
      };
      obj.data.name = vm.alsoObj.notifyName;
      obj.data.address = vm.alsoObj.notifyAddress;
      obj.data.zipcode = vm.alsoObj.notifyZipcode;
      obj.data.city = vm.alsoObj.notifyCity;
      obj.data.state = vm.alsoObj.notifyState;
      obj.data.country = vm.alsoObj.notifyCountry && vm.alsoObj.notifyCountry.countryCode;
      obj.data.tel = vm.alsoObj.notifyTel;
      obj.data.fax = vm.alsoObj.notifyFax;
      obj.data.contacts = vm.alsoObj.notifyContractor;
      obj.data.awType = '0';
      obj.data.scType = '2';
      obj.title = '添加alsoNotify信息';
      return obj;
    }
    /**
     * 只能输入大写
     */
    function changeText(text) {
      try {
        vm.alsoObj[text] = vm.alsoObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字和字母
     */
    function changeText1(text) {
      try {
        vm.alsoObj[text] = vm.alsoObj[text].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 只能输入数字-
     * 
     * @param {any} text
     */
    function changeNum(text) {
      try {
        vm.alsoObj[text] = vm.alsoObj[text].replace(/[^0-9-]/g, '');
      } catch (error) {
        return;
      }
    }
    /**
     * 保存
     */
    function save() {
      if (vm.alsoObj.notifyCountry) {
        vm.alsoObj.notifyCountry = vm.alsoObj.notifyCountry.countryCode;
      }
      $modalInstance.close(vm.alsoObj);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];