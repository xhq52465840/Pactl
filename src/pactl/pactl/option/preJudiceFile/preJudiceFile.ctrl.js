'use strict';

var preJudiceFile_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth', '$filter',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth, $filter) {
    var vm = $scope;
    vm.add = add;
    vm.ableSatatus = ableSatatus;
    vm.airData = [];
    vm.airportData = [];
    vm.edit = edit;
    vm.fileObj = {};
    vm.fileData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.salesData = [];
    vm.search = search;
    vm.specialGoodsData = [];

    getAirData();

    /**
     * 获取航空公司数据
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
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
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airportData = resp.data || [];
          getAgentIataData();
        });
    }
    /**
     * 获取代理人
     */
    function getAgentIataData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
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
        .$promise.then(function (resp) {
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
     * 获取代理预审文件数据
     */
    function getfileData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.preJudiceFile.fileList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.fileData = resp.rows || [];
          angular.forEach(vm.fileData, function (v, k) {
            v.airCode = v.airCode === '0' ? '所有' : v.airCode;
            v.destCode = v.destCode === '0' ? '所有' : v.destCode;
            v.agent = v.agent === '0' ? '所有' : v.agent;
            v.specialCode = v.specialCode === '0' ? '所有' : v.specialCode;
            v.specialCode2 = v.specialCode === '0' ? '所有' : $filter('showSpCode2')(v.specialCode, vm.specialGoodsData);
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
        obj.airCode = vm.fileObj.airLine.airCode;
      }
      if (vm.fileObj.type) {
        obj.type = vm.fileObj.type;
      }
      return obj;
    }
    /**
     * 新增
     */
    function add() {
      var addRuleDialog = $modal.open({
        template: require('./addPreJudiceFile.html'),
        controller: require('./addPreJudiceFile.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增代理预审文件',
              airData: vm.airData,
              airportData: vm.airportData,
              specialGoodsData: vm.specialGoodsData,
              agentIataData: vm.salesData,
              obj: {}
            };
          }
        }
      });
      addRuleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = getAddData(data);
        restAPI.preJudiceFile.editFile.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增代理预审文件成功'
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
     * 获取新增的数据
     */
    function getAddData(param) {
      var obj = {};
      obj.code = param.code;
      obj.name = param.name;
      obj.type = param.type;
      obj.upload = param.upload ? '1' : '0';
      if (!param.check.airAble) {
        var airCode = [];
        if (param.airLine.length) {
          angular.forEach(param.airLine, function (v, k) {
            airCode.push(v.airCode);
          });
        }
        obj.airCode = airCode.join(';');
      } else {
        obj.airCode = '0';
      }
      if (!param.check.destAble) {
        var dest = [];
        if (param.dest.length) {
          angular.forEach(param.dest, function (v, k) {
            dest.push(v.airportCode);
          });
        }
        obj.destCode = dest.join(';');
      } else {
        obj.destCode = '0';
      }
      if (!param.check.agentAble) {
        var agentIataCode = [];
        if (param.agentIataCode.length) {
          angular.forEach(param.agentIataCode, function (v, k) {
            agentIataCode.push(v.code);
          });
        }
        obj.agent = agentIataCode.join(';');
      } else {
        obj.agent = '0';
      }
      if (!param.check.codeAble) {
        var specialGoodsCode = [];
        if (param.specialGoodsCode.length) {
          angular.forEach(param.specialGoodsCode, function (v, k) {
            specialGoodsCode.push(v.sccId);
          });
        }
        obj.specialCode = specialGoodsCode.join(';');
      } else {
        obj.specialCode = '0';
      }
      return obj;
    }
    /**
     * 编辑
     */
    function edit(param) {
      var editData = getEditData(param);
      var editRuleDialog = $modal.open({
        template: require('./addPreJudiceFile.html'),
        controller: require('./addPreJudiceFile.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑代理预审文件',
              airData: vm.airData,
              airportData: vm.airportData,
              specialGoodsData: vm.specialGoodsData,
              agentIataData: vm.salesData,
              obj: editData
            };
          }
        }
      });
      editRuleDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = getAddData(data);
        obj.id = param.id;
        restAPI.preJudiceFile.editFile.save({}, obj)
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑代理预审文件成功'
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
     * 获取编辑数据
     */
    function getEditData(param) {
      var obj = {};
      obj.code = param.code;
      obj.name = param.name;
      obj.type = param.type;
      obj.upload = param.upload;
      obj.airCode = param.airCode;
      obj.destCode = param.destCode;
      obj.agent = param.agent;
      obj.specialCode = param.specialCode;
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
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除代理预审文件：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.preJudiceFile.delFile.save({}, {
            id: id,
            status: '1'
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除代理预审文件成功'
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
    /**
     * 启用/禁用
     * 
     */
    function ableSatatus(item, status) {
      $rootScope.loading = true;
      restAPI.preJudiceFile.delFile.save({}, {
          id: item.id,
          status: status
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            item.status = status;
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

module.exports = angular.module('app.pactlOption.preJudiceFile', []).controller('preJudiceFileCtrl', preJudiceFile_fn);