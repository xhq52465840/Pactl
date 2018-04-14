'use strict';

var showMasterbill_fn = module.exports = ['$scope', '$stateParams',
	function ($scope, $stateParams) {
		var vm = $scope;
    	vm.waybillNo = $stateParams.waybillNo;
	}
];

module.exports = angular.module('app.pactlPrejudice.showMasterbill', []).controller('showMasterbillCtrl', showMasterbill_fn);