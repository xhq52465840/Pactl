'use strict';

module.exports = ['$scope','restAPI','$modal','Auth','Notification','$rootScope',
	function ($scope,restAPI,$modal,Auth,Notification,$rootScope) {
		var vm = $scope;
		 getLastTime();
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
	    };
		function getLastTime(){
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
		}

	}
];