'use strict';

var nameAdvice_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $state) {
    var vm = $scope;
    var selected = [];
    var canSelect = 0;
    vm.addstatus = false;
    vm.airportData = [];
    vm.allselect = allselect;
    vm.allselected = false;
    vm.clickgoodId = clickgoodId;
    vm.forbidden = forbidden;
    vm.onlyEn = onlyEn;
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();
    vm.rowCollection = [];
    vm.refer = {};
    vm.search = search;
    vm.singleCheck = singleCheck;
    vm.refreshDest = refreshDest;

    getStatus();

    /**
     * 获取状态
     */
    function getStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476861982059916'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.statusData = resp.rows;
          /**
           * 首次进来默认选择“咨询中”状态的品名咨询
           */
          angular.forEach(vm.statusData, function (v, k) {
            if (v.id === '103') {
              v.checked = true;
            }
          });
          search();
        });
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
        .$promise.then(function (resp) {
          vm.airportData = resp.rows;
        });
    }
    /**
     * 获取目的港（机场）
     */
    function getAirportData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function (resp) {
          angular.forEach(resp.data, function (v, k) {
            vm.airportData.push({
              cityCode: v.cityCode,
              cityName: v.cityName,
              countryCode: v.countryCode,
              stateCode: v.stateCode,
              airportCode: v.airportCode,
              airportName: v.airportName,
              iataArea: v.iataArea
            });
          });
        });
    }
    /**
     * 查询按钮
     */
    function search() {
      getCertData();
    }
    /**
     * 获取证书数据
     */
    function getCertData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.pactlAdvice.editAdviceSet.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.rowCollection = setStatus(resp.rows);
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 转换状态
     */
    function setStatus(data) {
      canSelect = 0;
      angular.forEach(data, function (v, k) {
        switch (v.pGoodsAdvice.status) {
          case '101':
            v.add = true;
            break;
          case '103':
            v.ask = true;
            break;
          case '104':
            v.answer = true;
            break;
          case '105':
            v.quotable = true;
            break;
          case '106':
            v.forbidden = true;
            break;
        }
        v.pGoodsAdvice.result = v.pGoodsAdvice.result ? JSON.parse(v.pGoodsAdvice.result) : [];
        if (v.pGoodsAdvice.status !== '106') {
          canSelect++;
        }
      });
      return data;
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        "namesEn": vm.refer.namesEn,
        "goodsId": vm.refer.goodsId,
        "status": [],
        "dest": vm.refer.dest && vm.refer.dest.airportCode,
        "rows": vm.page.length,
        "page": vm.page.currentPage,
        "orderBy": "MODIFIED_DATE DESC"
      };
      angular.forEach(vm.statusData, function (v, k) {
        if (v.checked) {
          obj.status.push(v.id);
        }
      });
      obj.status = obj.status.join(';');
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      vm.allselected = false;
      selected = [];
      Page.pageChanged(vm.page, search);
    }
    /**
     * 跳转品名咨询详情
     */
    function clickgoodId(goodsId) {
      $state.go('pactlAssist.reply', {
        'goodsId': goodsId,
      });
    };
    /**
     * 全选事件
     */
    function allselect($e) {
      var checkbox = $e.target;
      selected = [];
      angular.forEach(vm.rowCollection, function (v, k) {
        if (v.pGoodsAdvice.status !== '106') {
          v.checked = checkbox.checked;
          if (checkbox.checked) {
            selected.push(v.pGoodsAdvice.goodsId);
          }
        }
      });
      vm.allselected = checkbox.checked;
    }
    /**
     * 单选
     */
    function singleCheck($e, data) {
      var checkbox = $e.target,
        id = data.pGoodsAdvice.goodsId,
        index = selected.indexOf(id);
      data.checked = checkbox.checked;
      data.checked ? selected.push(id) : selected.splice(index, 1);
      vm.allselected = (selected.length === canSelect);
    }
    //禁用
    function forbidden() {
      if (!selected.length) {
        Notification.error({
          message: '禁用前请先勾选咨询编号!'
        });
        return false;
      }
      var selects = selected.join(",");
      var forbidDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '禁用：' + selects,
              content: '你将要禁用品名咨询' + selects + '。此操作不能恢复。'
            };
          }
        }
      });
      forbidDialog.result.then(function () {
        restAPI.refer.forbidden.save({}, {
          goodsId: selects,
          status: '106'
        }).$promise.then(function(resp) {
          if (resp.ok) {
            Notification.success({
              message: '禁用品名咨询成功'
            });
            selected = [];
            search();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
      }, function () {

      })
    }
    /**
     * 不能输入中文
     */
    function onlyEn() {
      try {
        vm.refer.namesEn = vm.refer.namesEn.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
  }
];

module.exports = angular.module('app.pactlAssist.nameAdvice', []).controller('nameAdviceCtrl', nameAdvice_fn);