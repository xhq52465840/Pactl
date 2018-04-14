'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI',
  function ($scope, $modalInstance, restAPI) {
    var vm = $scope;
    vm.add = add;
    vm.cancel = cancel;
    vm.obj = {
      keywords: '',
      data: []
    };

    getData();

    /**
     * 获取所有的图表
     */
    function getData() {
      vm.obj.data = [{
        imgSrc: 'http://echarts.baidu.com/echarts2/doc/asset/img/example/line1.png',
        title: '标准折线图',
        description: '任意系列多维度堆积',
        template: 'lineChart/lineChart1.html'
      }, {
        imgSrc: 'http://echarts.baidu.com/echarts2/doc/asset/img/example/pie1.png',
        title: '标准饼图',
        description: '中心，半径设置',
        template: 'pieChart/pieChart1.html'
      }, {
        imgSrc: 'http://echarts.baidu.com/echarts2/doc/asset/img/example/bar1.png',
        title: '标准柱状图',
        description: '标注，标线',
        template: 'barChart/barChart1.html'
      }, {
        imgSrc: 'http://echarts.baidu.com/echarts2/doc/asset/img/example/gauge1.png',
        title: '标准仪表盘',
        description: '个性化',
        template: 'gaugeChart/gaugeChart1.html'
      }, {
        imgSrc: 'http://echarts.baidu.com/echarts2/doc/asset/img/example/funnel1.png',
        title: '标准漏斗图',
        description: '个性化',
        template: 'funnelChart/funnelChart1.html'
      }];
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 添加图表
     * @param {*} param 
     */
    function add(param) {
      $modalInstance.close(param);
    }
  }
];