'use strict';

var pikadayConfig = ['pikadayConfigProvider', function(pikaday) {
  pikaday.setConfig({
    numberOfMonths: 2
  });
  var locales = {
    zh: {
      previousMonth: '上一月',
      nextMonth: '下一月',
      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      weekdays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"]
    }
  };
  pikaday.setConfig({
    i18n: locales.zh,
    locales: locales
  });
}];
module.exports = pikadayConfig;