'use strict';

module.exports = ['$scope', 'restAPI',
  function ($scope, restAPI) {
    var vm = $scope;
    var pageload = {
      name: '排队指数',
      datapoints: [{
        x: '',
        y: 200
      }]
    };
    vm.config = {
      showXAxis: false,
      showYAxis: false,
      showLegend: false,
      height: 300,
      gauge: {
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            color: [
              [0.2, '#b6e61e'],
              [0.4, '#21b04f'],
              [0.6, '#fdd13f'],
              [0.8, '#ff7e26'],
              [1, '#bf302e']
            ],
            width: 8
          }
        },
        radius: [0, '75%'],
        pointer: {
          length: '60%',
          width: 8,
          color: 'auto'
        },
        min: 0,
        max: 500,
        detail: {
          formatter: '{value}',
          textStyle: {
            color: 'auto',
            fontWeight: 'bolder'
          }
        },
      }
    };

    getData();

    function getData() {
      restAPI.charts.agentApproachQueue.save({}).$promise.then(function (resp) {
        if (resp.ok) {
          vm.data = resp.data.queue;
        } else {
          Notification.error({
            message: '获取排队指数失败'
          });
        }
      });
    }
  }
];