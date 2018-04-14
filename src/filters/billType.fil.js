'use strict';

module.exports = function () {
  return function (input) {
    var data = input.split(';');
    var obj = [];
    angular.forEach(data, function (v, k) {
      if (v === '0') {
        obj.push('主单');
      } else if (v === '1') {
        obj.push('分单');
      }
    });
    return obj.join(';');
  };
};