'use strict';

module.exports = ['$document', '$interval',
  function ($document, $interval) {
    return {
      restrict: 'EA',
      template: '<div class="dib"></div>',
      replace: true,
      controller: ['$scope', '$attrs', function ($scope, $attrs) {
        var vm = $scope;
        vm.time = getTime();
        var timer = $interval(function () {
          return vm.time = getTime();
        }, 1000);

        $scope.$on('$destroy', function () {
          $interval.cancel(timer);
        });

        function getTime() {
          var now = new Date(),
            year = now.getFullYear(),
            month = getM(now),
            day = getD(now),
            week = getWeek(now),
            hour = getH(now),
            min = getMin(now),
            sec = getSec(now);
          return '<div class="mr20 dib">欢迎您进入' + $attrs.data + '，祝您工作开心顺利!!!</div><div class="mr20 dib">今天是' + year + '年' + month + '月' + day + '号星期' + week + '</div><div class="dib">现在北京时间' + hour + ':' + min + ':' + sec + '</div>';
        }
        function getM(now) {
          var month = now.getMonth() + 1;
          return month < 10 ? '0' + month : month;
        }
        function getD(now) {
          var day = now.getDate();
          return day < 10 ? '0' + day : day;
        }
        function getH(now) {
          var hour = now.getHours();
          return hour < 10 ? '0' + hour : hour;
        }
        function getMin(now) {
          var min = now.getMinutes();
          return min < 10 ? '0' + min : min;
        }
        function getSec(now) {
          var sec = now.getSeconds();
          return sec < 10 ? '0' + sec : sec;
        }
        function getWeek(now) {
          var nDay = now.getDay();
          var str = '';
          switch (nDay) {
            case 0:
              str = "日";
              break;
            case 1:
              str = "一";
              break;
            case 2:
              str = "二";
              break;
            case 3:
              str = "三";
              break;
            case 4:
              str = "四";
              break;
            case 5:
              str = "五";
              break;
            case 6:
              str = "六";
              break;
          }
          return str;
        }
      }],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        scope.$watch('time', function (newVal, oldVal) {
          element.html(newVal);
        });
      }
    }
  }
];