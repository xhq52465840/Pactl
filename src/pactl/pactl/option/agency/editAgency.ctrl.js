'use strict';

var editAgency_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state',
  function($scope, Page, restAPI, $modal, Notification, $rootScope, $state) {
    var vm = $scope;
    var ocId = '';
    var screenshotPage='';
    var delayData = [];
    vm.add = add;
    vm.agentObj = {};
    vm.delays = [];
    vm.onlyNum = onlyNum;
    vm.disable = disable;
    vm.edit = edit;
    vm.goodsType = [];
    vm.pres = [];
    vm.insideSearch = insideSearch;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.save = save;
    vm.enableAgent = enableAgent;
    vm.showItem = {
      start: 0,
      end: 0
    };

    check();
    /**验证页码为正整数
     * 
     * 
     * 
     * */
    function onlyNum(param) {
        try {
          vm.agentObj.screenshotPage = vm.agentObj.screenshotPage.replace(/\D/g, '').replace(/^0*/g, '');
        } catch (error) {
          return;
        }
      }
    /**
     * 校验参数
     */
    function check() {
      ocId = $state.params.ocId;
      if (ocId) {
        search();
      } else {
        $state.go('pactlAssist.agency');
      }
    }
    /**
     * 显示延迟数据
     */
    function showDelayData(data) {
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function(resp) {
          delayData = angular.copy(resp.rows);
          angular.forEach(resp.rows, function(v, k) {
            angular.forEach(data.pGoodsTypeDelays, function(m, n) {
              if (m.goodsType === v.id) {
                v.days = m.days;
              }
            });
            angular.forEach(data.airLineDelayVos, function(v1, k1) {
              if (!v1.pGoodsTypeDelays2) {
                v1.pGoodsTypeDelays2 = new Array(delayData.length);
              }
              angular.forEach(v1.pGoodsTypeDelays, function(v2, k2) {
                if (v2.goodsType === v.id) {
                  v1.pGoodsTypeDelays2[k] = v2;
                }
              });
            });
          });
          showAirList(data.airLineDelayVos);
          vm.delays = resp.rows;
        });
    }
    /**
     * 显示航公公司
     */
    function showAirList(data) {
      vm.agentData = data;
    }
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
      restAPI.officeInfo.queryDetail.save({}, {
          "ocId": ocId,
          "screenshotPage":screenshotPage
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.pres = resp.data.airLineDelayVos;
            vm.agentObj = resp.data.pOfficeInfo;
            showDelayData(resp.data);
            showSublist();
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }
    /**
     * 分页变化
     */
    function insideSearch() {
      showSublist();
    }
    /**
     * 显示分单信息
     */
    function showSublist() {
      var resp = {
        rows: vm.pres,
        total: vm.pres.length
      };
      vm.showItem = {
        start: (vm.page.currentPage - 1) * vm.page.length - 1,
        end: vm.page.currentPage * vm.page.length
      };
      Page.setPage(vm.page, resp);
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, showSublist);
    }
    /**
     * 新增
     */
    function add() {
      var delays = angular.copy(vm.delays);
      angular.forEach(delays, function(v, k) {
        v.maxDays = v.days;
        delete v.days;
      });
      var addAirDialog = $modal.open({
        template: require('./addAgencyAir.html'),
        controller: require('./addAgencyAir.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增适用航空公司',
              obj: {
                delayData: delays
              }
            };
          }
        }
      });
      addAirDialog.result.then(function(data) {
        var obj = {};
        obj.pOfficeInfo = {
          ocId: ocId
        };
        obj.airLineDelayVos = [];
        obj.airLineDelayVos[0] = {};
        obj.airLineDelayVos[0].pAirLineDelay = {
          ocId: ocId,
          alId: data.air.alId,
          airCode: data.air.airCode,
          airName: data.air.airName,
          year: data.year
        };
        obj.airLineDelayVos[0].pGoodsTypeDelays = [];
        angular.forEach(data.delayData, function(v, k) {
          obj.airLineDelayVos[0].pGoodsTypeDelays.push({
            goodsType: v.id,
            days: v.days || 0
          });
        });
        restAPI.officeInfo.updateairdelay.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '新增适用航空公司成功'
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
     * 编辑
     */
    function edit(param) {
      var obj = {};
      obj.air = {
        airCode: param.pAirLineDelay.airCode,
        airName: param.pAirLineDelay.airName,
        alId: param.pAirLineDelay.alId,
        id: param.pAirLineDelay.id
      };
      obj.year = param.pAirLineDelay.year;
      obj.delayData = angular.copy(vm.delays);
      angular.forEach(obj.delayData, function(v, k) {
        v.maxDays = v.days || 0;
        delete v.days;
        angular.forEach(param.pGoodsTypeDelays, function(m, n) {
          if (m.goodsType === v.id) {
            v.days = m.days;
          }
        });
      });
      editDialog(obj);
    }
    /**
     * 编辑弹窗
     */
    function editDialog(param) {
      var editAirDialog = $modal.open({
        template: require('./addAgencyAir.html'),
        controller: require('./addAgencyAir.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑航空公司：' + param.air.airName,
              obj: param
            };
          }
        }
      });
      editAirDialog.result.then(function(data) {
        var obj = {};
        obj.pOfficeInfo = {
          ocId: ocId
        };
        obj.airLineDelayVos = [];
        obj.airLineDelayVos[0] = {};
        obj.airLineDelayVos[0].pAirLineDelay = {
          id: param.air.id,
          ocId: ocId,
          alId: data.air.alId,
          airCode: data.air.airCode,
          airName: data.air.airName,
          year: data.year
        };
        obj.airLineDelayVos[0].pGoodsTypeDelays = [];
        angular.forEach(data.delayData, function(v, k) {
          obj.airLineDelayVos[0].pGoodsTypeDelays.push({
            goodsType: v.id,
            days: v.days || 0
          });
        });
        restAPI.officeInfo.updateairdelay.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑航空公司成功'
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
     * 删除
     * 
     * @param {any} params
     */
    function remove(param) {
      var name = param.pAirLineDelay.airName,
        id = param.pAirLineDelay.id;
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
              content: '你将要删除航空公司' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        restAPI.officeInfo.delairdelay.save({}, {
            id: id,
            ocId: ocId
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除航空公司成功'
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
     * 启用
     */
    function disable() {
      $rootScope.loading = true;
      restAPI.officeInfo.disable.save({}, {
          ocId: ocId
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            search();
            Notification.success({
              message: '操作成功'
            });
          } else {
            Notification.error({
              message: '操作失败'
            });
          }
        });
    }
    /**
     * 保存
     */
    function save() {
      $rootScope.loading = true;
      var obj = getData();
      restAPI.officeInfo.editOffice.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存数据成功'
            });
            search();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 获取传入参数
     */
    function getData() {
      var obj = {},
        offObj = angular.copy(vm.agentObj);
      obj.pOfficeInfo = {
        ocId: offObj.ocId,
        officeCode: offObj.officeCode,
        officeName: offObj.officeName,
        shortName: offObj.shortName,
        tel: offObj.tel,
        url: offObj.url,
        accredit: offObj.accredit,
        accredit2: offObj.accredit2,
        year: offObj.year,
        xAxle: offObj.xAxle,
        yAxle: offObj.yAxle,
        lengths: offObj.lengths,
        wides: offObj.wides,
        screenshotPage:offObj.screenshotPage
      };
      obj.pGoodsTypeDelays = [];
      angular.forEach(vm.delays, function(v, k) {
        obj.pGoodsTypeDelays.push({
          goodsType: v.id,
          days: v.days
        });
      });
      return obj;
    }

    /**
     * 启动/禁用鉴定机构
     */
    function enableAgent(id, status,item) {
      restAPI.airData.delAgent.save({}, {
          id: id,
          status: status
        })
        .$promise.then(function(resp) {
          if (resp.ok) {
            Notification.success({
              message: '操作成功'
            });
            item.status = status;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
  }
];

module.exports = angular.module('app.pactlOption.editAgency', []).controller('editAgencyCtrl', editAgency_fn);