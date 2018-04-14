'use strict';

var statement_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope','$sce','$timeout','$stateParams',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope,$sce,$timeout,$stateParams) {
    var vm = $scope;
    vm.iframeCallBack = iframeCallBack;
    vm.trustSrc = trustSrc;
    vm.url = $stateParams.url;
    vm.title = $stateParams.resName;

    $rootScope.loading = true;

    function iframeCallBack() {
      var iframe = document.getElementById('statement_iframe'),
      ifarame_window = iframe.contentWindow,
      ifarame_window_document = ifarame_window.document,
      $table = $(document.getElementById('report1'));
      $table.css('width', '100%');
			$timeout(function() {
				$rootScope.loading = false;
			}, 1000);
    }
    
    		/**
		 * 
		 */
		function trustSrc(src) {
			return $sce.trustAsResourceUrl(src);
		}
  }
];

module.exports = angular.module('app.reports.statement', []).controller('statementCtrl', statement_fn);