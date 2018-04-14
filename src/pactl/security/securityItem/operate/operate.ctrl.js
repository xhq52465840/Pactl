'use strict';

var operate_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$filter',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $filter) {
    var vm = $scope;
    vm.airportData = [];
    vm.aisleData = [];
    vm.checkStation = checkStation;
    vm.checkFstatus = checkFstatus;
    vm.checkStatus = checkStatus;
    vm.dangerData = [];
    vm.goodTypeData = [{
      id: '0',
      name: '普货'
    }, {
      id: '1',
      name: '危险品'
    }, {
      id: '2',
      name: '24小时货'
    }];
    vm.operateObj = {
      status: [],
      station: [],
      fstatus: []
    };
    vm.operateData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.pass = pass;
    vm.refuse = refuse;
    vm.reset = reset;
    vm.returnedData = [{
      id: '0',
      name: '部分退运'
    }, {
      id: '1',
      name: '全部退运'
    }];
    vm.remove = remove;
    vm.save = save;
    vm.search = search;
    vm.selectStatus = selectStatus;
    vm.selectStation = selectStation;
    vm.selectFstatus = selectFstatus;
    vm.seizureData = [];
    vm.showReason = showReason;
    vm.showRemark = showRemark;
    vm.showPdfDialog = showPdfDialog;
    vm.showErrorDialog = showErrorDialog;
    vm.stationData = [];
    vm.refreshDest = refreshDest;
    vm.showText = {
      total_count: 0,
      gross_weight: 0
    };
    vm.selectedAwid;
    vm.tr_mouseenter = tr_mouseenter;
    vm.tr_mouseleave = tr_mouseleave;
    vm.informalRule = '';

    getInformalRule();

    function getInformalRule() {
      $rootScope.loading = true;
      restAPI.systemSet.querySingleSet.save({}, 'informalRule')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length > 0) {
            vm.informalRule = resp.data.regVal;
          }
        });
    }

    getStationData();

    /**
     * 获取货站
     */
    function getStationData() {
      $rootScope.loading = true;
      restAPI.cargoStation.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.stationData = resp.data;
          getMachineData();
        });
    }
    /**
     * 
     * 根据参数查询机场数据
     * 
     * @param {any} param
     */
    function refreshDest(param) {
      var searchObj = {};
      vm.airportData = [];
      if (param) {
        searchObj = {
          airportCode: param
        };
      } else {
        searchObj = {
          airportCode: param,
          isCommon: '1'
        };
      }
      restAPI.airPort.queryList.save({}, searchObj)
        .$promise.then(function (resp) {
          vm.airportData = resp.rows;
        });
    }
    /**
     * 获取目的港
     */
    function getAirportData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airportData = resp.data;
        });
    }
    /**
     * 获取安检机
     */
    function getMachineData() {
      $rootScope.loading = true;
      restAPI.machine.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.machineData = resp.data;
          getAisle();
        });
    }
    /**
     * 24小时货通道
     */
    function getAisle(params) {
      $rootScope.loading = true;
      restAPI.aisle.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.aisleData = resp.rows;
          getSeizure();
        });
    }
    /**
     * 获取扣押库
     */
    function getSeizure() {
      $rootScope.loading = true;
      restAPI.seizure.queryAvailable.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.seizureData = resp.list;
          getDanger();
        });
    }
    /**
     * 获取危险品分类
     */
    function getDanger() {
      $rootScope.loading = true;
      restAPI.danger.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.dangerData = resp.rows;
        });
    }
    /**
     * 查询
     */
    function search() {
      getOperateData();
    }
    /**
     * 获取操作数据
     */
    function getOperateData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.reCheck.operateList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          angular.forEach(resp.rows, function (m, n) {
            if (m.goods_desc) {
              m.goods_desc1 = m.goods_desc.length > 3 ? m.goods_desc.substring(0, 3) + '...' : m.goods_desc;
              m.div = '<div class="pre-name" style="width:100%;word-break:break-all ">' + m.goods_desc + '</div>';
            }
            if (m.goods_class) {
              angular.forEach(vm.goodTypeData, function (v, k) {
                if (v.id === m.goods_class) {
                  m.goods_class = v;
                }
              });
              for (var index = 0; index < vm.seizureData.length; index++) {
                var element = vm.seizureData[index];
                if (m.warehouse === element.id) {
                  m.seizure = element;
                  break;
                }
              }
              var dgoodsflagIds = m.dgoodsflag && m.dgoodsflag.split(',');
              m.danger = [];
              angular.forEach(dgoodsflagIds, function (v, k) {
                for (var index = 0; index < vm.dangerData.length; index++) {
                  var element = vm.dangerData[index];
                  if (v === element.id) {
                    m.danger.push(element);
                    break;
                  }
                }
              });
            }
            restAPI.reCheck.queryCheckHistory.save({}, {
              awId: m.awId
            }).$promise.then(function (rep) {
              if (rep.ok) {
                m.table = '<table class="table content-main-table" style="width: 400px;"><thead><tr><th class="w30">安检机</th><th class="w40">安检时间</th><th class="w30">安检人员</th></tr></thead><tbody>';
                angular.forEach(rep.data, function (v1, k1) {
                  m.table += '<tr>' +
                    '<td>' + v1.machine + '</td>' +
                    '<td>' + $filter('date')(v1.operatdate, 'yyyy-MM-dd HH:mm:ss') + '</td>' +
                    '<td>' + v1.personid + '</td>' +
                    '</tr>';
                });
                m.table += '</tbody></table>';
              }
            });
          });
          vm.operateData = resp.rows;
          vm.showText.total_count = resp.total_count || 0;
          vm.showText.gross_weight = resp.gross_weight || 0;
          Page.setPage(vm.page, resp);
        });
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
      obj.waybillno = vm.operateObj.waybillno;
      obj.stime = vm.operateObj.stime;
      obj.etime = vm.operateObj.etime;
      obj.flight = vm.operateObj.flight;
      obj.flt_date = vm.operateObj.flt_date;
      if (vm.operateObj.dest1) {
        obj.dest1 = vm.operateObj.dest1.airportCode;
      }
      if (vm.operateObj.aisle24) {
        obj.aisle24 = vm.operateObj.aisle24.id;
      }
      if (vm.operateObj.goods_class) {
        obj.goods_class = vm.operateObj.goods_class.id;
      }
      if (vm.operateObj.machine) {
        obj.machine = vm.operateObj.machine.id;
      }
      obj.status = vm.operateObj.status.join(';');
      obj.ct = vm.operateObj.station.join(';');
      obj.fstatus = vm.operateObj.fstatus.join(';');
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
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
      if (vm.operateData.length === 0) {
        Notification.error({
          message: '当前没有数据需要保存'
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
              title: '保存',
              content: '你将要保存数据。'
            };
          }
        }
      });
      saveDialog.result.then(function () {
        var obj = [];
        angular.forEach(vm.operateData, function (v, k) {
          var danger = [];
          angular.forEach(v.danger, function (m, n) {
            danger.push(m.id);
          });
          obj.push({
            awId: v.awId,
            waybill_no: v.waybill_no,
            goodsclass: v.goods_class.id,
            warehouse: (v.seizure ? v.seizure.id : ''),
            distressPlace: v.distressPlace,
            dgoodsflag: danger.join(','),
            flag: (v.a_flag === '1' || v.a_flag === true) ? '1' : '0',
            turnin: (v.turnin === '1' || v.turnin === true) ? '1' : '0',
            exMark: (v.exMark === '1' || v.exMark === true) ? '1' : '0',
          });
        });
        $rootScope.loading = true;
        restAPI.reCheck.updateCheck.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.no === 0) {
              Notification.success({
                message: resp.msg
              });
              search();
            } else {
              showErrorDialog(resp.fasleNo || resp.msg);
            }
          });
      }, function () {

      });
    }
    /**
     * 重置
     */
    function reset() {
      vm.operateObj = {
        status: [],
        station: [],
        fstatus: []
      };
      vm.operateData = [];
    }
    /**
     * 货站check
     */
    function checkStation(data) {
      if (vm.operateObj.station.indexOf(data) > -1) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 首检状态check
     */
    function checkFstatus(data) {
      if (vm.operateObj.fstatus.indexOf(data) > -1) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 安检状态 check
     */
    function checkStatus(data) {
      if (vm.operateObj.status.indexOf(data) > -1) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 安检状态 选择
     */
    function selectStatus($e, data) {
      var checkbox = $e.target,
        index = vm.operateObj.status.indexOf(data);
      checkbox.checked ? vm.operateObj.status.push(data) : vm.operateObj.status.splice(index, 1);
    }
    /**
     * 货站选择
     */
    function selectStation($e, data) {
      var checkbox = $e.target,
        index = vm.operateObj.station.indexOf(data);
      checkbox.checked ? vm.operateObj.station.push(data) : vm.operateObj.station.splice(index, 1);
    }
    /**
     * 首检状态 选择
     */
    function selectFstatus($e, data) {
      var checkbox = $e.target,
        index = vm.operateObj.fstatus.indexOf(data);
      checkbox.checked ? vm.operateObj.fstatus.push(data) : vm.operateObj.fstatus.splice(index, 1);
    }
    /**
     * 原因
     * 
     * @param {any} param
     */
    function showReason(param) {
      var remarkDialog = $modal.open({
        template: require('../reCheck/reasonDialog.html'),
        controller: require('../reCheck/reasonDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              reasonData: param.sremark,
              waybill_no: param.waybill_no
            };
          }
        }
      });
    }
    /**
     * 备注
     * 
     * @param {any} param
     */
    function showRemark(param) {
      var remarkDialog = $modal.open({
        template: require('../reCheck/remarkDialog.html'),
        controller: require('../reCheck/remarkDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              awId: param.awId,
              isAll: '1'
            };
          }
        }
      });
      remarkDialog.result.then(function () {

      }, function (data) {
        param.count_remark = data;
      });
    }
    /**
     * 扣押原因
     */
    function refuse(param) {
      if (param.sstatus === '0') {
        if ((param.returned || param.turnin === '1')) {
          Notification.error({
            message: '该运单已退运或上交相关部门，无法取消扣押'
          });
        } else {
          refuseNo(param);
        }
      } else {
        refuseYes(param);
      }
    }
    /**
     * 取消扣押
     */
    function refuseNo(param) {
      var cleDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '取消扣押',
              content: '你将要取消扣押。'
            };
          }
        }
      });
      cleDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.reCheck.cancelStatus.save({}, {
            awId: param.awId,
            sstatus: '0'
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              param.sstatus = '';
              param.seizure = '';
              param.distressPlace = '';
              param.danger = '';
              Notification.success({
                message: '取消扣押成功'
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
     * 扣押
     */
    function refuseYes(param) {
      var refuseDialog = $modal.open({
        template: require('../reCheck/reason.html'),
        controller: require('../reCheck/reason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '未通过原因列表',
              type: '0',
              fStatus: param.fstatus,
              sStatus: param.sstatus,
              billNo: param.waybill_no,
              reasonData: vm.reasonData,
              seizureData: vm.seizureData,
              dangerData: vm.dangerData
            };
          }
        }
      });
      refuseDialog.result.then(function (data) {
        var dangerIds = [];
        angular.forEach(data.danger, function (v, k) {
          dangerIds.push(v.id);
        });
        restAPI.reCheck.updateStatus.save({}, {
            awId: param.awId,
            sstatus: '0',
            remark: JSON.stringify(data.remarkData),
            warehouse: data.seizure.id,
            dgoodsflag: dangerIds.join(','),
            distressPlace: data.distressPlace
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              param.sstatus = '0';
              param.seizure = data.seizure;
              param.distressPlace = data.distressPlace;
              param.danger = data.danger;
              param.sremark.push({
                remark: JSON.stringify(data.remarkData)
              });
              Notification.success({
                message: '扣押成功'
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
     * 通过原因
     */
    function pass(param) {
      if (param.sstatus === '1') {
        if ((param.a_flag === '1' || param.returned)) {
          Notification.error({
            message: '该运单已注销或已退运，无法取消通过'
          });
        } else {
          passNo(param);
        }
      } else {
        if (param.fstatus === '0' || param.sstatus === '0') {
          passYesWithReason(param);
        } else {
          passYes(param);
        }
      }
    }

    /**
     * 通过需要填原因
     */
    function passYesWithReason(param) {
      var passDialog = $modal.open({
        template: require('../reCheck/reason.html'),
        controller: require('../reCheck/reason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '通过原因列表',
              type: '1',
              fStatus: param.fstatus,
              sStatus: param.sstatus,
              billNo: param.waybill_no,
              reasonData: vm.reasonData,
              seizureData: vm.seizureData,
              dangerData: vm.dangerData
            };
          }
        }
      });
      passDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.reCheck.updateStatus.save({}, {
            awId: param.awId,
            sstatus: '1',
            remark: JSON.stringify(data.remarkData)
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              param.sstatus = '1';
              param.seizure = '';
              param.danger = '';
              param.sremark.push({
                remark: JSON.stringify(data.remarkData)
              });
              Notification.success({
                message: '通过成功'
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
     * 通过不需要填原因
     */
    function passYes(param) {
      var passDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '通过',
              content: '你将要通过运单' + param.waybill_no + '的复检。'
            };
          }
        }
      });
      passDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.reCheck.updateStatus.save({}, {
            awId: param.awId,
            sstatus: '1',
            remark: ''
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              param.sstatus = '1';
              param.seizure = '';
              param.danger = '';
              Notification.success({
                message: '通过成功'
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
     * 取消通过
     */
    function passNo(param) {
      var cleDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '取消通过',
              content: '你将要取消通过。'
            };
          }
        }
      });
      cleDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.reCheck.cancelStatus.save({}, {
            awId: param.awId,
            sstatus: '1'
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              param.sstatus = '';
              param.seizure = '';
              param.danger = '';
              Notification.success({
                message: '取消通过成功'
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
     * 删除
     */
    function remove(param, index) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + param.waybill_no,
              content: '你将要删除运单' + param.waybill_no + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.reCheck.delList.save({}, {
            awId: param.awId
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '删除运单成功'
              });
              vm.operateData.splice(index, 1);
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
     * 显示pdf
     */
    function showPdfDialog(params, goodsDesc, item) {
      $rootScope.loading = true;
      restAPI.reCheck.getBookPDF.save({}, {
          bookId: params.bookId || params.id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.msg === 'ok') {
            var srcArr = [];
            angular.forEach(resp.data, function (m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                m.src = m.fileHttpPath;
              } else {
                srcArr.push(m.fileHttpPath);
              }
            });
            vm.selectedAwid  = item.awId;
            openDialog({
              officeName: params.officeName,
              bookNo: params.bookNo,
              goodsDesc: goodsDesc,
              srcArr: srcArr,
              waybill_no : item.waybill_no
            });
          } else {
            Notification.error({
              message: '获取证书数据失败'
            });
          }
        });
    }

    function tr_mouseenter(item) {
      if(vm.selectedAwid) {
        if(vm.selectedAwid  !== item.awId) {
          delete vm.selectedAwid;
        }
      }
    }

    function tr_mouseleave(item) {
    }
    /**
     * 
     */
    function openDialog(params) {
      var pdfDialog = $modal.open({
        template: require('../../../showPDF/showPDF.html'),
        controller: require('../../../showPDF/showPDF.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return params;
          }
        }
      });
    }
  }
];

module.exports = angular.module('app.securityItem.operate', []).controller('operateCtrl', operate_fn);