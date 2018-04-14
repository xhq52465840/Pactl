'use strict';

var w5cValidatorRuleConfig = ['w5cValidatorProvider',
  function (w5cValidatorProvider) {
    // 全局配置
    w5cValidatorProvider.config({
      blurTrig: true,
      showError: true,
      removeError: true
    });

    w5cValidatorProvider.setRules({
      account: {
        customizer: "账户号已存在",
        w5cuniquecheck: "输入账户号已经存在，请重新输入",
        required      : "输入的账户号不能为空",
      },
      airCode: {
        customizer: '大写字母和数字,二位'
      },
      destCode: {
        customizer: '三位数字'
      },
      percentage: {
        pattern: '占比只能为0~10'
      },
      delayData: {
        customizer: '大于规定的延期天数'
      },
      officeCode: {
        pattern: '三位大写字母'
      }
    });
  }
];
module.exports = w5cValidatorRuleConfig;