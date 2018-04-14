'use strict';

require('./api/num_tofixed.js');
require('./css/colorpicker.css');
require('./css/pikaday.css');
require('./css/select2-bootstrap.css');
require('./css/sprite.css');
require('./css/uploadify.css');
require('./css/w5cValidator.css');
require('./css/main.css');
var app = angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'w5c.validator',
    'ngResource',
    'ui.select',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.sortable',
    'ui.tree',
    'pikaday',
    'colorpicker.module',
    'ngclipboard',
    'ipCookie',
    'oc.lazyLoad',
    'ngNiceBar',
    'ng.shims.placeholder',
    'angular-echarts',
    'ui-notification',
    'plupload.directive'
  ])
  .config(require('./conf/route.js'))
  .config(require('./conf/httpProvider.js'))
  .config(require('./conf/pikaday.js'))
  .config(require('./conf/translate.js'))
  .config(require('./conf/w5cValidatorRules.js'))
  .config(require('./conf/notificationProvider.js'))
  .run(require('./conf/routeChange.js'))
  .run(require('./conf/i18n.js'))
  .run(require('./conf/templateCache.js'))
  .constant('expires', require('./conf/expires.js'))
  .factory('restAPI', require('./api/restAPI.js'))
  .factory('Auth', require('./api/auth.js'))
  .factory('Page', require('./api/page.js'))
  .factory('IsIe', require('./api/isIe.js'))
  .factory('Year', require('./api/year.js'))
  .factory('_upload', require('./api/_upload.js'))
  .factory('Download', require('./api/download.js'))
  .factory('Expexcel', require('./api/exp.js'))
  .factory('editData', require('./api/editData.js'))
  .factory('chartHeight', require('./api/chartHeight.js'))
  .factory('printHtml', require('./api/printHtml.js'))
  .filter('isValid', require('./filters/valid.fil.js'))
  .filter('showDictType', require('./filters/dictType.fil.js'))
  .filter('showStatus', require('./filters/status.fil.js'))
  .filter('showRecCatalog', require('./filters/recCatalog.fil.js'))
  .filter('showAirname', require('./filters/airname.fil.js'))
  .filter('showDest', require('./filters/dest.fil.js'))
  .filter('showDest1', require('./filters/dest1.fil.js'))
  .filter('showSpCode', require('./filters/spCode.fil.js'))
  .filter('showSpCode2', require('./filters/spCode2.fil.js'))
  .filter('showStation', require('./filters/station.fil.js'))
  .filter('showAgentType', require('./filters/agentType.fil.js'))
  .filter('showFieldType', require('./filters/fieldType.fil.js'))
  .filter('showCertStatus', require('./filters/showCertStatus.fil.js'))
  .filter('showFileType', require('./filters/fileType.fil.js'))
  .filter('showRemark', require('./filters/remark.fil.js'))
  .filter('showPeople', require('./filters/people.fil.js'))
  .filter('showBillType', require('./filters/billType.fil.js'))
  .filter('showFieldCn', require('./filters/fieldCn.fil.js'))
  .filter('showEmailAddr', require('./filters/emailAddr.fil.js'))
  .filter('showResource', require('./filters/resource.fil.js'))
  .controller('headCtrl', require('./pactl/head/head.ctrl.js'))
  .controller('securityCtrl', require('./pactl/charts/pieChart/security.ctrl.js'))
  .controller('waybillCtrl', require('./pactl/charts/barChart/waybill.ctrl.js'))
  .controller('approachCtrl', require('./pactl/charts/barChart/approach.ctrl.js'))
  .controller('agentSecurityCtrl', require('./pactl/charts/barChart/agentSecurity.ctrl.js'))
  .controller('agentWaybillCtrl', require('./pactl/charts/barChart/agentWaybill.ctrl.js'))
  .controller('securityRecheckCtrl', require('./pactl/charts/barChart/securityRecheck.ctrl.js'))
  .controller('queuingIndexCtrl', require('./pactl/charts/gaugeChart/queuingIndex.ctrl.js'))
  .controller('queuingAirCtrl', require('./pactl/charts/gaugeChart/queuingAir.ctrl.js'))
  .directive('filterDire', require('./directives/filter/filter.dire.js'))
  .directive('selectDire', require('./directives/filter/select.dire.js'))
  .directive('textDire', require('./directives/filter/text.dire.js'))
  .directive('progressDire', require('./directives/progress/progress.dire.js'))
  .directive('remarkDire', require('./directives/remark/remark.dire.js'))
  .directive('historyDire', require('./directives/history/history.dire.js'))
  .directive('tSort', require('./directives/sort/sort.dire.js'))
  .directive('insideSort', require('./directives/sort/insideSort.dire.js'))
  .directive('masterbill', require('./directives/waybill/masterbill.dire.js'))
  .directive('waybill', require('./directives/waybill/waybill.dire.js'))
  .directive('coWaybill', require('./directives/waybill/coWaybill.dire.js'))
  .directive('doSearch', require('./directives/doSearch/doSearch.dire.js'))
  .directive('scrollTop', require('./directives/scrollTop/scrollTop.dire.js'))
  .directive('iframeOnload', require('./directives/iframeOnload/iframeOnload.dire.js'))
  .directive('messageTemp', require('./directives/message/message.dire.js'))
  .directive('compile', require('./directives/compile/compile.dire.js'))
  .directive('awb', require('./directives/awb/awb.dire.js'))
  .directive('airWaybill', require('./directives/airWaybill/airWaybill.dire.js'))
  .directive('myUploadify', require('./directives/myFileUpload/myFileUpload.dire.js'))
  .directive('necessary', require('./directives/necessary/necessary.dire.js'))
  .directive('autoFocus', require('./directives/autoFocus/autoFocus.dire.js'))
  .directive('printDesc', require('./directives/printDesc/printDesc.dire.js'))
  .directive('ylx', require('./directives/ylx/ylx.dire.js'))
  .directive('ylxCursor', require('./directives/ylxCursor/ylxCursor.dire.js'))
  .directive('textHeight', require('./directives/textHeight/textHeight.dire.js'))
  .directive('inputSearch', require('./directives/inputSearch/inputSearch.dire.js'))
  .directive('masterBillInfo', require('./directives/awb/masterBillInfo.dire.js'));
  

module.exports = app;