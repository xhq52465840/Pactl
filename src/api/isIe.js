'use strict';

module.exports = [
  function () {
    function isString(value) {
      return typeof value == 'string';
    }

    function int(str) {
      return parseInt(str, 10);
    }

    function lowercase(string) {
      return isString(string) ? string.toLowerCase() : string;
    }
    return {
      ieNum: function () {
        return int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
      }
    };
  }
];