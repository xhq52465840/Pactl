'use strict';

var secure_fn = ['$scope', 'Page', 'restAPI', '$state', 'Notification', '$rootScope', '$modal',
  function ($scope, Page, restAPI, $state, Notification, $rootScope, $modal) {
    var vm = $scope;
    vm.add = add;
    vm.airPortObj = {};
    vm.airPortData = [];
    vm.IpData=[];
    vm.currencyData = [];
    vm.disable = disable;
    vm.edit = edit;
    vm.enable = enable;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.search = search;
    vm.ipObj={};

    //
    getIpData()
    /**
     * 查询
     */
    function search() {
    	getIpData() ;
    	//console.log(vm.searchIp)
    }
    /**
     * 获取IP
     */
    function getIpData() {
        $rootScope.loading = true;
        var obj = getCondition();
        restAPI.secure.queryList.save({}, obj).$promise.then(function(resp) {
        	//console.log(resp)
            $rootScope.loading = false;
            vm.IpData = resp.rows;
            Page.setPage(vm.page, resp);
          });
      }
    
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage,
        accessIp:vm.ipObj.accessIp
      };
      if (vm.sortObj && vm.sortObj.name) {
          obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
        }
        vm.airPortObj.airportCode && (obj.airportCode = vm.airPortObj.airportCode);
        vm.airPortObj.cityName && (obj.cityName = vm.airPortObj.cityName);
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新增
     */
    function add() {

      var addPortDialog = $modal.open({
        template: require('./addSecure.html'),
        controller: require('./addSecure.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增IP',
              currencyData: vm.currencyData,
              obj: vm.obj
            };
          }
        }
      });
      addPortDialog.result.then(function (data) {
        if(data.currency) {
          data.currencyName = data.currency.currencyName;
          data.currencyCode = data.currency.currencyCode;
          delete data.currency;
        } else {
           delete data.currencyName;
           delete data.currencyCode;
        }
        $rootScope.loading = true;
        restAPI.secure.ipUpdate.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增IP成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(item) {
      var editPortDialog = $modal.open({
        template: require('./addSecure.html'),
        controller: require('./addSecure.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑IP',
              currencyData: vm.currencyData,
              IpData1:item.accessIp,
              IpBeizhu:item.remark,
              IpId:item.accessId
            };
          }
        }
      });
      editPortDialog.result.then(function (data) {
        if(data.currency) {
          data.currencyName = data.currency.currencyName;
          data.currencyCode = data.currency.currencyCode;
          delete data.currency;
        } else {
           delete data.currencyName;
           delete data.currencyCode;
        }
        $rootScope.loading = true;
        restAPI.secure.ipUpdate.save({}, data)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();   
              Notification.success({
                message: '编辑IP成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 停用
     * 
     * @param {any} id
     */
    function disable(id,sta) {
      restAPI.secure.ipDel.save({},{
    	  accessId:id,
    	  status:2
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '停用成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 启用
     */
    function enable(id,sta) {
      restAPI.secure.ipDel.save({}, {
    	  accessId: id,
    	  status:0
        })
        .$promise.then(function (resp) {
        	console.log(resp)
          if (resp.ok) {
            search();
            Notification.success({
              message: '启用成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除
     * 
     */
    function remove(id,sta) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除',
              content: '你将要删除IP此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
    	  restAPI.secure.ipDel.save({}, {
           accessId:id,
           status:1
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
            	
              search();
              Notification.success({
                message: '删除IP成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function () {

      });
    }
  }
];

module.exports = angular.module('app.systemSet.secure', []).controller('secureCtrl', secure_fn);