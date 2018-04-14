'use strict';

module.exports = ['$document', '$parse',
  function ($document, $parse) {
    return {
      restrict: 'EA',
      link: function (scope, element, attr, ctrls, transcludeFn) {
        var fn = $parse(attr.doSearch);
        element.on("keydown", function (event) {
          var callback = function () {
            fn(scope, {
              $event: event
            });
          }
          var keyCode = event.keyCode || event.which;
          if (keyCode === 13) {
            scope.$apply(callback);
          }
        });
      }
    }
  }
];