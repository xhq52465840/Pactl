'use strict';

var car_fn = ['$scope', '$rootScope', 'restAPI', 'Notification', '$modal', '$state','Auth',
  function ($scope, $rootScope, restAPI, Notification, $modal, $state,Auth) {
    var vm = $scope;
    vm.addData = addData;
    vm.agentSalesData = [];
    vm.billObj = {
      waybill: ''
    };
    vm.carData = [];
    vm.changeText = changeText;
    vm.delAll = delAll;
    vm.carPrint = carPrint;
    vm.remove = remove;
    vm.save = save;
    vm.search = search;
    vm.waybillDatas = [];
    vm.showErrorDialog = showErrorDialog;
    vm.hasPermission = false;

    getPermission();

    function getPermission() {
      $rootScope.loading = true;
      restAPI.permission.getPermission.query({
          tokens: Auth.getUser().token,
          unitid: Auth.getUser().unit,
          resId: '888001'
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp && resp.length && resp.length>0) {
            var res = resp[0];
            if(res.resId==='888001') {

            } else {
              vm.hasPermission = true;
            }
          } else {
            vm.hasPermission = true;
          }
        });
    }

    wStatus();

    /**
     * 获取所有的运单状态
     */
    function wStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314336069737'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.waybillDatas = resp.rows;
          getAgentData();
        });
    }
    /**
     * 获取操作代理
     */
    function getAgentData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentSalesData = resp;
        });
    }


    /**
     * 查询
     */
    function search() {
      if (vm.billObj.truckBill) {
        $rootScope.loading = true;
        restAPI.car.queryAll.save({}, {
            truckBill: vm.billObj.truckBill
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              var data = resp.data.pTruckStorage;
              if (resp.data.unitDO && resp.data.unitDO.id) {
                vm.billObj.agentIata = resp.data.unitDO;
              }
              vm.billObj.truckNo = resp.data.pTruckStorage.truckNo;
              vm.carData = resp.data.simpleInfoVoList;
            } else {
              Notification.warning({
                message: resp.msg
              });
              vm.billObj.agentIata = '';
              vm.billObj.truckNo = ''
              vm.carData = [];
            }
          });
      } else {
        Notification.error({
          message: '请输入载货清单编号'
        });
      }
    }
    /**
     * 增加数据
     */
    function addData(sData, pRmk) {
      if (valid()) {
        $rootScope.loading = true;
        restAPI.car.getCarByNo.save({}, vm.billObj.waybill)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              insertData(resp.data, sData, pRmk);
            } else {
              if (resp.msg) {
                Notification.error({
                  message: resp.msg
                });
              } else {
                insertData({
                  waybillNo: vm.billObj.waybill,
                  bstatus: '无记录'
                }, sData, pRmk);
              }
            }
          });
      }
    }
    /**
     * 插入数据
     */
    function insertData(param, sData, pRmk) {
      var mark = false;
      for (var index = 0; index < vm.carData.length; index++) {
        var element = vm.carData[index];
        if (element.waybillNo === param.waybillNo) {
          mark = true;
          break;
        }
      }
      if (!mark) {
        vm.carData.push(param);
        vm.billObj.waybill = '';
      } else {
        Notification.warning({
          message: '该数据已存在'
        });
      }
      sData && sData(pRmk);
    }
    /**
     * 校验运单号是否合格
     */
    function valid() {
      vm.billObj.waybill = vm.billObj.waybill.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      if (vm.billObj.waybill.length === 11) {
        var data1 = vm.billObj.waybill.substring(3, 10);
        var data2 = vm.billObj.waybill.substring(10);
        if (data1 % 7 == data2) {
          return true;
        } else {
          Notification.error({
            message: '运单号不符合要求'
          });
          return false;
        }
      } else {
        Notification.error({
          message: '运单号不符合要求'
        });
        return false;
      }
    }
    /**
     * 删除
     */
    function remove(params, index) {
      var delTagDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + params.waybillNo,
              content: '你将要删除运单' + params.waybillNo + '。此操作不能恢复。'
            };
          }
        }
      });
      delTagDialog.result.then(function () {
        if (params.bstatus) {
          vm.carData.splice(index, 1);
        } else {
          $rootScope.loading = true;
          restAPI.car.delCar.save({}, {
              truckBill: vm.billObj.truckBill,
              waybillNo: params.waybillNo
            })
            .$promise.then(function (resp) {
              $rootScope.loading = false;
              vm.carData.splice(index, 1);
              showErrorDialog(resp.data);
            });
        }
      }, function () {

      });
    }
    /**
     * 显示error
     */
    function showErrorDialog(msg) {
      var errorDialog = $modal.open({
        template: require('../../../remove/remove1.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: msg
            };
          }
        }
      });
    }
    /**
     * 保存
     */
    function save() {
      if (vm.billObj.waybill) {
        addData(saveDataDialog);
      } else {
        saveDataDialog();
      }
    }
    /**
     * 弹窗保存
     */
    function saveDataDialog() {
      if (!vm.carData.length) {
        Notification.error({
          message: '没有数据需要保存'
        });
        return false;
      }
      var saveDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '保存清单',
              content: '你将要保存该清单的所有数据'
            };
          }
        }
      });
      saveDialog.result.then(function () {
        var callback = function () {
          Notification.success({
            message: '数据保存成功'
          });
        }
        saveData(callback);
      }, function () {

      });
    }
    /**
     * 保存接口
     */
    function saveData(callback) {
      var data = getSaveData();
      $rootScope.loading = true;
      restAPI.car.addCar.save({}, data)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            callback && callback();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 所有保存的数据
     */
    function getSaveData() {
      var data = [];
      angular.forEach(vm.carData, function (v, k) {
        data.push({
          truckBill: vm.billObj.truckBill,
          truckNo: vm.billObj.truckNo,
          agentId: vm.billObj.agentIata ? vm.billObj.agentIata.id : '',
          waybillNo: v.waybillNo
        });
      });
      return data;
    }
    /**
     * 删除
     */
    function delAll() {
      if (!vm.carData.length) {
        Notification.error({
          message: '没有数据需要删除'
        });
        return false;
      }
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除清单',
              content: '你将要删除清单。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.car.delAll.save({}, {
            truckBill: vm.billObj.truckBill
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '数据删除成功'
              });
              $state.reload();
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
     * 打印
     */
    function carPrint() {
      if (vm.billObj.waybill) {
        addData(saveData, printRemark);
      } else {
        if (!vm.carData.length) {
          Notification.error({
            message: '没有数据需要打印'
          });
          return false;
        }
        saveData(printRemark);
      }
    }
    /**
     * 打印
     */
    function doPrint() {
      $state.go('pactlPrejudice.carCode', {
        truckBill: vm.billObj.truckBill
      });
    }
    /**
     * 打印标识
     */
    function printRemark() {
      $rootScope.loading = true;
      restAPI.car.printRemark.save({}, {
          truckBill: vm.billObj.truckBill
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            doPrint();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 输入限制
     */
    function changeText() {
      try {
        vm.billObj.truckBill = vm.billObj.truckBill.replace(/[^0-9a-zA-Z]/g, '');
      } catch (error) {
        return;
      }
    }
  }
];

module.exports = angular.module('app.pactlPrejudice.car', []).controller('carCtrl', car_fn);