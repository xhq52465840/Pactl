'use strict';

var agency_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.agentData = [];
    vm.agentObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.statusData = [];

    initCondition();
    search();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getStatus();
    }
    /**
     * 获取状态
     */
    function getStatus() {
      vm.statusData = [{
        id: '',
        name: '全部'
      }, {
        id: '1',
        name: '有效'
      }, {
        id: '0',
        name: '无效'
      }];
    }
    /**
     * 查询
     */
    function search() {
      getAgentData();
    }
    /**
     * 获取鉴定机构
     */
    function getAgentData() {
      var obj = getCondition();
      $rootScope.loading = true;
      restAPI.officeInfo.queryAll.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentData = resp.rows;
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
      if (vm.agentObj.officeCode) {
        obj.officeCode = vm.agentObj.officeCode;
      }
      if (vm.agentObj.shortName) {
        obj.shortName = vm.agentObj.shortName;
      }
      if (vm.agentObj.officeName) {
        obj.officeName = vm.agentObj.officeName;
      }
      if (vm.agentObj.status) {
        obj.status = vm.agentObj.status.id;
      }
      return obj;
    }
    /**
     * 新增
     */
    function add() {
      var addAgentDialog = $modal.open({
        template: require('./addAgency.html'),
        controller: require('./addAgency.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增鉴定机构',
              obj: {

              }
            };
          }
        }
      });
      addAgentDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.pOfficeInfo = data;
        obj.pGoodsTypeDelays = [];
        obj.airLineDelayVos = [];
        restAPI.officeInfo.addOffice.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加鉴定机构成功'
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
  }
];

module.exports = angular.module('app.pactlOption.agency', []).controller('agencyCtrl', agency_fn);