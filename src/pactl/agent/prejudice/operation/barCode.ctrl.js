'use strict';

var certCode_fn = ['$scope', '$rootScope', 'restAPI', '$stateParams', '$window', 'Notification',
	function($scope, $rootScope, restAPI, $stateParams, $window, Notification) {
		var vm = $scope;
		vm.certData = [];
		vm.ids3 = [];
		vm.printCode = printCode;
		getBarCode()
		/***
		 *生成条形码
		 * 
		 * 
		 **/

		function getBarCode() {
			//获取运单号和awId
			var params = [],
				barCodeArr = [],
				waybillNoArr = [],
				awIdArr = [];
			for(var i in $stateParams.printCode.split(';')) {
				awIdArr.push({
					awId: $stateParams.printCode.split(';')[i]
				})
			}
			for(var i in $stateParams.printCode1.split(';')) {
				params.push({
					id: $stateParams.printCode1.split(';')[i]
				})
				waybillNoArr.push($stateParams.printCode1.split(';')[i])
			}
			//通过运单号得到条形码
			restAPI.code.onebarcodes.save({}, params)
				.$promise.then(function(resp) {
					console.log(resp)
					for(var k in resp.data) {
						barCodeArr.push({
							src: 'data:image/jpeg;base64,' + resp.data[k]
						})
					}
				}).then(function(){
								setTimeout(function(){
				angular.forEach(awIdArr, function(v, k) {
//				console.log(barCodeArr)
//				console.log(k)
				restAPI.bill.billAudit2.save({}, v).$promise.then(function(resp) {

					var dataInfo = {}
					//目的港：data.pAirWaybillInfo.airportDest //ng-if="item.pAirWaybillInfo.type==='0'"
					//目的港 ：data.pAirWaybillInfo.dest1 // ng-if="item.pAirWaybillInfo.type==='1'"
					//件数：data.pAirWaybillInfo.rcpNo
					//重量：data.pAirWaybillInfo.grossWeight
					console.log(k)
					dataInfo.airportDest = resp.data.pAirWaybillInfo.airportDest;
					dataInfo.rcpNo = resp.data.pAirWaybillInfo.rcpNo;
					dataInfo.grossWeight = resp.data.pAirWaybillInfo.grossWeight;
					dataInfo.barCode = barCodeArr[k]; 
					dataInfo.Number = waybillNoArr[k];
					vm.certData.push(dataInfo);
				})
				
			})
			},500)
				})
			//给每个对象赋值


		
		}
		/**
		 * 打印
		 */
		function printCode() {
			$window.print();
		}
	}
];

module.exports = angular.module('app.agentPrejudice.barCode', []).controller('barCodeCtrl', certCode_fn);