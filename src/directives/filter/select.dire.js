'use strict';

module.exports = ['$document', '$http',
  function ($document, $http) {
    return {
      restrict: 'EA',
      template: require('./select.html'),
      require: '^filterDire',
      replace: false,
      scope: {
        who: '@'
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.obj = $element.data('data');
        vm.showName = vm.who;
        vm.open = false;
        vm.toggle = toggle;
        vm.close = close;
        vm.update = update;
        vm.remove = remove;
        vm.liClick2 = function (li) {
          alert('123');
        };

        getAll();

        function getAll() {
          $http({
            method: 'POST',
            url: '/oaservice/api/biztype/page',
            data: {}
          }).success(function (resp) {
            vm.liList = resp.data;
          }).error(function (resp) {

          });
        }
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