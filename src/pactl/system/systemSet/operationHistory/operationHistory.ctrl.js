'use strict';

var senior_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
     vm.page = Page.initPage();
     vm.pageChanged = pageChanged;
     vm.history={}
     vm.search = search;
     vm.historyData = [];
     vm.typeData=[
     			{name:"审单宝典",operationClass:"InspectionRulesServiceImpl.class"},
     			{name:"品名大数据",operationClass:"PAirGoodsWhiteListServiceImpl.class"},
     			{name:"货站审单任务分配规则设置",operationClass:"StationCheckAllotRuleServiceImpl.class"},
     			{name:"货站管理",operationClass:"PSecondCheckServiceImpl.class"},
     			{name:"鉴定机构维护",operationClass:"OfficeInfoServiceImpl.class"},
     			{name:"证书邮件地址",operationClass:"CertificateMailAddrServiceImpl.class"},
     			{name:"代理预审上传文件",operationClass:"PPreagencyfileUploadServiceImpl.class"},
     			{name:"收单补交文件",operationClass:"CollectbillCheckFileServiceImpl.class"},
     			{name:"收单标签管理",operationClass:"ReceivingWaybillMarkServiceImpl.class"},
     			{name:"特货代码",operationClass:"SpecialCargoCodeServiceImpl.class"},
     			{name:"货币",operationClass:"CurrencyServiceImpl.class"},
     			{name:"安检机管理",operationClass:"PSecondCheckServiceImpl.class"},
     			{name:"安检章类型",operationClass:"PSecondCheckServiceImpl.class"},
     			{name:"危险品分类",operationClass:"PSecondCheckServiceImpl.class"},
     			{name:"正式运单规则选项",operationClass:"FormalWaybillRuleServiceImpl.class"},
     			{name:"预审邮件提醒",operationClass:"PreMailReminderServiceImpl.class"},
     			{name:"安全",operationClass:"PAgentAccessServiceImpl.class"},
     			{name:"界面显示设置",operationClass:"AgentIndexServiceImpl.class"},
     			{name:"平台收发报设置",operationClass:"MsgSendSetServiceImpl.class"},
     			{name:"报文基础设置",operationClass:"MsgBaseSetServiceImpl.class"},
     			{name:"消息模板",operationClass:"MsgTemplateServiceImpl.class"},
     			{name:"通用业务参数",operationClass:"SystemSettingsServiceImpl.class"},
     			{name:"运单校验字段",operationClass:"PactlPretrialRequiredServiceImpl.class"},
     			{name:"适用的鉴定机构",operationClass:"ApplyAirLineServiceImpl.class"},
     			{name:"运单字段分类",operationClass:"WaybillFieldSortServiceImpl.class"},
     			{name:"运单字段维护",operationClass:"WaybillFieldMaintainServiceImpl.class"},
     			{name:"运单校验分类",operationClass:"CheckSortServiceImpl.class"},
     			{name:"收单允许差异/参数设置",operationClass:"AirParamServiceImpl.class"},
     			{name:"航空公司",operationClass:"ApplyAirLineServiceImpl.class"},
     			{name:"接收航空公司电子运单报文地址",operationClass:"AirMessageAddressServiceImpl.class"},
     			{name:"国家",operationClass:"PCountryServiceImpl.class"},
     			{name:"扣押库",operationClass:"PSecondCheckServiceImpl.class"},
     			{name:"机场",operationClass:"AirportServiceImpl.class"},
     			{name:"邮件",operationClass:"EmailManageServiceImpl.class"}
     			
     
     ]
    /**
     * 高级查询
     */
    function search() {
    	 $rootScope.loading = true;
    if(valid()){
    	      var obj = getCondition()
      restAPI.systemSet.queryHistory.save({}, obj).$promise.then(function (resp) {
      	if(!resp.msg){
      		vm.historyData=resp.rows
      	Page.setPage(vm.page, resp);
      	}else{
      		  Notification.error({
          message: resp.msg
        });
      	}
      });
    }
     

      $rootScope.loading = false;
    }
    /**
     * 校验分类必填
     */
    function valid() {
      if (vm.history.type) {
        return true;
      } else {
        Notification.error({
          message: '请先选择历史记录分类'
        });
        return false;
      }
    }
	/**获取查询条件**/
	function getCondition(){
		var obj = {
				rows: vm.page.length,
        page: vm.page.currentPage
		};
		obj.operationClass=vm.history.type.operationClass
		return obj
	}
	  /**
     * 翻页
     */
   function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
  }
];

module.exports = angular.module('app.systemSet.operationHistory', []).controller('operationHistoryCtrl', senior_fn);