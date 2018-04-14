'use strict';

var billRule_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', 'Page', 'Auth',
  function($scope, restAPI, $modal, Notification, $rootScope, Page, Auth) {
    var vm = $scope;
    var opid = Auth.getUnitId();
    vm.add = add;
    vm.airData = [];
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.peopleData = [];
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.ruleData = [];
    vm.ruleObj = {};
    vm.search = search;

    getStation();

    /**
     * 获取货站
     */
    function getStation() {
      $rootScope.loading = true;
      restAPI.cargoStation.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.stationData = resp.data;
          getAirData();
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          getPeople();
        });
    }
    /**
     * 获取小组成员
     */
    function getPeople() {
      $rootScope.loading = true;
      restAPI.user.listUsersByUnit.query({
        opId: opid
        }, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.peopleData = resp;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getRuleData();
    }
    /**
     * 获取规则数据
     */
    function getRuleData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.rule.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.ruleData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      vm.ruleObj.goodsStation && (obj.goodsStation = vm.ruleObj.goodsStation.id);
      vm.ruleObj.fltCode && (obj.fltCode = vm.ruleObj.fltCode.airCode);
      vm.ruleObj.littleGroup && (obj.littleGroup = vm.ruleObj.littleGroup);
      vm.ruleObj.member && (obj.member = vm.ruleObj.member);
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新增
     */
    function add() {
      var addRuleDialog = $modal.open({
        template: require('./addRule.html'),
        controller: require('./addRule.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增审单任务分配规则信息',
              // airData: vm.airData,
              stationData: vm.stationData,
              peopleData: vm.peopleData,
              obj: {}
            };
          }
        }
      });
      addRuleDialog.result.then(function(data) {
        var obj = getData(data);
        restAPI.rule.editRule.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增审单任务分配规则成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function(resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(params) {
      var editRuleDialog = $modal.open({
        template: require('./addRule.html'),
        controller: require('./addRule.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑审单任务分配规则信息',
              // airData: vm.airData,
              stationData: vm.stationData,
              peopleData: vm.peopleData,
              obj: {
                goodsStation: params.goodsStation,
                littleGroup: params.littleGroup,
                member: params.memberId,
                fltCode: params.fltCode
              }
            };
          }
        }
      });
      editRuleDialog.result.then(function(data) {
        var obj = getData(data);
        obj.id = params.id;
        restAPI.rule.editRule.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '审单任务分配规则修改成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function(resp) {

      });
    }
    /**
     * 新增数据
     */
    function getData(params) {
      var obj = {};
      obj.littleGroup = params.littleGroup;
      obj.member = [];
      obj.memberId = [];
      obj.fltCode = [];
      obj.goodsStation = params.goodsStation.id;
      angular.forEach(params.member, function(v, k) {
        obj.member.push(v.fullname);
        obj.memberId.push(v.id);
      });
      angular.forEach(params.fltCode, function(v, k) {
        obj.fltCode.push(v.fltCode);
      });
      obj.member = obj.member.join(',');
      obj.memberId = obj.memberId.join(',');
      obj.fltCode = obj.fltCode.join(',');
      return obj;
    }
    /**
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + name,
              content: '你将要删除审单任务分配规则' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.rule.delRule.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除审单任务分配规则成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
  }
];

module.exports = angular.module('app.pactlOption.billRule', []).controller('billRuleCtrl', billRule_fn);