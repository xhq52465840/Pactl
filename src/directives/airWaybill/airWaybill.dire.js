'use strict';

module.exports = ['$document', '$rootScope', 'restAPI', 'Notification', 'chartHeight',
  function ($document, $rootScope, restAPI, Notification, chartHeight) {
    return {
      restrict: 'EA',
      template: require('./airWaybill.html'),
      replace: false,
      scope: {

      },
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        scope.config = {
          title: '运单',
          showXAxis: true,
          showYAxis: true,
          showLegend: true,
          stack: true,
          height: 100,
          xAxis: [{
            type: 'value'
          }],
          yAxis: [{
            type: 'category',
            data: []
          }],
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'insideLeft'
              }
            }
          }
        };

        attrs.$observe('awbDate', function (newVal, oldVal) {
          if (newVal) {
            getData(newVal);
          }
        });

        function getData(date) {
          restAPI.airline.waybill.save({}, date).$promise.then(function (resp) {
            if (resp.ok) {
              scope.data = resp.data.list;
              scope.config.yAxis[0].data = resp.data.data;
              scope.config.height = chartHeight.setHeight(resp.data.data.length);
            } else {
              Notification.error({
                message: '获取运单数据失败'
              });
            }
          });
        }
      }
    }
  }
];