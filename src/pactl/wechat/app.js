'use strict';
require('./wechat.css');
require('./bower_components/bootstrap/css/bootstrap.css');
var angular = require('angular');
require('angular-cookies');
require('./bower_components/ngInfiniteScroll.js');
// var app = angular.module('app', ['ui.bootstrap','bw.paging'])
var app = angular.module('app', ['infinite-scroll', 'ngCookies'])
	.controller('listCtrl', require('./list/list.ctrl.js'))
	.controller('showPDFCtrl', require('./list/showPDF.ctrl.js'))
	.controller('bindCtrl', require('./binding.ctrl.js'))
	.controller('barCodeCtrl', require('./list/barCode.ctrl.js'))
	.controller('singleWaybillCtrl', require('./singleWaybill/singleWaybill.ctrl.js'))
	.controller('subListCtrl', require('./singleWaybill/subList.ctrl.js'))
	.controller('cargoSearchCtrl', require('./cargoSearch/cargoSearch.ctrl.js'))
	.controller('creatBarcodeCtrl', require('./creatBarcode/creatBarcode.ctrl.js'))
	.controller('airLineCtrl', require('./airLine/airLine.ctrl.js'))
	.controller('airSubListCtrl', require('./airLine/airSubList.ctrl.js'))
	.controller('multipleWaybillCtrl', require('./airLine/multipleWaybill.ctrl.js'))
module.exports = app;
// require('./bower_components/ui-bootstrap-csp.css');
// require('./bower_components/ui-bootstrap-tpls.min.js');
// require('./bower_components/ui-bootstrap.min.js');
require('./bower_components/angular-paging/dist/paging.js');