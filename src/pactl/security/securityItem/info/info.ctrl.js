'use strict';

var info_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state', '$stateParams',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $state, $stateParams) {
    var vm = $scope;
    var id = '';
    vm.aDatas = [];
    vm.back = back;
    vm.detailObj = {};
    vm.machineData = [];
    vm.pullUp = pullUp;
    vm.showRemark = showRemark;
    vm.showPdfDialog = showPdfDialog;
    vm.angetInfo = {};
    vm.showAdatas = [{
      id: '101',
      name: '首检通过'
    }, {
      id: '102',
      name: '首检待定'
    }, {
      id: '200',
      name: '安检中'
    }, {
      id: '201',
      name: '安检通过'
    }, {
      id: '202',
      name: '安检扣押'
    }, {
      id: '000',
      name: '安检注销'
    }];
    vm.showHistory = showHistory;
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

    check();

    /**
     * 校验参数
     */
    function check() {
      id = $stateParams.id;
      if (id) {
        aStatus();
      } else {
        $state.go('index');
      }
    }
    /**
     * 获取所有的安检状态
     */
    function aStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '147314998540410'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.aDatas = resp.rows;
          getMachineData();
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
          getAgentInfo();
        });
    }

    function getAgentInfo() {
      $rootScope.loading = true;
      restAPI.nameAdvice.queryAgentSystemByAwid.query({
        awId : id
      },  {})
      .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp && resp.length>0) {
            vm.angetInfo = resp[0];
          } 
          search();
        });
    }
    /**
     * 查询数据
     */
    function search() {
      $rootScope.loading = true;
      restAPI.reCheck.queryDetail.save({}, {
          awId : id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.data) {
            showData(resp.data);
          } else {
            Notification.error({
              message: '查询数据失败'
            });
          }
        });
    }

    /**
     * 历史记录
     */
    function showHistory(params) {
      var historyDialog = $modal.open({
        template: require('./detailInfo.html'),
        controller: require('./detailInfo.ctrl.js'),
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
    /**
     * 显示数据
     */
    function showData(params) {
      vm.detailObj = params;
      changeWaybillSearch();
    }
    /**
     * 返回
     */
    function back() {
      $state.go('securityItem.operate');
    }
    /**
     * 备注
     * 
     * @param {any} param
     */
    function showRemark(param, detailObj) {
      var remarkDialog = $modal.open({
        template: require('../remark/remarkDialog.html'),
        controller: require('../remark/remarkDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              awId: param.awId,
              waybillNo: vm.detailObj.airwaybill.waybillNo
            };
          }
        }
      });
      remarkDialog.result.then(function () {

      }, function (data) {
        if (detailObj) {
          detailObj.count = data;
        } else {
          param.count_remark = data + "";
        }
      });
    }
    /**
     * 显示pdf
     */
    function showPdfDialog(params) {
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
            openDialog({
              officeName: params.officeName,
              bookNo: params.bookNo,
              goodsDesc: vm.detailObj.airwaybill.goodsDesc,
              srcArr: srcArr
            });
          } else {
            Notification.error({
              message: '获取证书数据失败'
            });
          }
        });
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
    /**
     * 运单改配查询
     */
    function changeWaybillSearch() {
      restAPI.waybill.changedDetail.save({}, {
          awId: vm.detailObj.airwaybill.awId
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            if (resp.data) {
              vm.changeWaybillData = resp.data;
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        })
    }
    /**
     * 
     */
    function pullUp(params) {
      var pullDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '确认恢复',
              content: '你将要恢复该运单。此操作不能取消。'
            };
          }
        }
      });
      pullDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.preJudice.secsubpush.save({}, {
          awId: params.awId,
          parentNo: params.parent_no
        }).$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '分单恢复成功'
            });
            search();
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

module.exports = angular.module('app.securityItem.info', []).controller('infoCtrl', info_fn);