'use strict';

module.exports = ['$translateProvider', '$translatePartialLoaderProvider',
  function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: './i18n/{part}/{lang}.json'
    });
    $translateProvider.preferredLanguage('CN');
    $translateProvider.fallbackLanguage('CN');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
  }
];