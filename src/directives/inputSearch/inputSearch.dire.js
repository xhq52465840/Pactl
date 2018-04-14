'use strict';

module.exports = ['$document', '$parse', '$timeout',
  function ($document, $parse, $timeout) {
    return {
      restrict: 'EA',
      template: require('./inputSearch.html'),
      require: '^ngModel',
      scope: {
        result: '='
      },
      compile: function (tElement, tAttrs) {
        var input = tElement.find('input');
        if (tAttrs.placeholder) {
          input.attr('placeholder', tAttrs.placeholder)
        }
        return function (scope, element, attrs, ctrls) {
          var $ul = element.find('ul');
          var ngModel = ctrls;
          scope.onSelectCallback = $parse(attrs.onSelect);
          scope.open = false;
          scope.search = '';
          scope.items = [];
          scope.selectItem = function (params) {
            scope.search = params;
            $timeout(function () {
              scope.open = false;
            });
          }
          scope.$watch('search', function (newVal) {
            ngModel.$setViewValue(newVal);
          });
          input.on('click', function () {
            $timeout(function () {
              scope.onSelectCallback(scope.$parent, {
                $data: ''
              });
              scope.open = true;
            });
          });
          ngModel.$render = function () {
            scope.search = ngModel.$viewValue;
          };
          scope.$watch('result', function (newVal) {
            if (newVal) {
              scope.items = newVal
            }
          });
          $document.on('click', onDocumentClick);
          scope.$on('$destroy', function () {
            $document.off('click', onDocumentClick);
          });

          function onDocumentClick(e) {
            var contains = false;
            if (window.jQuery) {
              contains = window.jQuery.contains(element[0], e.target);
            } else {
              contains = element[0].contains(e.target);
            }
            if (!contains) {
              scope.$apply(function () {
                scope.open = false;
                scope.items = [];
              })
            }
          }
        }
      }
    }
  }
];