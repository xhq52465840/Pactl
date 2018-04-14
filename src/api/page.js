'use strict';

var pageOption = ['ipCookie',
  function (ipCookie) {
    return {
      initPage: function () {
        var pageOption = ipCookie('systemSet_pageOption');
        if(!(pageOption && pageOption.pageOption && pageOption.pageDefault)) {
          pageOption = {
            pageOption : [10,50,100,500],
            pageDefault : 10
          };
        }
        var perObj = []; 
        var length = 10;
        if(pageOption.pageOption && pageOption.pageOption.length>0) {
          for(var i=0; i<pageOption.pageOption.length; i++ ) {
            perObj.push({id: pageOption.pageOption[i],name: pageOption.pageOption[i]});
          }
        } else {
          perObj = [{
            id: 10,
            name: 10
          }, {
            id: 50,
            name: 50
          }, {
            id: 100,
            name: 100
          }];
        }
        if(pageOption.pageDefault) {
          length = pageOption.pageDefault;
        } 
        return {
          totalItems: 0,
          totalPages: 0,
          length: length,
          start: 0,
          currentPage: 1,
          perObj: perObj
        };
      },
      setPage: function (pageObj, data) {
        if (data.hasOwnProperty('total')) {
          pageObj.totalItems = data.total;
        } else {
          pageObj.totalItems = data.totalCount;
        }
        pageObj.totalPages = Math.ceil(pageObj.totalItems / pageObj.length);
      },
      pageChanged: function (pageObj, search) {
        pageObj.start = (pageObj.currentPage - 1) * pageObj.length;
        search();
      }
    }
  }
];

module.exports = pageOption;