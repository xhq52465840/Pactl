'use strict';

module.exports = ['$scope', 'restAPI', 'Notification', 'chartHeight',
  function ($scope, restAPI, Notification, chartHeight) {
    var vm = $scope;
    vm.data = null;
    vm.config = {
      title: '安检',
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
      itemStyle: { normal: {label : {show: true, position: 'insideLeft'}}}
    };
    getData();

    function getData() {
      restAPI.charts.agentSecurity.save({}).$promise.then(function (resp) {
        if (resp.ok) {
          vm.data = resp.data.list;
          vm.config.yAxis[0].data = resp.data.data;
          vm.config.height = chartHeight.setHeight(resp.data.data.length);
        } else {
          Notification.error({
            message: '获取安检数据失败'
          });
        }
      });
    }
  }
];