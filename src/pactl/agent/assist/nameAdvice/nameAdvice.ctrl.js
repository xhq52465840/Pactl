'use strict';

var nameAdvice_fn = ['$scope', 'Page', 'restAPI', '$rootScope', '$state',
  function($scope, Page, restAPI, $rootScope, $state) {
    var vm = $scope;
    vm.airportData = [];
    vm.addrefer = addrefer;
    vm.onlyEn = onlyEn;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.refer = {};
    vm.rowCollection = [];
    vm.refreshDest = refreshDest;
    vm.search = search;

    getStatus();

    /**
     * 获取状态
     */
    function getStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476067968303634'
        })
        .$promise.then(function(resp) {
          vm.statusData = resp.rows;
          /**
           * 首次进来默认选择“咨询中”状态的品名咨询
           */
          angular.forEach(vm.statusData, function(v, k) {
            if (v.id === '103' || v.id === '104') {
              v.checked = true;
            }
          });
          search();
        });
    }
    /**
     * 获取目的港（机场）
     */
    function getAirportData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function(resp) {
          angular.forEach(resp.data, function(v, k) {
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
          search();
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
      restAPI.nameAdvice.nameAdviceSet.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.rowCollection = setStatus(resp.rows);
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 转换状态
     */
    function setStatus(data) {
      angular.forEach(data, function(v, k) {
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
      angular.forEach(vm.statusData, function(v, k) {
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
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新建品名咨询
     */
    function addrefer() {
      $state.go("agentAssist.refer");
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
    /**
     * 查询机场
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
          angular.forEach(resp.rows, function(v, k) {
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
  }
];

module.exports = angular.module('app.agentAssist.nameAdvice', []).controller('nameAdviceCtrl', nameAdvice_fn);