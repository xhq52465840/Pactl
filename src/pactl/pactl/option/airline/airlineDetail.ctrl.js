'use strict';

var airlineDetail_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$state', '$stateParams',
  function($scope, Page, restAPI, $modal, Notification, $rootScope, $state, $stateParams) {
    var alid = null;
    var vm = $scope;
    var paramId = null;
    var delayData = [];
    vm.agentSalesData = [];
    vm.addMsg = addMsg;
    vm.airObj = {
      file: null
    };
    vm.delays = [];
    vm.changeAirCode = changeAirCode;
    vm.changeDestCode = changeDestCode;
    vm.changeTel = changeTel;
    vm.changeFax = changeFax;
    vm.changeEmail = changeEmail;
    vm.disableMsg = disableMsg;
    vm.editMsg = editMsg;
    vm.editAgent = editAgent;
    vm.enableMsg = enableMsg;
    vm.enableAgent = enableAgent;
    vm.errData = [];
    vm.msgData = [];
    vm.sentData = [];
    vm.officeInfoList = [];
    vm.removeMsg = removeMsg;
    vm.removeAgent = removeAgent;
    vm.save = save;
    vm.saveAgent = saveAgent;
    vm.search = search;
    vm.typeData = [];
    vm.uploadCallback = uploadCallback;
    vm.onlyNum = onlyNum;
    vm.showDelayData = showDelayData;
    vm.remSent = remSent;
    vm.editSent = editSent;
    vm.addSent = addSent;
    vm.getSentData = getSentData;
    vm.stationData = [];
    vm.sendTypeData = [];
    vm.msgSendDirData = [];
    vm.msgTypeData = [];

    check();

    /**
     * 检测id
     */
    function check() {
      alid = $stateParams.alid;
      if (alid) {
        getMsgType();
      }
    }
    /**
     * 获取报文类型
     */
    function getMsgType() {
      restAPI.baseData.queryAll.save({}, {
          type: '1477297709317897',
          status: '0'
        })
        .$promise.then(function(resp) {
          vm.typeData = resp.rows;
          getOffice();
        });
    }
    /**
     * 获取鉴定机构
     */
    function getOffice() {
      $rootScope.loading = true;
      restAPI.officeInfo.queryAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.officeCodeData = resp.rows;
          getAgentData();
        });
    }
    /**
     * 获取操作代理
     */
    function getAgentData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.agentSalesData = resp;
          sendTypeData();
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
          var data = resp.data;
          vm.sendTypeData = [];
          if(data && data.length>0) {
            angular.forEach(data, function(v, k) {
              if (v.code !== 'herms') {
                vm.sendTypeData.push(v);
              }
            });
          }
          getMsgTypeData();
        });
    }
    /**
     * 获取报文类型
     */
    function getMsgTypeData() {
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
     * 获取发报目录
     */
    function msgSendDirData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryCatalogAll.save({}, {})
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.msgSendDirData = resp.data;
          search();
        });
    }


    /**
     * 查询
     */
    function search() {
      getAirData();
    }

    /**
     * 获取航空公司数据
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryOne.save({}, {
          alId: alid
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setBaseData(resp.data.pApplyAirLine);
            setMsgData(resp.data.msgAddrs || []);
            setOffice(resp.data.officeInfoList || [])
            setParam(resp.data.pAirParam || {});
            getSentData();
          }
          vm.airData = resp.rows;
        });
    }
    /**
     * 基本信息
     */
    function setBaseData(data) {
      vm.airObj.airCode = data.airCode;
      vm.airObj.destCode = data.destCode;
      vm.airObj.airName = data.airName;
      vm.airObj.tel = data.tel;
      vm.airObj.fax = data.fax;
      vm.airObj.email = data.email;
      vm.airObj.fileObj = {
        id: data.fileId,
        url: data.filePath
      };
    }
    /**
     * 报文地址
     */
    function setMsgData(data) {
      vm.msgData = data;
    }
    /**
     * 鉴定机构
     */
    function setOffice(data) {
      showDelayData(data);
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
            angular.forEach(data, function(v1, k1) {
              if (!v1.pGoodsTypeDelays2) {
                v1.pGoodsTypeDelays2 = new Array(delayData.length);
              }
              angular.forEach(v1.goodsTypeDelayList, function(v2, k2) {
                if (v2.goodsType === v.id) {
                  v1.pGoodsTypeDelays2[k] = v2;
                }
              });
            });
          });
          vm.delays = resp.rows;
        });
        vm.officeInfoList = data;
    }
    /**
     * 设置参数
     */
    function setParam(param) {
      if (param.paramId) {
        paramId = param.paramId;
      } else {
        param.pullSubwaybill = "1";
        param.ewaybillRange = "1";
        param.errorType = "1";
      }
      vm.airObj.weight = param.weight || 1000;
      vm.airObj.innerDiffer = param.innerDiffer || 30;
      vm.airObj.outterDiffer = param.outterDiffer || 3;
      vm.airObj.chargeDiffer = param.chargeDiffer || '';
      vm.airObj.errorType = param.errorType;
      vm.airObj.printFormat = param.printFormat;
      vm.airObj.liBatteryDeclear = param.liBatteryDeclear;
      vm.airObj.ewaybillRange = param.ewaybillRange;
      vm.airObj.msgSendFunction = param.msgSendFunction === "1";
      vm.airObj.pullSubwaybill = param.pullSubwaybill === "1";
      vm.airObj.forbid24Goods = param.forbid24Goods  === "1";
      vm.airObj.subRsRequired = param.subRsRequired  === "1";
      vm.airObj.liSection2 = param.liSection2 === "1";
      vm.airObj.repeatDays = param.repeatDays;
     	 vm.airObj.shcCode = param.shcCode;
      /**
       * 例外货代
       */
      if (param.exceptAgentId) {
        var exceptAgentId = param.exceptAgentId.split(';');
        vm.airObj.exceptAgentId = [];
        angular.forEach(exceptAgentId, function(v, k) {
          for (var index = 0; index < vm.agentSalesData.length; index++) {
            var element = vm.agentSalesData[index];
            if (element.id == v) {
              vm.airObj.exceptAgentId.push(element);
              break;
            }
          }
        })
      }

      vm.airObj.createId = param.createId;
      vm.airObj.createTime = param.createTime;
      vm.airObj.creater = param.creater;
      vm.airObj.delStatus = param.delStatus;
    }

    /**
     * 保存
     */
    function save() {
      if (vm.errData.length) {
        Notification.error({
          message: '有数据出错，请修改'
        });
        return false;
      }
      var obj = getData();
      $rootScope.loading = true;
      restAPI.airData.addAir.save({}, obj)
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
     * 获取保存参数
     */
    function getData() {
      var obj = {},
        air = angular.copy(vm.airObj);
      obj.pApplyAirLine = {
        airCode: air.airCode,
        destCode: air.destCode,
        airName: air.airName,
        tel: air.tel,
        fax: air.fax,
        email: air.email,
        alId: alid
      };
      if (air.fileObj && air.fileObj.id) {
        obj.pApplyAirLine.fileId = air.fileObj.id;
      }
      obj.pAirParam = {};
      obj.pAirParam.weight = air.weight || 1000;
      obj.pAirParam.innerDiffer = air.innerDiffer || 30;
      obj.pAirParam.outterDiffer = air.outterDiffer || 3;
      if (air.chargeDiffer && air.chargeDiffer !== '') {
        obj.pAirParam.chargeDiffer = air.chargeDiffer;
      }
      obj.pAirParam.errorType = air.errorType;
      obj.pAirParam.printFormat = air.printFormat;
      obj.pAirParam.liBatteryDeclear = air.liBatteryDeclear;
      obj.pAirParam.ewaybillRange = air.ewaybillRange;
      obj.pAirParam.msgSendFunction = air.msgSendFunction ? '1' : '0';
      obj.pAirParam.pullSubwaybill = air.pullSubwaybill ? '1' : '0';
      obj.pAirParam.forbid24Goods = air.forbid24Goods ? '1' : '0';
      obj.pAirParam.subRsRequired = air.subRsRequired ? '1' : '0';
      obj.pAirParam.liSection2 = air.liSection2 ? '1' : '0';
      var exceptAgentId = air.exceptAgentId;
      obj.pAirParam.exceptAgentId = [];
      angular.forEach(exceptAgentId, function(v, k) {
        obj.pAirParam.exceptAgentId.push(v.id);
      });
      obj.pAirParam.exceptAgentId = obj.pAirParam.exceptAgentId.join(';');
      obj.pAirParam.repeatDays = air.repeatDays;
      obj.pAirParam.shcCode = air.shcCode;
      obj.pAirParam.createId = vm.airObj.createId;
      obj.pAirParam.createTime = vm.airObj.createTime;
      obj.pAirParam.creater = vm.airObj.creater;
      obj.pAirParam.delStatus = vm.airObj.delStatus;
      if (paramId) {
        obj.pAirParam.paramId = paramId;
      }
      return obj;
    }

    function onlyNum(param) {
      try {
        vm.airObj[param] = vm.airObj[param].replace(/\D/g, '').replace(/^0*/g, '');
      } catch (error) {
        return;
      }
    }
    /**
     * 上传文件
     */
    function uploadCallback(res, param) {
      var file = res;
      var respDt = file.data;
      if (file && file.ok) {
        vm.airObj.fileObj = {
          id: respDt.fileId,
          url: respDt.fileHttpPath
        };
      } else {
        Notification.error({
          message: '上传失败'
        });
      }
    }
    /**
     * 新增报文地址
     */
    function addMsg() {
      var addMsgDialog = $modal.open({
        template: require('./addMsg.html'),
        controller: require('./addMsg.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增报文地址',
              obj: {

              },
              typeData: vm.typeData
            };
          }
        }
      });
      addMsgDialog.result.then(function(data) {
        var obj = {};
        obj.alId = alid;
        obj.address = data.address;
        obj.addExplain = data.addExplain;
        obj.messageType = data.messageType.id;
        restAPI.airData.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              searchMsgById();
              Notification.success({
                message: '新增报文地址成功'
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
     * 根据航空公司id查找报文地址
     */
    function searchMsgById() {
      $rootScope.loading = true;
      restAPI.airData.queryMsg.save({}, {
          alId: alid
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.msgData = resp.data;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 编辑报文地址
     */
    function editMsg(item) {
      var editObj = {};
      angular.forEach(vm.typeData, function(v, k) {
        if (v.id === item.messageType) {
          editObj.messageType = v;
        }
      });
      editObj.address = item.address;
      editObj.addExplain = item.addExplain;
      var editMsgDialog = $modal.open({
        template: require('./addMsg.html'),
        controller: require('./addMsg.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑报文地址',
              obj: editObj,
              typeData: vm.typeData
            };
          }
        }
      });
      editMsgDialog.result.then(function(data) {
        var obj = {};
        obj.alId = alid;
        obj.msgAddrId = item.msgAddrId;
        obj.address = data.address;
        obj.addExplain = data.addExplain;
        obj.messageType = data.messageType.id;
        restAPI.airData.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              searchMsgById();
              Notification.success({
                message: '编辑报文地址成功'
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
     * 启动报文地址 
     */
    function enableMsg(id) {
      restAPI.airData.enableMsg.save({}, {
          msgAddrId: id
        })
        .$promise.then(function(resp) {
          if (resp.ok) {
            searchMsgById();
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
     * 停用报文地址
     * 
     */
    function disableMsg(id) {
      restAPI.airData.disableMsg.save({}, {
          msgAddrId: id
        })
        .$promise.then(function(resp) {
          if (resp.ok) {
            searchMsgById();
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
     * 删除报文地址
     * 
     */
    function removeMsg(id, name) {
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
              content: '你将要删除报文地址' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        restAPI.airData.delMsg.save({}, {
            msgAddrId: id
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              searchMsgById();
              Notification.success({
                message: '删除报文地址成功'
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
     * 获取发报设置数据
     */
    function getSentData() {
      $rootScope.loading = true;
      var obj = getSentDataCondition();
      restAPI.msgSend.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.sentData = resp.rows;
        });
    }
    function getSentDataCondition() {
       var obj = {
        rows: 100000,
        page: 1
      };
      obj.flag = '2';
      obj.airId = alid;
      return obj;
    }
    /**
     * 新增报文发报设置
     */
    function addSent() {
      var addDialog = $modal.open({
        template: require('../../../system/systemSet/msgSetting/addSetting.html'),
        controller: require('../../../system/systemSet/msgSetting/addSetting.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增报文发报设置',
              airData: [],
              notShowAirData: "1",
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
              getSentData();
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
        template: require('../../../system/systemSet/msgSetting/addSetting.html'),
        controller: require('../../../system/systemSet/msgSetting/addSetting.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑报文发报设置:' + params.msgSendSet.sendType,
              airData: [],
              notShowAirData: "1",
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
              getSentData();
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
              getSentData();
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
     * 新增报文发报设置需要保存的数据
     */
    function getSaveData(params) {
      var obj = {};
      obj.sendType = params.sendType ? params.sendType.code : '';
      obj.airId = alid;
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
     * 校验二字码
     */
    function changeAirCode() {
      try {
        vm.airObj.airCode = vm.airObj.airCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        var index = vm.errData.indexOf('airCode');
        if (/^[A-Z0-9]{2}$/g.test(vm.airObj.airCode)) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errData.push('airCode');
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 校验三字码
     */
    function changeDestCode() {
      try {
        vm.airObj.destCode = vm.airObj.destCode.replace(/[^0-9]/g, '').toUpperCase();
        var index = vm.errData.indexOf('destCode');
        if (/^[0-9]{3}$/g.test(vm.airObj.destCode)) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errData.push('destCode');
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 校验tel
     */
    function changeTel() {
      try {
        vm.airObj.tel = vm.airObj.tel.replace(/[^0-9\-]/g, '');
        var index = vm.errData.indexOf('tel');
        if (!vm.airObj.tel) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
          return;
        }
        if (/^[0-9\-]+$/g.test(vm.airObj.tel)) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errData.push('tel');
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 校验fax
     */
    function changeFax() {
      try {
        vm.airObj.fax = vm.airObj.fax.replace(/[^0-9\-]/g, '');
        var index = vm.errData.indexOf('fax');
        if (!vm.airObj.fax) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
          return;
        }
        if (/^[0-9\-]+$/g.test(vm.airObj.fax)) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errData.push('fax');
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 校验email
     */
    function changeEmail() {
      try {
        var index = vm.errData.indexOf('email');
        if (!vm.airObj.email) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
          return;
        }
        if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(vm.airObj.email)) {
          if (index > -1) {
            vm.errData.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.errData.push('email');
          }
        }
      } catch (error) {
        return;
      }
    }
    /**
     * 新增适用的鉴定机构
     */
    function saveAgent() {
      var addAgentDialog = $modal.open({
        template: require('./addAgent.html'),
        controller: require('./addAgent.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增适用的鉴定机构',
              officeCodeData: vm.officeCodeData,
              obj: {

              }
            };
          }
        }
      });
      addAgentDialog.result.then(function(data) {
        var obj = {};
        obj.alId = alid;
        obj.ocId = data.officeCode.ocId;
        obj.days = data.days;
        obj.year = data.year;
        restAPI.airData.addAgent.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              searchAgentById();
              Notification.success({
                message: '新增适用的鉴定机构'
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
     * 编辑鉴定机构
     */
    function editAgent(item) {
      var editObj = {};
      angular.forEach(vm.officeCodeData, function(v, k) {
        if (v.ocId === item.officeInfo.ocId) {
          editObj.officeCode = v;
        }
      });
      editObj.days = item.airLineDelay.days;
      editObj.year = item.airLineDelay.year;
      var editAgentDialog = $modal.open({
        template: require('./addAgent.html'),
        controller: require('./addAgent.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑适用的鉴定机构',
              obj: editObj,
              officeCodeData: vm.officeCodeData
            };
          }
        }
      });
      editAgentDialog.result.then(function(data) {
        var obj = {};
        obj.alId = alid;
        obj.ocId = data.officeCode.ocId;
        obj.days = data.days;
        obj.year = data.year;
        obj.id = item.airLineDelay.id;
        restAPI.airData.addAgent.save({}, obj)
          .$promise.then(function(resp) {
            if (resp.ok) {
              searchAgentById();
              Notification.success({
                message: '编辑适用的鉴定机构'
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
     * 查询使用的安检机构
     */
    function searchAgentById() {
      $rootScope.loading = true;
      restAPI.airData.queryAgent.save({}, alid)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setOffice(resp.data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除鉴定机构
     * 
     */
    function removeAgent(id, name) {
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
              content: '你将要删除鉴定机构' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        restAPI.airData.delAgent.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              searchAgentById();
              Notification.success({
                message: '删除鉴定机构成功'
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
     * 启动/禁用鉴定机构
     */
    function enableAgent(id, status) {
      restAPI.airData.delAgent.save({}, {
          id: id,
          status: status
        })
        .$promise.then(function(resp) {
          if (resp.ok) {
            searchAgentById();
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

module.exports = angular.module('app.pactlOption.airlineDetail', []).controller('airlineDetailCtrl', airlineDetail_fn);