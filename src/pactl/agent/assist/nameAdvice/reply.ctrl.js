'use strict';

var reply_fn = ['$scope', 'restAPI', 'Notification', '$modal', '$state', '$stateParams', 'Download', '$rootScope', '$timeout', 'Auth',
  function ($scope, restAPI, Notification, $modal, $state, $stateParams, Download, $rootScope, $timeout, Auth) {
    var vm = $scope;
    var goodsId = '';
    var productDesc = '';
    vm.airData = [];
    vm.airportData = [];
    vm.btn = {
      upload1: true, //上传
      upload2: true, //补充上传
      upload3: true, //在线填写产品说明
      hasOnline: false //在线填写产品说明
    };
    vm.question = {};
    vm.cancel = cancel;
    vm.dataStatus = {};
    vm.downloadFile = downloadFile;
    vm.finish = finish;
    vm.onlyEn = onlyEn;
    vm.opHis = opHis;
    vm.productExplain = productExplain;
    vm.records = [];
    vm.refer = {
      remoteFilename1: null,
      remoteFilename2: null,
      progress1: '',
      progress2: ''
    };
    vm.remove = remove;
    vm.removeFile = removeFile;
    vm.save = save;
    vm.sameAgent = sameAgent;
    vm.sent = sent;
    vm.showBtnSave = showBtnSave;
    vm.showBtnSent = showBtnSent;
    vm.showBtnDone = showBtnDone;
    vm.showBtnCancel = showBtnCancel;
    vm.showBtnRemove = showBtnRemove;
    vm.showBtnRemoveFile = showBtnRemoveFile;
    vm.scrollBottom = scrollBottom;
    vm.uploadfile = {
      file1: null,
      file2: null
    };
    vm.uploadCallback1 = uploadCallback1;
    vm.uploadCallback2 = uploadCallback2;
    vm.valAir = valAir;
    vm.search_historys = search_historys;
    vm.refreshDest = refreshDest;
    vm.btnDon = btnDon;

    check();

    /**
     * 检测id
     */
    function check() {
      goodsId = $stateParams.goodsId;
      if (goodsId) {
        vm.refer.goodsId = goodsId;
        getStatus();
        search_historys();
      } else {
        $state.go('agentAssist.nameAdvice');
      }
    }
    /**
     * 获取状态
     */
    function getStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476067968303634'
        })
        .$promise.then(function (resp) {
          vm.statusData = resp.rows;
          getAirData();
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function (resp) {
          angular.forEach(resp.data, function (v, k) {
            vm.airData.push({
              airCode: v.airCode,
              airName: v.airName
            });
          });
          searchGoodId();
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
          angular.forEach(resp.rows, function (v, k) {
            vm.airportData.push({
              airportCode: v.airportCode,
              airportName: v.airportName,
              countryCode: v.countryCode
            });
          });
        });
    }
    /**
     * 获取目的港（机场）
     */
    function searchAirportData() {
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function (resp) {
          angular.forEach(resp.data, function (v, k) {
            vm.airportData.push({
              airportCode: v.airportCode,
              airportName: v.airportName,
              countryCode: v.countryCode
            });
          });
          searchGoodId();
        });
    }
    /**
     * 根据id获取货代信息
     */
    function getUnitById(id) {
      restAPI.operAgent.agentDetail.get({
          id: id
        })
        .$promise.then(function (resp) {
          vm.agentSalesEnname = resp.ename;
        });
    }
    /**
     * 获取数据
     */
    function searchGoodId() {
      restAPI.goodsId.goodsIdSet.save({}, {
          goodsId: goodsId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.data = resp.data.pGoodsAdvice;
            getUnitById(vm.data.agentSales);
            setLeftData(resp);
            setRightData(resp);
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }
    /**
     * 显示左边数据
     */
    function setLeftData(resp) {
      var data = resp.data.pGoodsAdvice,
        files = resp.data.fileRelation;
      vm.refer.status = data.status;
      vm.refer.airLines = [];
      angular.forEach(data.airLines && data.airLines.split(';'), function (v, k) {
        if (v !== '') {
          for (var i = 0; i < vm.airData.length; i++) {
            if (v === vm.airData[i].airCode) {
              if (k === 0) {
                vm.refer.airLine1 = vm.airData[i];
              } else if (k === 1) {
                vm.refer.airLine2 = vm.airData[i];
              } else if (k === 2) {
                vm.refer.airLine3 = vm.airData[i];
              }
              return false;
            }
          }
        }
      });

      if (data.dest) {
        restAPI.airPort.queryList.save({}, {
            airportCode: data.dest,
            rows: 50,
            page: 1
          })
          .$promise.then(function (resp) {
            resp.rows && resp.rows.length && (vm.refer.dest = resp.rows[0]);
          });
      }
      vm.refer.namesEn = data.namesEn;
      vm.refer.namesCn = data.namesCn;
      vm.results = data.result ? JSON.parse(data.result) : [];
      try {
        data.productDesc = JSON.parse(data.productDesc);
      } catch (error) {
        data.productDesc = '';
      }
      vm.dataStatus = data;
      for (var i = 0; i < files.length; i++) {
        if (files[i].hasOwnProperty('type')) {
          if (files[i].type == 'type') {
            vm.refer.remoteFilename1 = {
              newName: files[i].oldName,
              id: files[i].fileId,
            };
            vm.dataStatus.remoteFilename1 = true;
          } else if (files[i].type == 'othertype') {
            vm.refer.remoteFilename2 = {
              newName: files[i].oldName,
              id: files[i].fileId,
            };
            vm.dataStatus.remoteFilename2 = true;
          }
        }
      }
      showLeftBtn();
    }
    /**
     * 显示左边按钮
     */
    function showLeftBtn() {
      if (vm.dataStatus.productDesc) {
        vm.btn.upload1 = false;
        vm.btn.upload3 = true;
        vm.btn.hasOnline = true;
      } else {
        if (vm.dataStatus.remoteFilename1 || vm.refer.remoteFilename1) {
          vm.btn.upload1 = false;
          vm.btn.upload3 = false;
          vm.btn.hasOnline = false;
        } else {
          if (vm.dataStatus.status == "105" || vm.dataStatus.status == "106" || (vm.dataStatus.result != null && vm.dataStatus.result != '[]')) {
            vm.btn.upload1 = false;
            vm.btn.upload3 = false;
            vm.btn.hasOnline = false;
          } else {
            vm.btn.upload1 = true;
            vm.btn.upload3 = true;
            vm.btn.hasOnline = false;
          }
        }
      }
      if (vm.dataStatus.remoteFilename2 || vm.refer.remoteFilename2) {
        vm.btn.upload2 = false;
      } else {
        if (vm.dataStatus.status == "105" || vm.dataStatus.status == "106" || (vm.dataStatus.result != null && vm.dataStatus.result != '[]')) {
          vm.btn.upload2 = false;
        } else {
          vm.btn.upload2 = true;
        }

      }
    }
    /**
     * 显示右边数据
     */
    function setRightData(resp) {
      var records = resp.data.pGoodsKnowsAnswers,
        data = [],
        j = 0,
        index = false;
      for (var i = 0; i < records.length; i++) {
        if (records[i].contents) {
          data[j] = data[j] || [];
        }
        if (records[i].type === '1') {
          if (index) {
            j++;
            data[j] = [];
            index = false;
          }
          data[j] && data[j].push(records[i]);
        } else {
          if (!index) {
            index = true;
          }
          data[j] && data[j].push(records[i]);
        }
      }
      vm.records = data;
    }
    /**
     * 保存
     */
    function save(isSend) {
      var obj = getData();
      if (!validAircode()) {
        return false;
      }
      restAPI.nameAdvice.addAdvice.save({}, obj)
        .$promise.then(function (resp) {
          if (resp.ok) {
            if (isSend) {
              sentMsg();
            } else {
              Notification.success({
                message: '保存成功'
              });
              searchGoodId();
            }
            vm.add = true;
            vm.done = false;
            search_historys();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     *航空公司不允许重复
     */
    function valAir(type) {
      var airCode1 = vm.refer.airLine1 && vm.refer.airLine1.airCode || '';
      var airCode2 = vm.refer.airLine2 && vm.refer.airLine2.airCode || '';
      var airCode3 = vm.refer.airLine3 && vm.refer.airLine3.airCode || '';
      var result = false;
      if (type === '1') {
        if (airCode1 === airCode2 || airCode1 === airCode3) {
          vm.refer.airLine1 = null;
          result = true;
        }
      }
      if (type === '2') {
        if (airCode2 === airCode1 || airCode2 === airCode3) {
          vm.refer.airLine2 = null;
          result = true;
        }
      }
      if (type === '3') {
        if (airCode3 === airCode1 || airCode3 === airCode2) {
          vm.refer.airLine3 = null;
          result = true;
        }
      }
      if (result) {
        Notification.error({
          message: '航空公司不允许重复'
        });
      }
    }
    /**
     * 航空公司不为空
     */
    function validAircode() {
      var result = false;
      var airCode1 = vm.refer.airLine1 && vm.refer.airLine1.airCode || '';
      var airCode2 = vm.refer.airLine2 && vm.refer.airLine2.airCode || '';
      var airCode3 = vm.refer.airLine3 && vm.refer.airLine3.airCode || '';
      if (airCode1 || airCode2 || airCode3) {
        result = true;
      } else {
        Notification.error({
          message: '可能出运航空公司至少选择一个'
        });
      }
      return result;
    }
    /**
     * 保存需要的数据
     */
    function getData() {
      var refer = angular.copy(vm.refer),
        obj = {},
        fileids = [];
      obj.productDesc = JSON.stringify(vm.dataStatus.productDesc);
      obj.goodsId = refer.goodsId ? refer.goodsId : '';
      obj.airLines = (refer.airLine1 ? refer.airLine1.airCode : '') + ";" + (refer.airLine2 ? refer.airLine2.airCode : '') + ";" + (refer.airLine3 ? refer.airLine3.airCode : '');
      obj.dest = refer.dest && refer.dest.airportCode;
      obj.namesEn = refer.namesEn;
      obj.namesCn = refer.namesCn || '';
      obj.result = refer.result;
      if (refer.remoteFilename1 && refer.remoteFilename1.id) {
        fileids.push(refer.remoteFilename1.id)
        vm.dataStatus.remoteFilename1 = true;
      }
      if (refer.remoteFilename2 && refer.remoteFilename2.id) {
        fileids.push(refer.remoteFilename2.id)
        vm.dataStatus.remoteFilename2 = true;
      }
      obj.fileIds = fileids.join(';');
      return obj;
    }
    /**
     * 完成咨询
     */
    function finish() {
      restAPI.nameAdvice.addAdvice.save({}, {
          goodsId: goodsId,
          airLines: (vm.refer.airLine1 ? vm.refer.airLine1.airCode : '') + ";" + (vm.refer.airLine2 ? vm.refer.airLine2.airCode : '') + ";" + (vm.refer.airLine3 ? vm.refer.airLine3.airCode : ''),
          status: '105'
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            Notification.success({
              message: '咨询完成'
            });
            searchGoodId();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 取消咨询
     */
    function cancel() {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '取消咨询' + goodsId,
              content: '你将要取消咨询' + goodsId + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.nameAdvice.addAdvice.save({}, {
            goodsId: goodsId,
            airLines: (vm.refer.airLine1 ? vm.refer.airLine1.airCode : '') + ";" + (vm.refer.airLine2 ? vm.refer.airLine2.airCode : '') + ";" + (vm.refer.airLine3 ? vm.refer.airLine3.airCode : ''),
            status: '104'
          })
          .$promise.then(function (resp) {
            if (resp.ok) {
              searchGoodId();
              Notification.success({
                message: '取消咨询完成'
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
    function remove(param) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + goodsId,
              content: '你将要删除品名咨询' + goodsId + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.delnameAdvice.delnameAdvice.save({}, {
          goodsId: goodsId
        }).$promise.then(function (resp) {
          if (resp.ok) {
            Notification.success({
              message: '删除品名咨询成功'
            });
            $state.go('agentAssist.nameAdvice');
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
     * 上传产品说明回调
     * 
     * @param {any} param 
     */
    function uploadCallback1(res, param) {
      param.remoteFilename1 = res;
      var file1 = res;
      var respDt1 = file1.data;
      if (file1 && file1.ok) {
        vm.refer.remoteFilename1 = {
          id: respDt1.fileId,
          name: respDt1.oldName,
          newName: respDt1.oldName.substring(0, 10) + (respDt1.oldName.length > 10 ? '...' : ''),
          flag:true
        }
        vm.btn.upload1 = false;
        vm.btn.upload3 = false;
      } else {
        Notification.error({
          message: '上传失败'
        });
      }
    }

    function uploadCallback2(res, param) {
      param.remoteFilename2 = res;
      var file2 = res;
      var respDt2 = file2.data;
      if (file2 && file2.ok) {
        vm.refer.remoteFilename2 = {
          id: respDt2.fileId,
          name: respDt2.oldName,
          newName: respDt2.oldName.substring(0, 10) + (respDt2.oldName.length > 10 ? '...' : ''),
          flag:true
        }
        vm.btn.upload2 = false;
      } else {
        Notification.error({
          message: '上传失败'
        });
      }
    }

    vm.count = 0;

    function btnDon() {
      var ids = ['1508142220987116']
      if(vm.count<ids.length) {
        downloadFile(ids[vm.count]);
        vm.count++
        setTimeout(btnDon,1000);
      }
    }
    /**
     * 下载文件
     */
    function downloadFile(id) {
      Download.downloadFile(id, restAPI.file.downloadFile);
    }
    /**
     * 删除文件
     */
    function removeFile(id, type) {
      restAPI.file.removeFile.save({}, {
          fileId: id
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            if (type === 'type') {
              searchGoodId();
              vm.refer.remoteFilename1 = null;
              vm.refer.progress1 = '';
              vm.btn.upload1 = true;
              vm.btn.upload3 = true;
              vm.btn.hasOnline = false;
              vm.dataStatus.remoteFilename1 = false;
            } else if (type === 'othertype') {
              searchGoodId();
              vm.refer.remoteFilename2 = null;
              vm.refer.progress2 = '';
              vm.btn.upload2 = true;
              vm.dataStatus.remoteFilename2 = false;
            }
            Notification.success({
              message: '文件删除成功'
            });
          } else {
            Notification.error({
              message: '文件删除失败'
            });
          }
        });
    }
    /**
     * 发送咨询内容
     */
    function sent() {
      save(true);
    }


    function sentMsg() {
      $rootScope.loading = true;
      restAPI.refer.referSet.save({}, {
          "goodsId": goodsId,
          "type": "1",
          "contents": vm.question.contentText ? vm.question.contentText : ''
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            $rootScope.loading = false;
            vm.question.contentText = null;
            searchGoodId();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }


    /**
     * 在线填写产品说明
     */
    function productExplain() {
      $state.go("agentAssist.online", {
        'goodsId': goodsId
      });
    }
    /**
     * 不能输入中文
     */
    function onlyEn() {
      try {
        vm.refer.namesEn = vm.refer.namesEn.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }
    /**
     * 是否显示暂存
     *
     */
    function showBtnSave() {
      if (vm.dataStatus.status === '101' || vm.dataStatus.status === '103' || (vm.dataStatus.status === '104' &&
          !((vm.dataStatus.productDesc || vm.dataStatus.remoteFilename1) && vm.dataStatus.remoteFilename2)
        )) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 是否显示发送咨询
     *
     */
    function showBtnSent() {
      if (vm.dataStatus.status === '101' || vm.dataStatus.status === '103' || vm.dataStatus.status === '104') {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 是否显示完成咨询
     *
     */
    function showBtnDone() {
      if (vm.dataStatus.status === '104' && vm.dataStatus.result && vm.dataStatus.result != "[]") {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 是否显示取消咨询
     *
     */
    function showBtnCancel() {
      if (vm.dataStatus.status === '105') {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 是否显示删除按钮
     *
     */
    function showBtnRemove() {
      if (vm.dataStatus.status === '101' || (vm.dataStatus.status === '103' && !vm.dataStatus.result)) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 是否显示删除文件的按钮
     *
     */
    function showBtnRemoveFile(type) {
      var remoteFilename = null;
      if (type === 'type') {
        remoteFilename = vm.refer.remoteFilename1;
      } else if (type === 'othertype') {
        remoteFilename = vm.refer.remoteFilename2;
      }
      if (vm.dataStatus.status === '101' && remoteFilename) {
        return true;
      } else if (remoteFilename && remoteFilename.flag) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 可引用的品名咨询，对所有代理都是公开的，但是其他代理不能查看该品名咨询的附件
     */
    function sameAgent() {
      if (+vm.dataStatus.agentSales === Auth.getMyUnitId()) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 历史记录
     */
    function search_historys() {
      restAPI.goodsId.historys.save({}, {
          "sourceKey": goodsId,
          "model": 'GOODSHIS'
        })
        .$promise.then(function (resp) {
          vm.historys = resp.rows;
        });
    }
    /**
     * 操作历史
     */
    function opHis() {
      var delDialog = $modal.open({
        template: require('./opHistory.html'),
        controller: require('./opHistory.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作历史',
              historys: vm.historys
            };
          }
        }
      });
    }
    /*让滚动条滚动到底部*/
    function scrollBottom() {
      var scr = $.find('.border2');
      if (scr.length > 0) {
        var border = scr[0];
        border.scrollTop = border.scrollHeight;
      }
    }
  }
];

module.exports = angular.module('app.agentAssist.reply', []).controller('replyCtrl', reply_fn);