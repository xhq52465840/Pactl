'use strict';

module.exports = ['$document', '$compile', '$http',
  function ($document, $compile, $http) {
    return {
      restrict: 'EA',
      template: require('./filter.html'),
      replace: true,
      scope: {

      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.open = false;
        vm.li = null;
        vm.toggle = toggle;
        vm.liClick = liClick;
        vm.checked = [];
        vm.liList = [];
        
        //getAll();

        // 获取所有的过滤器
        function getAll() {
          $http({
            method: 'GET',
            url: '/pactl/api/field/customs/',
            params: {
              type: 'search'
            }
          }).success(function (resp) {
            vm.liList = resp;
          }).error(function (resp) {

          });
        }
        // 显示或关闭下拉
        function toggle(e) {
          if (vm.open) {
            vm.open = false;
            e.preventDefault();
            e.stopPropagation();
          } else {
            vm.open = true;
          }
        };
        // 点击
        function liClick(e, li) {
          var checked = e.target.checked,
            nli = angular.copy(li),
            key = li.key,
            index = vm.checked.indexOf(key);
          nli.type = checked ? 'add' : 'remove';
          if (checked) {
            vm.checked.push(li.key);
          } else {
            vm.checked.splice(index, 0);
          }
          vm.li = nli;
        };
      }],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        scope.$watch('li', function (newValue, oldValue) {
          if (newValue && newValue.type === 'add') {
            appendLi(newValue);
          } else if (newValue && newValue.type === 'remove') {
            removeLi(newValue);
          }
        }, true);

        $document.on('click', onDocumentClick);

        scope.$on('$destroy', function () {
          $document.off('click', onDocumentClick);
        });

        scope.$on('filter:remove', function (e, obj) {
          removeLi(obj);
        });

        function onDocumentClick(e) {
          if (!scope.open) {
            return;
          }
          var contains = false;
          if (window.jQuery) {
            contains = window.jQuery.contains(element.find('.first-line')[0], e.target);
          } else {
            contains = element.find('.first-line')[0].contains(e.target);
          }
          if (!contains) {
            scope.$apply(function () {
              scope.open = false;
            });
          }
        }
        function appendLi(param) {
          var key = param.key, el = null;
          switch (key) {
            case 'type':
              el = $compile("<li select-dire who='" + param.name + "' key='" + param.key + "'></li>")(scope);
              break;
            case 'summary':
              el = $compile("<li text-dire who='" + param.name + "' key='" + param.key + "'></li>")(scope);
              break;
          };
          el.data('data', param);
          angular.element('.second-line>ul').append(el);
        }
        function removeLi(param) {
          var key = param.key;
          angular.element('.second-line>ul li[key=' + key + ']').remove();
        }
      }
    }
  }
];