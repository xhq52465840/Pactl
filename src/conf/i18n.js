'use strict';

module.exports = ['ipCookie', '$translate', '$rootScope',
  function (ipCookie, $translate, $rootScope) {
    var lang = ipCookie('language');
    lang && $translate.use(lang);
    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
      $translate.refresh();
    });
  }
];