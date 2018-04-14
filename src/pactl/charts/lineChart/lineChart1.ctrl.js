'use strict';

module.exports = ['$scope',
  function ($scope) {
    var vm = $scope;
    var pageload = {
      name: 'page.load',
      datapoints: [
        {x: 2001,y: 1012},
        {x: 2002,y: 1023},
        {x: 2003,y: 1045},
        {x: 2004,y: 1062},
        {x: 2005,y: 1032},
        {x: 2006,y: 1040},
        {x: 2007,y: 1023},
        {x: 2008,y: 1090},
        {x: 2009,y: 1012},
        {x: 2010,y: 1012}
      ]
    };
		vm.config = {
			title: 'Line Chart',
			subtitle: 'Line Chart Subtitle',
			showXAxis: true,
			showYAxis: true,
			showLegend: true,
      height: 450
		};
		vm.data = [pageload];    
  }
];