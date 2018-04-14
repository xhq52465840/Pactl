'use strict';

var receivedMessage_fn = ['$scope', 'Page', 'restAPI', '$modal', '$rootScope', '$state',
	function($scope, Page, restAPI, $modal, $rootScope, $state) {
		var vm = $scope;

	}
];

module.exports = angular.module('app.pactlAssist.receivedMessage', []).controller('receivedMessageCtrl', receivedMessage_fn);