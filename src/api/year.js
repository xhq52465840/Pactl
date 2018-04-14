'use strict';

module.exports = ['$rootScope', '$timeout',
  function ($rootScope, $timeout) {
    var now = new Date();
    var nYear = now.getFullYear();
    return {
      getThreeYear: function () {
        return [{
          id: nYear + 1,
          name: nYear + 1
        }, {
            id: nYear,
            name: nYear
          }, {
            id: nYear - 1,
            name: nYear - 1
          }
        ];
      },
      getTwoYear: function () {
        return [{
          id: nYear + 1,
          name: nYear + 1
        }, {
            id: nYear,
            name: nYear
          }
        ];
      },
      getNowYear: function () {
        return {
          id: nYear,
          name: nYear
        };
      }
    }
  }
];