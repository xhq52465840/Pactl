module.exports = ['$parse', '$timeout',
  function ($parse, $timeout) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function ($scope, element, attrs, ngModel) {
        var el1 = element.find('.ui-select-match');
        $scope.$watch(function () {
          return ngModel.$modelValue;
        }, function (newVal, oldVal) {
          var necessaryData = $parse(attrs.necessaryData)($scope) || [],
            data = attrs.necessary;
          if (necessaryData.indexOf(data) < 0) return;
          if (newVal) {
            $timeout(function () {
              if (el1.length) {
                el1.removeClass('necessary-data');
              } else {
                element.removeClass('necessary-data');
              }
            }, 0);
          } else {
            $timeout(function () {
              if (el1.length) {
                el1.addClass('necessary-data');
              } else {
                element.addClass('necessary-data');
              }
            }, 0);
          }
        });
        $scope.$watch(attrs.necessaryData, function (newVal, oldVal) {
          if (angular.isArray(newVal) && newVal.length) {
            var data = attrs.necessary;
            if (newVal.indexOf(data) > -1) {
              if (el1.length) {
                el1.addClass('necessary-data');
              } else {
                element.addClass('necessary-data');
              }
            }
          }
        });
      }
    };
  }
];