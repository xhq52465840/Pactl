'use strict';

var opCert_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', '$state', '$stateParams',
  function($scope, restAPI, $modal, Notification, $rootScope, $state, $stateParams) {
    var id = '';
    var vm = $scope;
    vm.addDelay = addDelay;
    vm.audit = audit;
    vm.certObj = {};
    vm.disable = disable;
    vm.editDelay = editDelay;
    vm.editAble = true; //是否可以编辑
    vm.goodTypeData = [];
    vm.operate = operate;
    vm.removeAudit = removeAudit;
    vm.removeDelay = removeDelay;
    vm.reasonData = [];
    vm.restart = restart;
    vm.saveGoodType = saveGoodType;
    vm.stop = stop;
    vm.openDialog = openDialog;
    vm.uploadCallback = uploadCallback;

    check();

    /**
     * 
     */
    function check() {
      id = $stateParams.id;
      if (!id) {
        $state.go('index');
      } else {
        getCargoType();
      }
    }
    /**
     * 获取所有货物类型
     */
    function getCargoType() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.goodTypeData = resp.rows;
          search();
        });
    }
    /**
     * 获取证书数据
     */
    function search() {
      $rootScope.loading = true;
      restAPI.book.getkeepInfo.save({}, {
          bookId: id
        })
        .$promise.then(function(resp) {
        	console.log(resp.data)
          $rootScope.loading = false;
          if (resp.ok) {
            vm.certObj = resp.data;
            vm.certObj.progress = '';
            for (var i = 0; i < vm.certObj.pAirLineDelays.length; i++) {
              var data = vm.certObj.pAirLineDelays[i],
                index = data.id;
              for (var j = 0; j < vm.certObj.expirationDate.length; j++) {
                var data1 = vm.certObj.expirationDate[j];
                if (data1[index]) {
                  data.expirationDate = data1[index];
                  break;
                }
              }
            };
            vm.certObj.srcArr = [];
            //debugger
            var showName = 'page0';
            var screenshotPage =  vm.certObj.pOfficeInfo.screenshotPage
            if(screenshotPage<( vm.certObj.pFileRelations.length)){
            	showName = "page"+(screenshotPage-1)
            };
           // debugger
            angular.forEach(resp.data.pFileRelations, function(m, n) {
              if (!/[pP][dD][fF]/.test(m.suffix)) {
                if (m.oldName === showName) {
                  vm.certObj.filePath = m.fileHttpPath;
                  vm.certObj.imgShow = false;
                  vm.certObj.style1 = {
                    width: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.wides || 0) + 'px',
                    height: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.lengths || 0) + 'px',
                    position: 'absolute',
                    zoom: 1,
                    'z-index': 1001,
                    top: '55px',
										left: '-340px',
                    overflow: 'hidden'
                  };
                  vm.certObj.style2 = {
                    position: 'absolute',
                    'z-index': 1000,
                    width: '879px',
										height: '1242px',
                    top: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.yAxle || 0) + 'px',
                    left: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.xAxle || 0) + 'px'
                  };
                }
                vm.certObj.srcArr.push(m.fileHttpPath);
              } else {
                vm.certObj.pdfPath = m.fileHttpPath;
              }
            });
            for (var index = 0; index < vm.goodTypeData.length; index++) {
              var element = vm.goodTypeData[index];
              if (vm.certObj.pAgentShareBook.goodsType == element.id) {
                vm.certObj.goodType = element;
                break;
              }
            }
            vm.certObj.fileIds = [];
            if (vm.certObj.pAgentShareBook.auditStatus === '100') {
              vm.editAble = false;
            }
            var arr = [];
            angular.forEach(vm.certObj.pAgentShareBookAccredits, function(v, k) {
              if (v.authBookSerialNo) {
                arr.push(v);
              }
            });
            vm.certObj.pAgentShareBookAccredits = arr;
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }
    /**
     * 授权信息 编辑
     */
    function audit(param) {
      var auditDialog = $modal.open({
        template: require('./auditDialog.html'),
        controller: require('./auditDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              validilyStart: param.startTime,
              validilyEnd: param.endTime
            };
          }
        }
      });
      auditDialog.result.then(function(data) {
        var obj = {};
        obj.acId = param.acId;
        obj.startTime = data.validilyStart;
        obj.endTime = data.validilyEnd;
        $rootScope.loading = true;
        restAPI.book.opCertAuditEdit.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              param.startTime = obj.startTime;
              param.endTime = obj.endTime;
              Notification.success({
                message: '编辑成功!'
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
     * 授权信息 删除
     */
    function removeAudit(param, index) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + param.agentSales,
              content: '你将要删除' + param.agentSales + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.book.opCertAuditDel.save({}, {
            acId: param.acId
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.certObj.pAgentShareBookAccredits.splice(index, 1);
              Notification.success({
                message: '删除成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {});
    }
    /**
     * 停用/启用
     * 
     */
    function disable(param, status) {
      $rootScope.loading = true;
      restAPI.book.opCertAuditEdit.save({}, {
          acId: param.acId,
          status: status
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            param.status = status;
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
    /**
     * 添加延期信息
     */
    function addDelay() {
      var oldData = [];
      angular.forEach(vm.certObj.pAirLineDelays || [], function(v, k) {
        oldData.push(v.airCode);
      });
      var auditDialog = $modal.open({
        template: require('./addDelayDialog.html'),
        controller: require('./addDelayDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '添加延期信息',
              oldData: oldData,
              ocId: vm.certObj.pOfficeInfo.ocId,
              obj: {}
            };
          }
        }
      });
      auditDialog.result.then(function(data) {
        var obj = getAddDelayData(data);
        $rootScope.loading = true;
        restAPI.book.airdelay.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.certObj.pAirLineDelays = resp.data;
              Notification.success({
                message: '添加延期信息成功!'
              });
              search();
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
     * 编辑延期信息
     */
    function editDelay(param, index) {
      var editDialog = $modal.open({
        template: require('./addDelayDialog.html'),
        controller: require('./addDelayDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑延期信息',
              ocId: vm.certObj.pOfficeInfo.ocId,
              obj: {
                airCode: param.airCode,
                days: param.days
              }
            };
          }
        }
      });
      editDialog.result.then(function(data) {
        var obj = getAddDelayData(data, param.id);
        $rootScope.loading = true;
        restAPI.book.airdelay.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.certObj.pAirLineDelays = resp.data;
              Notification.success({
                message: '编辑延期信息成功!'
              });
              search();
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
     * 删除延期
     */
    function removeDelay(param, index) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除延期信息：' + param.airCode,
              content: '你将要删除' + param.airCode + '的延期信息。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.book.delairdelayforbooks.save({}, {
            id: param.id
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.certObj.pAirLineDelays.splice(index, 1);
              Notification.success({
                message: '删除成功'
              });
              search();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {});
    }
    /**
     * 添加延期信息 所需数据
     */
    function getAddDelayData(data, delayId) {
      return {
        id: delayId || '',
        booksId: id,
        ocId: vm.certObj.pAgentShareBook.ocId,
        alId: data.air.alId,
        airCode: data.air.airCode,
        airName: data.air.airName,
        year: vm.certObj.pAgentShareBook.validityYear,
        days: data.days || 0
      };
    }
    /**
     * 停用
     */
    function stop() {
      var stopDialog = $modal.open({
        template: require('./stopDialog.html'),
        controller: require('./stopDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '停用证书',
              obj: {}
            };
          }
        }
      });
      stopDialog.result.then(function(data) {
        $rootScope.loading = true;
        restAPI.book.updatekeepagentsb.save({}, {
            bookId: id,
            disableFlag: '1',
            disableReason: data.disableReason
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.certObj.pAgentShareBook.disableReason = data.disableReason;
              vm.certObj.pAgentShareBook.disableFlag = '1';
              Notification.success({
                message: '停用证书成功!'
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
    function restart() {
      var restartDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '启用证书',
              content: '你将要启用该证书。'
            };
          }
        }
      });
      restartDialog.result.then(function() {
        $rootScope.loading = true;
        restAPI.book.updatekeepagentsb.save({}, {
            bookId: id,
            disableFlag: '0',
            disableReason: ''
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              vm.certObj.pAgentShareBook.disableReason = '';
              vm.certObj.pAgentShareBook.disableFlag = '0';
              Notification.success({
                message: '启用证书成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {});
    }
    /**
     * 上传文件
     */
    function uploadCallback(res, params) {
      var file = res;
      if (file && file.ok) {
        params.srcArr = [];
        angular.forEach(file.data, function(v, k) {
          if (!/[pP][dD][fF]/.test(v.suffix)) {
            if (v.oldName === 'page0') {
              vm.certObj.filePath = v.fileHttpPath;
              vm.certObj.imgShow = false;
              vm.certObj.style1 = {
                width: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.wides || 0) + 'px',
                height: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.lengths || 0) + 'px',
                position: 'absolute',
                zoom: 1,
                'z-index': 1001,
                top: '100px',
                left: '-230px',
                overflow: 'hidden'
              };
              vm.certObj.style2 = {
                position: 'absolute',
                'z-index': 1000,
                width: '1240px',
                height: '1800px',
                top: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.yAxle || 0) + 'px',
                left: (vm.certObj.pOfficeInfo && vm.certObj.pOfficeInfo.xAxle || 0) + 'px'
              };
            }
            params.srcArr.push(v.fileHttpPath);
          } else {
            params.pdfPath = v.fileHttpPath;
          }
          params.fileIds.push(v.fileId);
        });
        restAPI.book.updatekeepagentsb.save({}, {
            bookId: id,
            fileIds: vm.certObj.fileIds.join(';')
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '电子文档上传成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          })
      }
    }
    /**
     * 修改货物类型
     */
    function saveGoodType() {
      $rootScope.loading = true;
      restAPI.book.updatekeepagentsb.save({}, {
          bookId: id,
          goodsType: vm.certObj.goodType ? vm.certObj.goodType.id : ''
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '货物类型修改成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        })
    }
    /**
     * 显示pdf
     */
    function openDialog(params) {
      var pdfDialog = $modal.open({
        template: require('../../../showPDF/showPDF.html'),
        controller: require('../../../showPDF/showPDF.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return params;
          }
        }
      });
    }
    /**
     * 
     */
    function operate() {
      var operateDialog = $modal.open({
        template: require('../../../operateLog/operateLog.html'),
        controller: require('../../../operateLog/operateLog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              obj: {
                sourceKey: id,
                model: 'PACTLBOOKHIS'
              }
            };
          }
        }
      });
    }
  }
];

module.exports = angular.module('app.pactlAssist.opCert', []).controller('opCertCtrl', opCert_fn);