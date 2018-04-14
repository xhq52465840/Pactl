'use strict';

var msgSetting_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.addReceive = addReceive;
    vm.addSent = addSent;
    vm.baseObj = {
      type: '1',
      receiveData: [],
      sentData: []
    };
    vm.editReceive = editReceive;
    vm.editSent = editSent;
    vm.msgObj = {
      msgReadDir: '',
      data1: {},
      msgBackupDir: '',
      data2: {}
    }
    vm.msgData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remSent = remSent;
    vm.remReceive = remReceive;
    vm.save = save;
    vm.select = select;
    vm.itemObj = {};
    vm.getSentData = getSentData;

    sendTypeData();
    catalogAddrData();
    getAirportData();
    /**
     * 切换
     */
    function select(type) {
      vm.baseObj.type = type;
      vm.page.currentPage = 1;
      search();
    }
    /**
     * 获取收报目录、备份目录
     */
    function catalogAddrData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryCatalogList.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.catalogAddrData = resp.rows;
        });
    }
    /**
     * 获取发报类型
     */
    function sendTypeData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryAll.save({}, {
          flag: '2'
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.sendTypeData = resp.data;
          getAirData();
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.airData = resp.data;
          msgTypeData();
        });
    }
    /**
     * 获取报文类型
     */
    function msgTypeData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryAll.save({}, {
          flag: '3'
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.msgTypeData = resp.data;
          msgSendDirData();
        });
    }
    /**
     * 获取目的港（机场）
     */
    function getAirportData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.stationData = resp.data;
          msgSendDirData();
        });
    }
    /**
     * 获取发报目录
     */
    function msgSendDirData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryCatalogAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.msgSendDirData = resp.data;
          getMsgSetData();
          search();
        });
    }
    /**
     * 获取收报设置数据
     */
    function getReceiveData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.msgReceive.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.baseObj.receiveData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取发报设置数据
     */
    function getSentData() {
      $rootScope.loading = true;
      var obj = getSentDataCondition();
      restAPI.msgSend.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.baseObj.sentData = resp.rows;
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
      obj.flag = vm.baseObj.type;
      return obj;
    }
    function getSentDataCondition() {
       var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      obj.flag = vm.baseObj.type;
      obj.sendType = vm.itemObj.sendType ? vm.itemObj.sendType.code : '';
      obj.airId = vm.itemObj.airId ? vm.itemObj.airId.alId : '';
      obj.msgType = vm.itemObj.msgType ? vm.itemObj.msgType.code : '';
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 查询
     */
    function search() {
      if (vm.baseObj.type === '1') {
        getReceiveData();
      } else if (vm.baseObj.type === '2') {
        getSentData();
      }
    }
    /**
     * 平台收报设置
     */
    function getMsgSetData() {
      $rootScope.loading = true;
      restAPI.systemSet.queryList.save({}, $.param({
          regKeySeq: 'SYSYEM_SETTINGS_MSG'
        }))
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setMsgSetData(resp.data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 显示
     */
    function setMsgSetData(data) {
      angular.forEach(data, function(v, k) {
        switch (v.regKey) {
          case 'msgReadDir':
            vm.msgObj.data1 = angular.copy(v);
            for (var index = 0; index < vm.msgSendDirData.length; index++) {
              var element = vm.msgSendDirData[index];
              if (element.id === v.regVal) {
                vm.msgObj.msgReadDir = element;
                break;
              }
            }
            break;
          case 'msgBackupDir':
            vm.msgObj.data2 = angular.copy(v);
            for (var index = 0; index < vm.msgSendDirData.length; index++) {
              var element = vm.msgSendDirData[index];
              if (element.id === v.regVal) {
                vm.msgObj.msgBackupDir = element;
                break;
              }
            }
            break;
        }
      });
    }
    /**
     * 保存
     */
    function save() {
      var obj = [];
      if (vm.msgObj.msgReadDir) {
        vm.msgObj.data1.regVal = vm.msgObj.msgReadDir.id;
        obj.push(vm.msgObj.data1);
      }
      if (vm.msgObj.msgBackupDir) {
        vm.msgObj.data2.regVal = vm.msgObj.msgBackupDir.id;
        obj.push(vm.msgObj.data2);
      }
      $rootScope.loading = true;
      restAPI.systemSet.updateList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 新增报文收报设置
     */
    function addReceive() {
      var addDialog = $modal.open({
        template: require('./addReceive.html'),
        controller: require('./addReceive.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增报文收报设置',
              msgTypeData: vm.msgTypeData,
              catalogAddrData: vm.catalogAddrData,
              obj: {}
            };
          }
        }
      });
      addDialog.result.then(function(data) {
        var obj = recSaveData(data);
        $rootScope.loading = true;
        restAPI.msgReceive.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '新增成功'
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
     * 新增报文发报设置
     */
    function addSent() {
      var addDialog = $modal.open({
        template: require('./addSetting.html'),
        controller: require('./addSetting.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增报文发报设置',
              airData: vm.airData,
              msgTypeData: vm.msgTypeData,
              sendTypeData: vm.sendTypeData,
              stationData: vm.stationData,
              msgSendDirData: vm.msgSendDirData,
              obj: {}
            };
          }
        }
      });
      addDialog.result.then(function(data) {
        var obj = getSaveData(data);
        $rootScope.loading = true;
        restAPI.msgSend.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '新增成功，如果数据没有显示请检查查询条件'
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
     * 新增报文收报设置需要保存的数据
     */
    function recSaveData(params) {
      var obj = {};
      obj.explain = params.explain ? params.explain : '';
      params.msgType && (obj.msgType = params.msgType.code);
      params.recCatalog && (obj.recCatalog = params.recCatalog.id);
      params.recCatalog2 && (obj.recCatalog2 = params.recCatalog2.id);
      params.remark && (obj.remark = params.remark);
      return obj;
    }
    /**
     * 新增报文发报设置需要保存的数据
     */
    function getSaveData(params) {
      var obj = {};
      obj.sendType = params.sendType ? params.sendType.code : '';
      obj.airId = params.airId ? params.airId.alId : '';
      obj.msgType = params.msgType ? params.msgType.code : '';
      obj.msgVersion = params.msgVersion ? params.msgVersion : '';
      obj.msgPriority = params.msgPriority ? params.msgPriority : '';
      obj.station = params.station ? params.station.airportCode : '';
      obj.fltNo = params.fltNo ? params.fltNo : '';
      obj.explain = params.explain ? params.explain : '';
      obj.sendAddr = params.sendAddr ? params.sendAddr : '';
      obj.recAddr = params.recAddr ? params.recAddr :'';
      obj.msgSendDir = params.msgSendDir ? params.msgSendDir.id : '';
      obj.remark = params.remark ? params.remark : '';
      return obj;
    }
    /**
     * 编辑报文收报设置
     */
    function editReceive(params) {
      var editReceive = $modal.open({
        template: require('./addReceive.html'),
        controller: require('./addReceive.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑报文收报设置',
              catalogAddrData: vm.catalogAddrData,
              msgTypeData: vm.msgTypeData,
              obj: {
                explain: params.explain,
                recCatalog: params.recCatalog,
                recCatalog2: params.recCatalog2,
                remark: params.remark,
                msgType: params.msgType
              }
            };
          }
        }
      });
      editReceive.result.then(function(data) {
        var obj = recSaveData(data);
        obj.id = params.id;
        $rootScope.loading = true;
        restAPI.msgReceive.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '编辑成功'
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
     * 编辑报文发报设置
     */
    function editSent(params) {
      var editDialog = $modal.open({
        template: require('./addSetting.html'),
        controller: require('./addSetting.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑报文发报设置:' + params.msgSendSet.sendType,
              airData: vm.airData,
              msgTypeData: vm.msgTypeData,
              sendTypeData: vm.sendTypeData,
              stationData: vm.stationData,
              msgSendDirData: vm.msgSendDirData,
              obj: params.msgSendSet
            };
          }
        }
      });
      editDialog.result.then(function(data) {
        var obj = getSaveData(data);
        obj.id = params.msgSendSet.id;
        $rootScope.loading = true;
        restAPI.msgSend.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '编辑成功'
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
     * 删除报文收报设置
     */
    function remReceive(id, name) {
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
              content: '你将要删除' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        restAPI.msgReceive.delMsg.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
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

    function getSendTypeName(sendType) {
      var sendTypeName = '';
      if (sendType) {
        for (var index = 0; index < vm.sendTypeData.length; index++) {
          var element = vm.sendTypeData[index];
          if (sendType === element.code) {
            sendTypeName = element.name;
            break;
          }
        }
      }
      return sendTypeName;
    }
    /**
     * 删除报文发报设置
     */
    function remSent(id, name, item) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + getSendTypeName(name)+"/"+item.msgSendSet.msgType+"/"+item.msgSendDir.remark,
              content: '你将要删除' + getSendTypeName(name)+"/"+item.msgSendSet.msgType+"/"+item.msgSendDir.remark + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        restAPI.msgSend.delMsg.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
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
  }
];

module.exports = angular.module('app.systemSet.msgSetting', []).controller('msgSettingCtrl', msgSetting_fn);