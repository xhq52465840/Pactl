'use strict';

var auditCert_fn = ['$scope', 'Page', 'restAPI', '$modal', '$rootScope', '$state',
  function ($scope, Page, restAPI, $modal, $rootScope, $state) {
    var vm = $scope;
    vm.audit = audit;
    vm.auditFlagData = [];
    vm.certObj = {};
    vm.certData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.openDialog = openDialog;

    getAuditFlag();

    /**
     * 获取所有的证书状态
     */
    function getAuditFlag() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476351912155583'
        })
        .$promise.then(function (resp) {
          angular.forEach(resp.rows, function (v, k) {
            v.auditType = 'F';
            vm.auditFlagData.push(v);
          });
          restAPI.baseData.queryAll.save({}, {
              type: '1476351925540465'
            })
            .$promise.then(function (resp) {
              angular.forEach(resp.rows, function (v, k) {
                v.auditType = 'S';
                vm.auditFlagData.push(v);
              });
              search();
            });
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
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.book.aduitList.save({}, obj)
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
                if (m.oldName === showName ) {
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
      obj.bookNo = vm.certObj.bookNo;
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 开始审核
     */
    function audit() {
      $state.go('pactlAssist.auditCertDetail');
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

module.exports = angular.module('app.pactlAssist.auditCert', []).controller('auditCertCtrl', auditCert_fn);