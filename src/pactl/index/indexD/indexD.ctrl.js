'use strict';

module.exports = ['$scope', 'restAPI', 'Notification', '$rootScope', '$filter','Auth',
	function ($scope, restAPI, Notification, $rootScope, $filter,Auth) {
		var vm = $scope;
		vm.lineObj = {};
		vm.staticObj = {};
		vm.date = {};

		getData();
		getStatic();
		getDate();

		function getStatic() {
			restAPI.airline.statistics.save({}).$promise.then(function (resp) {
				if (resp.ok) {
					vm.staticObj = resp.data;
				}
			});
		}

		function getData() {
			restAPI.airline.approachQueue.save({}).$promise.then(function (resp) {
				
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
		function getDate() {
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
			var now = new Date();
			vm.date.today = $filter('date')(now.getTime(), 'yyyy-MM-dd');
			vm.date.tommorrow = $filter('date')(now.getTime() + 1000 * 60 * 60 * 24, 'yyyy-MM-dd');
			vm.date.tommorrow2 = $filter('date')(now.getTime() + 1000 * 60 * 60 * 24 * 2, 'yyyy-MM-dd');
			vm.date.yesterday = $filter('date')(now.getTime() - 1000 * 60 * 60 * 24, 'yyyy-MM-dd');
		}
	}
];