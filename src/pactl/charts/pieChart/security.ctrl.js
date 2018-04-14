'use strict';

module.exports = ['$scope', 'restAPI', 'Notification',
  function ($scope, restAPI, Notification) {
    var vm = $scope;
    vm.data = null;
    vm.config = {
      title: '安检',
      showXAxis: false,
      showYAxis: false,
      showLegend: true,
      center: ['50%', '50%'],
      radius: [40, 110],
      pie: {
        roseType: 'area',
        itemStyle: {}
      },
      height: 450
    };
    getData();

    function getData() {
      restAPI.charts.security.save({}).$promise.then(function (resp) {
        if (resp.ok) {
          vm.data = resp.data;
        } else {
          Notification.error({
            message: '获取安检数据失败'
          });
        }
      });
    }
  }
];