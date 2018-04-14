'use strict';

module.exports = ['$document', '$interval',
  function($document, $interval) {
    return {
      restrict: 'A',
      scope: {
        callBack: '&iframeOnload'
      },
      link: function(scope, element, attrs) {
        element.on('load', function(event) {
          return scope.callBack();
        });
      }
    }
  }
];