'use strict';

module.exports = [
  function () {
    return {
      setHeight: function (count) {
        if (count <= 2) {
          return 200 * count;
        } else if (count <= 5 && count > 2) {
          return 150 * count;
        } else if (count > 5 && count <= 10) {
          return 70 * count;
        } else if (count > 10) {
          return 40 * count;
        }
      }
    }
  }
];