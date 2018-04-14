'use strict';

var receiveFile_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$filter',
  function($scope, Page, restAPI, $modal, Notification, $rootScope, $filter) {
    var vm = $scope;
    vm.add = add;
    vm.airData = [];
    vm.airportData = [];
    vm.countryData = [];
    vm.edit = edit;
    vm.ableSatatus = ableSatatus;
    vm.fileObj = {};
    vm.fileData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.salesData = [];
    vm.search = search;
    vm.specialGoodsData = [];
    vm.remove = remove;

    getAirData();

    /**
     * 获取航空公司数据
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          getAirPortData();
        });
    }
    /**
     * 获取目的港
     */
    function getAirPortData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.airportData = resp.data || [];
          getCountryData();
        });
    }
    /**
     * 获取国家
     */
    function getCountryData() {
      $rootScope.loading = true;
      restAPI.country.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.countryData = resp.data || [];
          getAgentIataData();
        });
    }
    /**
     * 获取代理人
     */
    function getAgentIataData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.salesData = resp;
          getSpecialData();
        });
    }
    /**
     * 获取特货代码
     */
    function getSpecialData() {
      $rootScope.loading = true;
      restAPI.specialcargo.specialcargoList.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.specialGoodsData = resp.rows || [];
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getfileData();
    }
    /**
     * 获取收单补交文件数据
     */
    function getfileData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.receiveFile.fileList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.fileData = resp.rows || [];
          angular.forEach(vm.fileData, function(v, k) {
            v.fltCode = v.fltCode === '0' ? '所有' : v.fltCode;
            v.dest = v.dest === '0' ? '所有' : v.dest;
            v.country = v.country === '0' ? '所有' : v.country;
            v.agentIataCode = v.agentIataCode === '0' ? '所有' : v.agentIataCode;
            v.specialGoodsCode = v.specialGoodsCode === '0' ? '所有' : v.specialGoodsCode;
            v.specialGoodsCode2 = v.specialGoodsCode === '0' ? '所有' : $filter('showSpCode2')(v.specialGoodsCode, vm.specialGoodsData);
          });
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      if (vm.fileObj.airLine) {
        obj.fltCode = vm.fileObj.airLine.airCode;
      }
      if (vm.fileObj.filename) {
        obj.filename = vm.fileObj.filename;
      }
      return obj;
    }
    /**
     * 新增
     */
    function add() {
      var addRuleDialog = $modal.open({
        template: require('./addReceiveFile.html'),
        controller: require('./addReceiveFile.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增收单补交文件',
              airData: vm.airData,
              airportData: vm.airportData,
              specialGoodsData: vm.specialGoodsData,
              agentIataData: vm.salesData,
              countryData: vm.countryData,
              obj: {

              }
            };
          }
        }
      });
      addRuleDialog.result.then(function(data) {
        $rootScope.loading = true;
        var obj = getAddData(data);
        restAPI.receiveFile.editFile.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增收单补交文件成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function(resp) {

      });
    }
    /**
     * 获取新增的数据
     */
    function getAddData(param) {
      var obj = {};
      obj.coding = param.coding;
      obj.filename = param.filename;
      if (!param.check.airAble) {
        var airCode = [];
        if (param.airLine.length) {
          angular.forEach(param.airLine, function(v, k) {
            airCode.push(v.airCode);
          });
        }
        obj.fltCode = airCode.join(';');
      } else {
        obj.fltCode = '0';
      }
      if (!param.check.destAble) {
        var dest = [];
        if (param.dest.length) {
          angular.forEach(param.dest, function(v, k) {
            dest.push(v.airportCode);
          });
        }
        obj.dest = dest.join(';');
      } else {
        obj.dest = '0';
      }
      if (!param.check.destAble) {
        obj.country = param.country;
      } else {
        obj.country = '0';
      }

      if (!param.check.agentAble) {
        var agentIataCode = [];
        if (param.agentIataCode.length) {
          angular.forEach(param.agentIataCode, function(v, k) {
            agentIataCode.push(v.code);
          });
        }
        obj.agentIataCode = agentIataCode.join(';');
      } else {
        obj.agentIataCode = '0';
      }
      if (!param.check.codeAble) {
        var specialGoodsCode = [];
        if (param.specialGoodsCode.length) {
          angular.forEach(param.specialGoodsCode, function(v, k) {
            specialGoodsCode.push(v.sccId);
          });
        }
        obj.specialGoodsCode = specialGoodsCode.join(';');
      } else {
        obj.specialGoodsCode = '0';
      }
      return obj;
    }
    /**
     * 编辑
     */
    function edit(param) {
      var editData = getEditData(param);
      var editRuleDialog = $modal.open({
        template: require('./addReceiveFile.html'),
        controller: require('./addReceiveFile.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑收单补交文件',
              airData: vm.airData,
              airportData: vm.airportData,
              specialGoodsData: vm.specialGoodsData,
              agentIataData: vm.salesData,
              countryData: vm.countryData,
              obj: editData
            };
          }
        }
      });
      editRuleDialog.result.then(function(data) {
        $rootScope.loading = true;
        var obj = getAddData(data);
        obj.id = param.id;
        restAPI.receiveFile.editFile.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑收单补交文件成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function(resp) {

      });
    }
    /**
     * 获取编辑数据
     */
    function getEditData(param) {
      var obj = {};
      obj.coding = param.coding;
      obj.filename = param.filename;
      obj.fltCode = param.fltCode;
      obj.dest = param.dest;
      obj.agentIataCode = param.agentIataCode;
      obj.specialGoodsCode = param.specialGoodsCode;
      obj.country = param.country;
      return obj;
    }
    /**
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + name,
              content: '你将要删除收单补交文件：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.receiveFile.delFile.save({}, {
            id: id,
            status: '1'
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除收单补交文件成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 启用/禁用
     * 
     */
    function ableSatatus(id, status) {
      restAPI.receiveFile.delFile.save({}, {
          id: id,
          status: status
        })
        .$promise.then(function(resp) {
          if (resp.ok) {
            search();
            Notification.success({
              message: '操作成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
  }
];

module.exports = angular.module('app.pactlOption.receiveFile', []).controller('receiveFileCtrl', receiveFile_fn);