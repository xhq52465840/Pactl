'use strict';

module.exports = ['$compile',
  function ($compile) {
    return {
      restrict: 'EA',
      link: function (scope, element, attr, ctrls, transcludeFn) {
        scope.$watch(function (scope) {
          return scope.$eval(attr.compile);
        }, function (value) {
          if (value) {
            element.html(value);
            $compile(element.contents())(scope);
          }
        })
      }
    }
  }
];