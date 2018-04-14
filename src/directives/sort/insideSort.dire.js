'use strict';

module.exports = ['$document', '$interval',
  function ($document, $interval) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrls) {
        scope.sortObj = {
          name: '',
          sort: 'desc'
        };
        var sortName = attrs.insideSort,
          classDesc = 'i-descClass',
          classAsc = 'i-ascClass',
          classDefault = 'i-defaultClass',
          index = 0;

        if (sortName) {
          element.append('<i class="i-defaultClass"></i>');
        }

        element.bind('click', function sortClick() {
          if (sortName) {
            scope.sortObj.name = sortName;
            scope.sortObj.sort = index % 2 === 0 ? 'desc' : 'asc';
            scope.$apply();
          }
        });

        scope.$watch('sortObj', function (newValue) {
          if (newValue.name !== sortName) {
            index = 0;
            element.find('i')
              .removeClass(classAsc)
              .removeClass(classDesc)
              .addClass(classDefault);
          } else {
            index++;
            element.find('i')
              .removeClass(classDefault)
              .removeClass(index % 2 === 0 ? classDesc : classAsc)
              .addClass(index % 2 === 0 ? classAsc : classDesc);
            scope.$emit('inside-search', {sortObj: scope.sortObj});
          }
        }, true);
      }
    }
  }
];