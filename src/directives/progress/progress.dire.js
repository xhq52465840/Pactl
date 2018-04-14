'use strict';

module.exports = ['$document', 'restAPI', '$rootScope', 'Notification',
  function ($document, restAPI, $rootScope, Notification) {
    return {
      restrict: 'EA',
      template: require('./progress.html'),
      replace: true,
      scope: {
        awid: '=',
        type: '@',
        editAble: '=',
        progressObj: '=',
        checkTypeData: '=progressData'
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var vm = $scope;
        vm.checkTypeData = [];
        vm.getProgress = getProgress;
        vm.getCheckType = getCheckType;
        /**
         * 获取进度
         */
        function getProgress() {
          restAPI.waybill.progressChecklist.save({}, {
              awId: vm.awid
            })
            .$promise.then(function (resp) {
              if (resp.ok) {
                vm.progressObj = resp.data;
              }
            });
        }
        /**
         * 获取现场检查类型
         */
        function getCheckType() {
          restAPI.localecheck.queryList.save({}, {
              awId: vm.awid
            })
            .$promise.then(function (resp) {
              angular.forEach(resp.rows, function (v, k) {
                if (v.checkFlag === 'true' || v.checkFlag === true) {
                  v.checkFlag = true;
                } else if (v.checkFlag === 'false' || v.checkFlag === false) {
                  v.checkFlag = false;
                }
              });
              vm.checkTypeData = resp.rows;
            });
        }
        $scope.$on('change-progress', function (event, data) {
          getProgress();
          getCheckType();
        });
      }],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        scope.$watch('awid', function (newVal, oldVal) {
          if (newVal) {
            scope.getProgress();
            scope.getCheckType();
          }
        });
        // scope.$watch('checkTypeData', function (newVal, oldVal) {
        //   if (newVal && oldVal) {
        //     if (newVal.length > 0 && oldVal.length > 0) {
        //       scope.addLocalcheck();
        //     }
        //   }
        // }, true);
      }
    }
  }
];