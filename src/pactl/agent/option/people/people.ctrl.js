'use strict';

var people_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Expexcel',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Expexcel) {
    var vm = $scope;
    vm.add = add;
    vm.awData = [];
    vm.scData = [];
    vm.countryData = [];
    vm.edit = edit;
    vm.exports = exports;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.peopleObj = {
      awType: '',
      scType: ''
    };
    vm.peopleData = [];
    vm.remove = remove;
    vm.search = search;
    vm.setAwData = setAwData;
    vm.setScData = setScData;
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

    getCountry();

    /**
     * 获取国家
     */
    function getCountry() {
      $rootScope.loading = true;
      restAPI.country.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.countryData = resp.data;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getPeopleData();
    }
    /**
     * 获取人数据
     */
    function getPeopleData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.people.peopleList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.peopleData = resp.rows || [];
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      obj.city = vm.peopleObj.city;
      obj.name = vm.peopleObj.name;
      obj.code = vm.peopleObj.code;
      obj.awType = vm.peopleObj.awType;
      obj.scType = vm.peopleObj.scType;
      return obj;
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
     * 新建
     */
    function add() {
      var addPeoplDialog = $modal.open({
        template: require('./addPeople.html'),
        controller: require('./addPeople.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加收发货人信息',
              countryData: vm.countryData,
              obj: {}
            };
          }
        }
      });
      addPeoplDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.people.savePeople.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加收发货人信息成功'
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
     * 导出excel
     */
    function exports() {
      var obj = getCondition();
      Expexcel.exp(obj, restAPI.people.exportExl);
    }
    /**
     * 编辑
     */
    function edit(item) {
      var editPeoplDialog = $modal.open({
        template: require('./addPeople.html'),
        controller: require('./addPeople.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑收发货人信息',
              countryData: vm.countryData,
              obj: {
                id: item.id,
                awType: item.awType,
                scType: item.scType,
                code: item.code,
                name: item.name,
                zipcode: item.zipcode,
                state: item.state,
                city: item.city,
                country: item.country,
                tel: item.tel,
                fax: item.fax,
                contacts: item.contacts,
                address: item.address,
                remarks: item.remarks
              }
            };
          }
        }
      });
      editPeoplDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.people.savePeople.save({}, data)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑收发货人信息成功'
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
     * 删除
     * 
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除收发货人信息：' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.people.delPeople.save({}, {
            id: id
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除收发货人信息成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
  }
];

module.exports = angular.module('app.agentOption.people', []).controller('peopleCtrl', people_fn);