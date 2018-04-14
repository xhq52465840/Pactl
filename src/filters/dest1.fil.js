'use strict';

module.exports = function () {
  return function (input, data) {
    if (data) {
      if (data.dest4) {
        return data.dest4;
      } else if (data.dest3) {
        return data.dest3;
      } else if (data.dest2) {
        return data.dest2;
      } else if (data.dest1) {
        return data.dest1;
      }
    }
  };
};