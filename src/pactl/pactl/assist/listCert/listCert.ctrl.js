'use strict';

var listCert_fn = ['$scope', 'restAPI', '$rootScope', 'Page', '$filter', '$modal',
  function ($scope, restAPI, $rootScope, Page, $filter, $modal) {
    var vm = $scope;
    vm.certObj = {};
    vm.certData = [];
    vm.goodTypeData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.openDialog = openDialog;
    vm.updown=true;
    vm.updown1=true;
    vm.changeupdown=changeupdown;
    vm.changeupdown1=changeupdown1;
    vm.proxyObj = {};
    vm.cargoChange=cargoChange
    vm.years=[];
    vm.cargo='';
    vm.year='';
    search();
    getCargoType();
    initCondition();
    /**
     * 初始化查询条件
     */
    function initCondition() {
      getOffice();
      //getYear()
      var myDate= new Date(); 
  	var startYear=myDate.getFullYear()-10;//起始年份 
  	var endYear=myDate.getFullYear()+30;//结束年份 
  	var obj=document.getElementById('myYear') 
  	for (var i=startYear;i<=endYear;i++)  
  	{ 
  		vm.years.push(i)
  	} 
  	//console.log(vm.years)
  	
    }
    /***
     * 改变三角形大小并排序
     * 
     * **/
    function changeupdown(){
    	vm.updown=!vm.updown;
    	
    }
    function changeupdown1(){
    	vm.updown1=!vm.updown1;
    	
    }
    /*****
     * 锂电池或者普货
     * 
     * **/
    function cargoChange(){
    	console.log(vm.cargo)
    }
    /**
     * 获取鉴定机构
     */
    function getOffice() {
      $rootScope.loading = true;
      restAPI.officeInfo.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.officeCodeData = resp.rows;
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
      restAPI.book.bookPactlList.save({}, obj)
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
            v.table = '<table class="table content-main-table" style="width: 600px;"><thead><tr><th class="w15">代理</th><th class="w30">授权书流水号</th><th class="w15">无授权书</th><th class="w30">可使用时间</th><th class="w10">状态</th></tr></thead><tbody>';
            angular.forEach(v.pAgentShareBookAccredits, function (v1, k1) {
              v.table += '<tr>' +
                '<td>' + v1.agentSales + '</td>' +
                '<td>' + v1.authBookSerialNo + '</td>' +
                (v1.authBookFlag === '1' ? '<td><i class="i-yes"></i></td>' : '<td></td>') +
                '<td>' + $filter('date')(v1.startTime, 'yyyy/MM/dd') + '-' + $filter('date')(v1.endTime, 'yyyy/MM/dd') + '</td>' +
                '<td>' + (v1.status === '0' ? '启用' : '禁用') + '</td>' +
                '</tr>';
            });
            v.table += '</tbody></table>';
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
      obj.bookSerialNumber = vm.certObj.bookSerialNumber;
      obj.authBookSerialNo = vm.certObj.authBookSerialNo;
      //vm.proxyObj.goodType.id={}
      if (vm.proxyObj.goodType && vm.proxyObj.goodType.id) {
          obj.goodsType = vm.proxyObj.goodType.id;
        }
      obj.validityYear=vm.year;
      if (vm.proxyObj.officeCode && vm.proxyObj.officeCode.ocId) {
          obj.ocId = vm.proxyObj.officeCode.ocId;
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
     * 获取所有货物类型
     */
    function getCargoType() {
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function (resp) {
          vm.goodTypeData = resp.rows;
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

module.exports = angular.module('app.pactlAssist.listCert', []).controller('listCertCtrl', listCert_fn);