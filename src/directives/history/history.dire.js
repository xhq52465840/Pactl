'use strict';

module.exports = ['$rootScope', 'restAPI', '$modal',
  function($rootScope, restAPI, $modal) {
    return {
      restrict: 'EA',
      template: require('./history.html'),
      scope: {
        awid: '=',
        type: '@'
      },
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var vm = $scope;
        vm.auditHisroryData = [];
        vm.opHisroryData = [];
        vm.getHistoryData = getHistoryData;
        vm.openDialog = openDialog;
        vm.showMsg = showMsg;
        vm.showUserName = showUserName;
        vm.showAgentName = showAgentName;
        vm.showTerminalName = showTerminalName;
        vm.showSecurityName = showSecurityName;

        /**
         * 显示报文信息
         */
        function showMsg(params) {
          var msgDialog = $modal.open({
            template: require('../../pactl/agent/waybill/newBill/showMsg.html'),
            controller: require('../../pactl/agent/waybill/newBill/showMsg.ctrl.js'),
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function() {
                return {
                  title: '报文信息',
                  content:  params.oprnType ? params.oprnType : params.messageContent
                };
              }
            }
          });
          msgDialog.result.then(function() {

          }, function() {

          });
        }

        function getHistoryData() {
          if (vm.type === 'agent') {
            getAuditHistory('OPERATION_AGENT_TRIAL');
            getOpHistory('OPERATION_AGENT_TRIAL')
          } else if (vm.type === 'pactl') {
            getAuditHistory('OPERATION_PACTL_TRIAL;OPERATION_RECEIVING');
            getOpHistory('OPERATION_PACTL_TRIAL;OPERATION_RECEIVING');
          }
        }
        /**
         * 获取审核历史
         */
        function getAuditHistory(params) {
          restAPI.history.auditHistory.save({}, {
            awId: vm.awid,
            operationLink: params
          }).$promise.then(function(resp) {
            if (resp.total) {
              vm.auditHisroryData = resp.rows;
            }
          });
        }
        /**
         * 获取操作历史
         */
        function getOpHistory(params) {
          restAPI.history.opHistory.save({}, {
            awId: vm.awid,
            operationLink: params
          }).$promise.then(function(resp) {
            if (resp.total) {
              vm.opHisroryData = resp.rows;
              angular.forEach(vm.opHisroryData, function(v, k) {
                if (v.operationName === '添加证书' || v.operationName === '删除证书' || v.operationName === '添加其他文档' || v.operationName === '删除其他文档') {
                  v.oprnType = v.oprnType.split('*');
                }
                if (v.operationName === '收单报文' || v.operationName === '发送报文') {
                  v.oprnType = JSON.parse(v.oprnType);
                }
              });
            }
          });
        }
        /**
         * 显示pdf
         */
        function openDialog(params1, param2) {
          var toParam1 = params1.split(',');
          angular.forEach(toParam1, function(v, k) {
            if (v.indexOf('证书编号:') >= 0) {
              var arrBookNos = v.split(':');
              vm.diaBookNo = arrBookNos[1];
            }
            if (v.indexOf('鉴定机构:') >= 0) {
              var arrofficeNames = v.split(':');
              vm.diaOfficeName = arrofficeNames[1];
            }
          });
          // var data = {
          //   src: '',
          //   srcArr: []
          // };
          // param2 = angular.isArray(param2) ? param2 : [];
          // angular.forEach(param2, function(v) {
          //   if (v.suffix && /[pP][dD][fF]/.test(v.suffix)) {
          //     data.src = v.fileHttpPath;
          //   } else {
          //     data.srcArr.push(v.fileHttpPath);
          //   }
          // });
          // var pdfDialog = $modal.open({
          //   template: require('../../pactl/showPDF/showPDF.html'),
          //   controller: require('../../pactl/showPDF/showPDF.ctrl.js'),
          //   size: 'lg',
          //   backdrop: 'static',
          //   keyboard: false,
          //   resolve: {
          //     items: function() {
          //       return {
          //         src: data.src,
          //         officeName: vm.diaOfficeName,
          //         bookNo: vm.diaBookNo,
          //         srcArr: data.srcArr
          //       };
          //     }
          //   }
          // });
        }
        /**
         * 是否显示用户名
         */
        function showUserName(item, type) {
          if (type === '0') {
            return (item.checkInfoDetail.showType === 'OPERATION_AGENT_TRIAL' && (item.checkInfoDetail.operatorOprnType === 'agency' || item.checkInfoDetail.operatorOprnType === 'salesAgent')) || ((item.checkInfoDetail.showType === 'OPERATION_PACTL_TRIAL' || item.checkInfoDetail.showType === 'OPERATION_RECEIVING') && item.checkInfoDetail.operatorOprnType === 'terminal');
          } else {
            return (item.operationLink === 'OPERATION_AGENT_TRIAL' && (item.operatorOprnType === 'agency' || item.operatorOprnType === 'salesAgent')) || ((item.operationLink === 'OPERATION_PACTL_TRIAL' || item.operationLink === 'OPERATION_RECEIVING') && item.operatorOprnType === 'terminal');
          }
        }
        /**
         * 是否显示用户名为货站
         */
        function showTerminalName(item, type) {
          if (type === '0') {
            return item.checkInfoDetail.showType === 'OPERATION_AGENT_TRIAL' && item.checkInfoDetail.operatorOprnType === 'terminal';
          } else {
            return item.operationLink === 'OPERATION_AGENT_TRIAL' && item.operatorOprnType === 'terminal';
          }
        }

        function showSecurityName(item, type) {
          if (type === '0') {
            return item.checkInfoDetail.operatorOprnType === 'security';
          } else {
            return item.operatorOprnType === 'security';
          }
        }
        /**
         * 是否显示用户名为代理
         */
        function showAgentName(item, type) {
          if (type === '0') {
            return (item.checkInfoDetail.showType === 'OPERATION_PACTL_TRIAL' || item.checkInfoDetail.showType === 'OPERATION_RECEIVING') && (item.checkInfoDetail.operatorOprnType === 'agency' || item.checkInfoDetail.operatorOprnType === 'salesAgent');
          } else {
            return (item.operationLink === 'OPERATION_PACTL_TRIAL' || item.operationLink === 'OPERATION_RECEIVING') && (item.operatorOprnType === 'agency' || item.operatorOprnType === 'salesAgent');
          }
        }
        $scope.$on('history-records', function(event, data) {
          getHistoryData();
        });
      }],
      link: function(scope, element, attrs, ctrls, transcludeFn) {
        scope.$watch('awid', function(newVal, oldVal) {
          if (newVal) {
            scope.getHistoryData();
          }
        });
      }
    }
  }
];