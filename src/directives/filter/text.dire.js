'use strict';

module.exports = ['$document', '$http',
  function ($document, $http) {
    return {
      restrict: 'EA',
      template: require('./text.html'),
      require: '^filterDire',
      replace: false,
      scope: {
        who: '@'
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.open = false;
        vm.textVal = '';
        vm.obj = $element.data('data');
        vm.showName = vm.who + ':' + '全部';
        vm.toggle = toggle;
        vm.close = close;
        vm.update = update;
        vm.remove = remove;

        function toggle(e) {
          if (vm.open) {
            vm.open = false;
            e.preventDefault();
            e.stopPropagation();
          } else {
            vm.open = true;
          }
        }

        function close() {
          vm.open = false;
        }

        function update() {
          vm.showName = vm.who + ':' + (vm.textVal ? vm.textVal : '全部');
          vm.open = false;
        }

        function remove() {
          vm.$emit('filter:remove', vm.obj);
        }
      }],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        $document.on('click', onDocumentClick);
        scope.$on('$destroy', function () {
          $document.off('click', onDocumentClick);
        });

        function onDocumentClick(e) {
          if (!scope.open) {
            return;
          }
          var contains = false;
          if (window.jQuery) {
            contains = window.jQuery.contains(element[0], e.target);
          } else {
            contains = element[0].contains(e.target);
          }
          if (!contains) {
            scope.$apply(function () {
              scope.open = false;
            });
          }
        }
      }
    }
  }
];