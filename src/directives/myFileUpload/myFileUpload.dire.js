'use strict';
var uploadImg = require('../../image/pactl/upload.png');
module.exports = ['$document', '$parse', '$timeout', 'ipCookie', '$rootScope',
  function ($document, $parse, $timeout, ipCookie, $rootScope) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function ($scope, element, attrs, ngModel) {
        var opts = angular.extend({}, $scope.$eval(attrs.myUploadify)),
          otherData = $scope.$eval(attrs.otherData);
        var isnum = parseInt((/msie (\d+)/.exec((navigator.userAgent + '').toLowerCase()) || [])[1], 10);
        if (isnum) {
          try {
            var swf1 = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            initUpload();
          } catch (e) {
            tipFlash();
          }
        } else {
          try {
            var swf2 = navigator.plugins['Shockwave Flash'];
            if (swf2 == undefined) {
              tipFlash();
            } else {
              initUpload();
            }
          } catch (e) {
            tipFlash();
          }
        }

        function initUpload() {
          $timeout(function () {
            element.uploadify({
              'fileObjName': opts.fileObjName || 'file',
              'auto': opts.auto != undefined ? opts.auto : true,
              'swf': opts.swf || './lib/uploadify/uploadify.swf',
              'uploader': opts.uploader || '/api/pactl/uploadfilepdf' + ';jsessionid=' + ipCookie('jsessionid'),
              'buttonText': opts.buttonText || '上传',
              'width': opts.width || 93,
              'height': opts.height || 30,
              'fileTypeExts': opts.fileTypeExts || '',
              'buttonImage': uploadImg,
              'fileSizeLimit': opts.fileSizeLimit || '20MB',
              'formData': otherData,
              'multi': false,
              'queueSizeLimit': '1',
              'onUploadSuccess': function (file, d, response) {
                if (!ngModel) {
                  return;
                }
                var result;
                try {
                  result = JSON.parse(d);
                } catch (error) {
                  result = {};
                }
                $scope.$apply(function () {
                  ngModel.$setViewValue(result);
                });
                $timeout(function () {
                  $scope.$apply(attrs.callback);
                }, 10);
              }
            });
          }, 10);
        }
        function tipFlash() {
          $rootScope.noflash = true;
        }
      }
    };
  }
];