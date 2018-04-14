'use strict';

module.exports = ['$scope', 'restAPI', 'Notification',
  function ($scope, restAPI, Notification) {
    var vm = $scope;
    vm.data = null;
    vm.config = {
      title: '进场',
      showXAxis: true,
      showYAxis: true,
      showLegend: true,
      height: 450
    };
    getData();

    function getData() {
      restAPI.charts.approach.save({}).$promise.then(function (resp) {
        if (resp.ok) {
          vm.data = resp.data;
        } else {
          Notification.error({
            message: '获取进场数据失败'
          });
        }
      });
    }
  }
];