'use strict';

module.exports = ['$timeout', '$parse',
  function ($timeout, $parse) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        myOnChange: '&'
      },
      link: function (scope, element, attrs, ngModelCtrl) {
        function getCursorPos(inpObj) {
          if (typeof inpObj.selectionStart !== 'number') {
            var range = document.selection.createRange();
            if (range === null) {
              return 0;
            }
            var re = inpObj.createTextRange();
            var rc = re.duplicate();
            re.moveToBookmark(range.getBookmark());
            rc.setEndPoint('EndToStart', re);
            return rc.text.length;
          } else {
            return inpObj.selectionStart;
          }
        }

        function setCursorPos(inpObj, pos) {
          if (!inpObj.setSelectionRange) {
            var textRange = inpObj.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd('character', pos);
            textRange.moveStart('character', pos);
            textRange.select();
          } else {
            inpObj.setSelectionRange(pos, pos);
          }
        }

        function doText(ele, pos) {
          setCursorPos(ele, pos)
          ele.focus();
        }
        var length, pos;
        scope.$watch(function () {
          return ngModelCtrl.$modelValue;
        }, function (newVal, oldVal) {
          var ele = element[0];
          if (document.activeElement !== ele) return;
          if (newVal != oldVal && angular.isUndefined(length) && angular.isUndefined(pos)) {
            length = element.val().length;
            pos = getCursorPos(ele);
            if (scope.myOnChange) {
              $parse(scope.myOnChange)();
            }
            $timeout(function () {
              var currentValue = element.val();
              var length1 = currentValue.length;
              if (length === length1) {
                doText(ele, pos);
              } else {
                doText(ele, pos - (length - length1));
              }
              length = undefined;
              pos = undefined;
            }, 0);
            ele.blur();
          }
        })
      }
    }
  }
];