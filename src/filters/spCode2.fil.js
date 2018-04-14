'use strict';

module.exports = function () {
  return function (input, data) {
    if(!input) return;
    if(input === '所有') return '所有';
    data = data || [];
    var arr1 = input.split(';'),
      arr2 = [];
    angular.forEach(arr1, function (v, k) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].sccId === v) {
          arr2.push(data[i].sccCode);
        }
      }
    });
    return arr2.join(';');
  };
};