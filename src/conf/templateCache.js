'use strict';

module.exports = ['$templateCache',
  function ($templateCache) {
      $templateCache.put('head.html', require('../pactl/head/head.html'));
      $templateCache.put('foot.html', require('../pactl/foot/foot.html'));
      $templateCache.put('page.html', require('../pactl/page/page.html'));
      $templateCache.put('pageInside.html', require('../pactl/page/pageInside.html'));
      $templateCache.put('declaraction.html', require('../pactl/declaraction/declaraction.html'));
      $templateCache.put('pieChart/security.html', require('../pactl/charts/pieChart/security.html'));
      $templateCache.put('barChart/approach.html', require('../pactl/charts/barChart/approach.html'));
      $templateCache.put('barChart/waybill.html', require('../pactl/charts/barChart/waybill.html'));
      $templateCache.put('barChart/agentSecurity.html', require('../pactl/charts/barChart/agentSecurity.html'));
      $templateCache.put('barChart/securityRecheck.html', require('../pactl/charts/barChart/securityRecheck.html'));
      $templateCache.put('barChart/agentWaybill.html', require('../pactl/charts/barChart/agentWaybill.html'));
      $templateCache.put('gaugeChart/queuingIndex.html', require('../pactl/charts/gaugeChart/queuingIndex.html'));
      $templateCache.put('gaugeChart/queuingAir.html', require('../pactl/charts/gaugeChart/queuingAir.html'));
  }
];