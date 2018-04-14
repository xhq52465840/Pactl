'use strict';

module.exports = function () {
  return function (input) {
    var data = input.split(';');
    var obj = [];
    angular.forEach(data, function (v, k) {
      if (v === '0') {
        obj.push('收货人');
      } else if (v === '1') {
        obj.push('发货人');
      } else if (v === '2') {
        obj.push('通知人');
      }
    });
    return obj.join(';');
  };
};