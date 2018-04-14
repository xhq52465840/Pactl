'use strict';

var auth = ['ipCookie', '$window', 'expires',
  function (ipCookie, $window, expires) {
    var _user = ipCookie('user');
    return {
      setUser: function (user) {
        _user = user;
        ipCookie('user', _user, expires);
      },
      isLoggedIn: function () {
        return _user ? true : false;
      },
      getId: function () {
        return _user ? _user.userid : ''
      },
      getUser: function () {
        return _user;
      },
      getToken: function () {
        return _user ? _user.token : '';
      },
      logout: function (type) {
        ipCookie.remove('user');
        ipCookie.remove('unit');
        $window.sessionStorage.removeItem('menu');
        $window.sessionStorage.removeItem('menuList');
        $window.sessionStorage.removeItem('unitid');
        _user = null;
      },
      //获取下拉框的agentId
      getUnitId: function () {
        return _user ? _user.unit : '';
      },
      //获取本身的agentId
      getMyUnitId: function () {
        return _user ? _user.myunit : '';
      },
      getUnitCode: function () {
        return _user ? _user.unitCode : '';
      },
      getMyUnitType: function () {
        return _user ? _user.myUnitType : '';
      },
      getMyUnitCode: function () {
        return _user ? _user.myUnitCode : '';
      },
      getUnitType: function () {
        return _user ? _user.unitType : '';
      },
      getMyUnitName: function () {
        return _user ? _user.myUnitName : '';
      }
    }
  }
];

module.exports = auth;