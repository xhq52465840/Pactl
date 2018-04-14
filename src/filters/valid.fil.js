'use strict';

module.exports = function () {
  return function (input, type) {
    if (type === '1') {
      return input === '1' ? '有效' : '无效';
    } else if (type === '2') {
      if (input === '1') {
        return '分单';
      } else if (input === '0') {
        return '主单';
      }
    } else if (type === '3') {

    } else if (type === '4') {
      return input === '1' ? '是' : '否';
    } else if (type === '5') {
      return input === '1' ? '黑名单' : '白名单';
    } else if (type === '6') {
      return input === '0' ? '停用' : '启用';
    } else if (type === '7') {
      return input === '1' ? '否' : '是';
    } else if (type === '8') {
      return input === 'veryUrgency' ? '非常紧急' : '紧急';
    } else {
      return input ? '√' : 'X';
    }
  };
};