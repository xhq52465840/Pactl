'use strict';

module.exports = ['$document', '$uiViewScroll', '$timeout',
  function ($document, $uiViewScroll, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrls) {
        // $document.scrollTop(0, 5000);
        $timeout(function () {
          $uiViewScroll(element);
        }, 500);
      }
    }
  }
];