'use strict';

module.exports = function () {
  return {
    initPage: function () {
      return {
        totalItems: 0,
        totalPages: 0,
        length: 10,
        start: 0,
        currentPage: 1,
        //fromItem: 1,
        //toItem: 10,
        perObj: [{
          id: 1,
          name: 1
        }, {
          id: 10,
          name: 10
        }, {
          id: 50,
          name: 50
        }, {
          id: 100,
          name: 100
        }]
      };
    },
    setPage: function (pageObj, data) {
      if (data.hasOwnProperty('total')) {
        pageObj.totalItems = data.total;
        // pageObj.fromItem = data.total > 0 ? pageObj.start + 1 : pageObj.start;
      } else {
        pageObj.totalItems = data.totalCount;
        // pageObj.fromItem = data.totalCount > 0 ? pageObj.start + 1 : pageObj.start;
      }
      // pageObj.toItem = pageObj.currentPage * pageObj.length;
      // if (pageObj.currentPage * pageObj.length - pageObj.totalItems > 0) {
      //   pageObj.toItem = pageObj.totalItems;
      // }
      pageObj.totalPages = Math.ceil(pageObj.totalItems / pageObj.length);
    },
    pageChanged: function (pageObj, search) {
      pageObj.start = (pageObj.currentPage - 1) * pageObj.length;
      search();
    }
  }
};