'use strict';
module.exports = ['$scope', 'restAPI', '$modal','Auth','Notification','$rootScope',
	function ($scope, restAPI, $modal,Auth,Notification,$rootScope) {
		var vm = $scope;
		vm.pactlReceive = pactlReceive;
		vm.staticObj = {};
    getStatic();
    queryHistory();
    vm.differencesCount = 0;
    vm.recentlyHistory = [];
    vm.timeFlag = "";
    var moreFlag = 0
    vm.getMore = getMore
    vm.titleflag1=false;
    vm.titleflag2=false;
    vm.titleflag3=false;
    vm.titleflag4=false;
    vm.titleflag5=false;
    vm.titleflag6=false;
    vm.titleflag7=false;
    vm.titleflag8=false;
    vm.jiazaimore=true;
    vm.total = '';
		function getStatic() {
			restAPI.charts.statistics.save({}).$promise.then(function (resp) {
				//console.log(resp)
				if (resp.ok) {
          getCount();
					setStaticData(resp.data);
				}
			});
		}

		function setStaticData(params) {
			vm.staticObj = params;
    }
    
    function getCount() {

      restAPI.dataEdit.differencesCount.save({}).$promise.then(function (resp) {
    	  
				if (resp.ok) {
          vm.differencesCount = resp.data;
				}
			});
    }
  //获得年月日      得到日期oTime  
    function getMyDate(str){  
        var oDate = new Date(str),  
        oYear = oDate.getFullYear(),  
        oMonth = oDate.getMonth()+1,  
        oDay = oDate.getDate(),  
        oHour = oDate.getHours(),  
        oMin = oDate.getMinutes(),  
        oSen = oDate.getSeconds(),  
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间  
        return oTime;  
    };  
    //补0操作  
    function getzf(num){  
        if(parseInt(num) < 10){  
            num = '0'+num;  
        }  
        return num;  
    } 
    /***获取更多的最近记录****/
   function getMore(){
   	   event.stopPropagation();
   	    var obj = getCondition();
   	 	 moreFlag += 5;
   	    obj.rows=Number(obj.rows) + moreFlag +''
	restAPI.preJudice.queryHistory.save({}, obj)
				.$promise.then(function (resp) {
				if(resp.total<=moreFlag+5){
					vm.jiazaimore=false
				}
				vm.recentlyHistory = resp.rows;
				});
   }
   /****获取查询参数条件*****/
  function getCondition(){
  	var obj = {
        rows: '5',
        page: '1'
      }
  	return obj;
  }
    /***获取最近登陆的时间
     * 
     */
    /**
		 * 最近记录获取最近登陆的时间
		 */
		function queryHistory() {
			 var obj = getCondition();
			restAPI.preJudice.queryHistory.save({},obj)
				.$promise.then(function (resp) {
					   restAPI.dataEdit.getLastTime.save(Auth.getId()).$promise.then(function(resp){
						  if($rootScope.lastTimeFlag){
							  $rootScope.lastTimeFlag=false
						   if(resp.data){
							  vm.timeFlag=getMyDate(resp.data)
					           Notification.success({
					                message:'最近一次登陆   ： '+vm.timeFlag
					              });
						  
						   }
						  }	
						   sessionStorage.setItem('opened',Auth.getId());    
					    });
					   vm.total = resp.total
					vm.recentlyHistory = resp.rows;
				});
		}

    /**
     * pactl 收单
     */
    function pactlReceive() {
      vm.pactlReceiveDialog = $modal.open({
        template: require('../../pactl/receive/acceptance/search.html'),
        controller: require('../../pactl/receive/acceptance/search.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
      vm.pactlReceiveDialog.result.then(function (data) {

      }, function (resp) {
        vm.pactlReceiveDialog = '';
      });
    }		
	}
];