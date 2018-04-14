'use strict';

module.exports = ['$document', '$window',
  function ($document, $window) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var ele = element[0];
        // offset = getOffset();
        scope.$watch(function () {
          return ngModelCtrl.$modelValue;
        }, function (newVal, oldVal) {
          var newheight = 0;
          if (newVal) {
            ele.style.overflowY = 'hidden';
            ele.style.height = 'auto';
            newheight = ele.scrollHeight;
          }
          ele.style.height = newheight + 'px';
        })

        function getOffset() {
          var props = ['paddingTop', 'paddingBottom'],
            offset = 0,
            style;
          if ($window.getComputedStyle) {
            style = $window.getComputedStyle(ele, null)
          } else {
            style = ele.currentStyle;
          }

          for (var i = 0; i < props.length; i++) {
            offset += parseInt(style[props[i]]);
          }
          return offset;
        }
      }
    }
  }
];