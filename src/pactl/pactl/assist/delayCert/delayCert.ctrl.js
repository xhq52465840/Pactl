'use strict';

var delayCert_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.agentData = [];
    vm.airData = [];
    vm.availableBookNo = [];
    vm.cargoTypeData = [];
    vm.certObj = {};
    vm.delay = delay;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.openDialog = openDialog;
    vm.search = search;
    vm.showData = showData;
    vm.showData1 = showData1;

    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getAgent();
    }
    /**
     * 获取鉴定机构
     */
    function getAgent() {
      $rootScope.loading = true;
      restAPI.officeInfo.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentData = resp.rows;
          getCargoType();
        });
    }
    /**
     * 获取货物类型
     */
    function getCargoType() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.cargoTypeData = resp.rows;
          getAirData();
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getCertData();
    }
    /**
     * 获取证书数据
     */
    function getCertData() {
      var obj = getCondition();
      $rootScope.loading = true;
      restAPI.book.querydelaylist.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.certData = resp.rows;
          angular.forEach(vm.certData, function (v, k) {
            v.srcArr = [];
            var showName = 'page0';
            var screenshotPage = v.pOfficeInfo.screenshotPage
            if(screenshotPage<(v.pFileRelations.length)){
            	showName = "page"+(screenshotPage-1)
            };
            angular.forEach(v.pFileRelations, function (m, n) {
              if (!/[pP][dD][fF]/.test(m.suffix)) {
                if (m.oldName === showName) {
                  v.filePath = m.fileHttpPath;
                  v.imgShow = false;
                  v.style1 = {
                    width: (v.pOfficeInfo && v.pOfficeInfo.wides || 0) + 'px',
                    height: (v.pOfficeInfo && v.pOfficeInfo.lengths || 0) + 'px',
                    position: 'absolute',
                    zoom: 1,
                    'z-index': 1001,
                    top: '55px',
										left: '-340px',
                    overflow: 'hidden'
                  };
                  v.style2 = {
                    position: 'absolute',
                    'z-index': 1000,
                    width: '879px',
										height: '1242px',
                    top: (v.pOfficeInfo && v.pOfficeInfo.yAxle || 0) + 'px',
                    left: (v.pOfficeInfo && v.pOfficeInfo.xAxle || 0) + 'px'
                  };
                }
                v.srcArr.push(m.fileHttpPath);
              } else {
                v.pdfPath = m.fileHttpPath;
              }
            });
            var pAirLineDelays = [];
            angular.forEach(v.pAirLineDelays, function (m, n) {
              m.days && pAirLineDelays.push(m);
            });
            v.pAirLineDelays = pAirLineDelays;
          });
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
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      if (vm.certObj.bookNo && vm.certObj.bookNo.length) {
        obj.bookNo = vm.certObj.bookNo.join(";").replace(/\s/g, '');
      }
      if (vm.certObj.air) {
        obj.alId = vm.certObj.air.alId;
      }
      if (vm.certObj.officeCode) {
        obj.officeCode = vm.certObj.officeCode.officeCode;
      }
      if (vm.certObj.cargoType) {
        obj.goodsType = vm.certObj.cargoType.id;
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
     * 延期
     */
    function delay(param) {
      if (param.airLines.length) {
        var addDelayDialog = $modal.open({
          template: require('./delayDialog.html'),
          controller: require('./delayDialog.ctrl.js'),
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '延期',
                airLines: param.airLines,
                pAirLineDelays: param.pAirLineDelays
              };
            }
          }
        });
        addDelayDialog.result.then(function (data) {
          var obj = angular.copy(data);
          angular.forEach(obj, function (v, k) {
            v.booksId = param.pAgentShareBook.bookId;
          });
          restAPI.book.delayAirline2.save({}, obj)
            .$promise.then(function (resp) {
              if (resp.ok) {
                search();
                Notification.success({
                  message: '延期成功'
                });
              } else {
                Notification.error({
                  message: resp.msg
                });
              }
            });
        }, function (resp) {

        });
      } else {
        var delTagDialog = $modal.open({
          template: require('../../../remove/remove.html'),
          controller: require('../../../remove/remove.ctrl.js'),
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '不能进行延期',
                content: '当前鉴定机构没有使用航空公司，不能进行延期操作'
              };
            }
          }
        });
      }
    }
    /**
     * 显示航空公司
     */
    function showData(params) {
      var dataDialog = $modal.open({
        template: require('./showData.html'),
        controller: require('./showData.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '适用航空公司',
              obj: params
            };
          }
        }
      });
    }
    /**
     * 显示航空公司
     */
    function showData1(params) {
      var dataDialog = $modal.open({
        template: require('./showData1.html'),
        controller: require('./showData.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '延期结果',
              obj: params
            };
          }
        }
      });
    }
    /**
     * 显示pdf
     */
    function openDialog(params) {
      var pdfDialog = $modal.open({
        template: require('../../../showPDF/showPDF.html'),
        controller: require('../../../showPDF/showPDF.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return params;
          }
        }
      });
    }
  }
];

module.exports = angular.module('app.pactlAssist.delayCert', []).controller('delayCertCtrl', delayCert_fn);