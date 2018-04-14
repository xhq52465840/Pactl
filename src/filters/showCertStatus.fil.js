'use strict';

module.exports = function () {
  return function (input, data) {
    if(data.bookType === 'sharing'){
      return '通过';
    }else if(data.bookType === 'onetime'){
      if(data.onlineFlag === '1'){
        return '通过';
      }else{
        return '';
      }
    }
  };
};