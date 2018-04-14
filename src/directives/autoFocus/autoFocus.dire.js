'use strict';

module.exports = ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr, ctrls, transcludeFn) {
				if (scope.$eval(attr.autoFocus) !== false) {
					var ele = element[0];
					$timeout(function() {
						ele.focus();
					}, 500);
				}
			}
		}
	}
];