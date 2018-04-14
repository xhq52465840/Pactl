'use strict';

module.exports = ['$scope', 'restAPI', 'Notification', '$rootScope','$compile','Auth','ipCookie',
	function($scope, restAPI, Notification, $rootScope,$compile,Auth,ipCookie) {
		var vm = $scope;
		vm.staticObj = {};
		vm.lineObj = {};
		vm.listNumber='';
		vm.xianshi=false;
		vm.getD=getD;
		vm.nowTime="";
		getStatic();
		getTitle();
		getData();
		vm.showpicture=false;
		getNowTime();
		 function getzf(num){  
		        if(parseInt(num) < 10){  
		            num = '0'+num;  
		        }  
		        return num;  
		    } 
		function getNowTime(){
			var oDate = new Date();
			 var Shi =  getzf(oDate.getHours());
	         var Fen =  getzf(oDate.getMinutes());
	         vm.nowTime=Shi+'  :  '+Fen
		}
		function getStatic() {
			restAPI.charts.agentStatistics.save({}).$promise.then(function(resp) {
				if (resp.ok) {
					setStaticData(resp.data);
				}
			});
		}

		function setStaticData(params) {
			vm.staticObj = params;
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
	    //
	    //if(localStorage.getItem("ewWaybillNumber")){
		//	vm.showpicture=true;
		//	vm.xianshi=true;
	    //	vm.listNumber=localStorage.getItem("ewWaybillNumber")
		//	}
	    //获取未处理订单数据
	    getD();
	    function getD(){
	    	$.ajax({
	    		type:"POST",
	    		url:'/api/pactl/scheck/toBeSubmitted',
	    		async:false,
	    		dataType:'json',
	    		success:function(data){
	    		ipCookie("xiaoLD","1");
	    		if(data.data.eWaybill){
	    			vm.showpicture=true;
	    			vm.xianshi=true;
	    			vm.listNumber=data.data.eWaybill;	    			
	    			if(Auth.getUnitType()=='agency'){
	    				ipCookie("xiaoLD","0")
	    				
	    			}
	    		}
	    		}
	    	})
	    	/*localStorage.setItem('aa','1') http://localhost:90/api/pactl/scheck/toBeSubmitted
	    	 * http://localhost:90/scheck/toBeSubmitted
	    	restAPI.UIdisplay.beSubmitted.save().$promise.then(function(resp){
	    		//$rootScope.showThis="1";
	    		ipCookie("xiaoLD","1");
	    		if(resp.data.eWaybill){
	    			vm.showpicture=true;
	    			vm.xianshi=true;
	    			vm.listNumber=resp.data.eWaybill;	    			
	    			if(Auth.getUnitType()=='agency'){
	    				//$rootScope.showThis="0";
	    				ipCookie("xiaoLD","0")
	    				
	    			}
	    		}
	    	})*/
	    };
		function getTitle() {
			$rootScope.loading = true;
			restAPI.UIdisplay.queryAll.save({}, {})
				.$promise.then(function(resp) {
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
					$rootScope.loading = false;
					vm.title = resp.data.title;
					//vm.contents = resp.data.content && resp.data.content.split('\n');
					vm.contentsSrc = resp.data.content && resp.data.content.replace(/\n/g,"<br/>");
				});
		}

		function getData() {
			restAPI.charts.agentApproachQueue.save({}).$promise.then(function(resp) {
				if (resp.ok) {
					vm.lineObj.waybillPercentage = (resp.data.waybillPercentage || 0) + '%';
					vm.lineObj.waybill = {
						width: vm.lineObj.waybillPercentage,
						'background-color': '#db542d'
					};
					vm.lineObj.weightPercentage = (resp.data.weightPercentage || 0) + '%';
					vm.lineObj.weight = {
						width: vm.lineObj.weightPercentage,
						'background-color': '#1495cf'
					};
				} else {
					Notification.error({
						message: '获取进场指数失败'
					});
				}
			});
		}
	}
];