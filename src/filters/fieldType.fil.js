'use strict';

module.exports = function () {
  return function (input, data) {
    data = data || [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === input) {
        return data[i].fieldSort;
      }
    }
  };
};