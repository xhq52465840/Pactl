'use strict';

module.exports = ['$document','$timeout',
  function ($document,$timeout) {
    return {
      restrict: 'A',
      template: require('./ylx.html'),
      link: function (scope, element, attrs, ctrls) {
        var slideEle;
        scope.$watch(attrs.ylx, function (newVal) {
          if (newVal) {
            scope.slides = [];
            angular.forEach(newVal, function (v) {
              scope.slides.push({
                src: v
              });
            });
            $timeout(function () {
              slideEle = slider(angular.element('.ylx-items'));
            }, 0);
          }
        })
        angular.element('.ylx-pagePrev').on('click', function () {
          slideEle.prev();
        });
        angular.element('.ylx-pageNext').on('click', function () {
          slideEle.next();
        });

        function slider(elem) {
          var items = elem.children(),
            max = items.length - 1,
            currentElem,
            nextElem,
            pos = 0;
          sync();
          return {
            next: function () {
              move(1);
            },
            prev: function () {
              move(-1);
            },
            itemsNum: items && items.length
          };

          function move(dir) {
            if (dir > 0 && pos == max || dir < 0 && pos == 0) {
              if (dir > 0) {
                pos = 0;
              } else {
                pos = max;
              }
            } else {
              pos += dir;
            }
            sync();
          }

          function sync() {
            scope.$apply(function () {
              angular.forEach(scope.slides, function (v, k) {
                v.active = k === pos ? true : false;
              });
            });
          }
        }

        var startX = 0, startY = 0, x = 0, y = 0;
        element = angular.element(document.getElementsByClassName("modal-dialog"));
        element.css({
          position: 'relative',
          cursor: 'move'
        });

        element.on('mousedown', function (event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          element.css({
            top: y + 'px',
            left: x + 'px'
          });
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
      }
    }
  }
];