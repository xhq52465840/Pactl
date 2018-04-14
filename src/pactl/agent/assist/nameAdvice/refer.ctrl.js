'use strict';

var refer_fn = ['$scope', 'restAPI', 'Notification', '$rootScope', '$state', '$stateParams', 'Download', '$modal',
  function ($scope, restAPI, Notification, $rootScope, $state, $stateParams, Download, $modal) {
    var vm = $scope;
    vm.airData = [];
    vm.airportData = [];
    vm.add = true; //状态的样式，新建的样式的样式
    vm.ask = false;
    vm.btn = {
      upload1: true, //上传
      upload2: true, //补充上传
      upload3: true //在线填写产品说明
    };
    vm.content = '';
    // vm.done = true; //是否展示产品说明
    vm.downloadFile = downloadFile;
    vm.refer = {
      remoteFilename1: null,
      remoteFilename2: null,
      progress1: '',
      progress2: ''
    };
    vm.goodsId = '';
    vm.onlyEn = onlyEn;
    vm.productExplain = productExplain;
    vm.refer.status = "101";
    vm.scrollBottom = scrollBottom;
    vm.remove = remove;
    vm.removeFile = removeFile;
    vm.save = save;
    vm.sent = sent;
    vm.uploadCallback1 = uploadCallback1;
    vm.uploadCallback2 = uploadCallback2;
    // vm.upload1 = upload1;
    // vm.upload2 = upload2;
    vm.btn = {
      upload1: true,
      upload2: true,
      upload3: true
    };
    vm.valAir = valAir;
    vm.goReply = goReply;
    vm.refreshDest = refreshDest;

    getStatus();

    /**
     * 获取状态
     */
    function getStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476067968303634'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
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
          $rootScope.loading = false;
          angular.forEach(resp.data, function (v, k) {
            vm.airData.push({
              airCode: v.airCode,
              airName: v.airName
            });
          });
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
     * 保存咨询
     */
    function save(openOnline, isSendMsg) {
      var data = getData();
      if (!validAircode()) {
        return false;
      }
      $rootScope.loading = true;
      restAPI.nameAdvice.addAdvice.save({}, data)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            getUnitById(resp.data.agentSales);
            vm.goodsId = resp.data.goodsId;
            vm.creatorName = resp.data.creatorName;
            vm.agentSalesEnname = resp.data.agentSalesEnname;
            if (openOnline) {
              $state.go("agentAssist.online", {
                'goodsId': vm.goodsId
              });
              return;
            }
            if (vm.refer.remoteFilename1 || vm.refer.remoteFilename2) {
              // if (vm.uploadType === 'upload1') {
              //   vm.btn.upload3 = false;
              // } else if (vm.uploadType === 'upload2') {
              //   vm.btn.upload1 = true;
              //   vm.btn.upload3 = true;
              // }
              if (vm.refer.remoteFilename1) {
                vm.btn.upload3 = false;
              }
              if (vm.refer.remoteFilename2) {
                vm.btn.upload1 = true;
                vm.btn.upload3 = true;
              }
            } else {
              vm.btn.upload1 = true;
              vm.btn.upload2 = true;
              vm.btn.upload3 = true;
            };
            if (isSendMsg) {
              sendMsg();
            } else {
              goReply();
            }
            // param存在的时候才会去调用param();
            // param && param();
          } else {
            Notification.error({
              message: '必填项不能为空！'
            });
          }
        })
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
        if ((airCode1 !== '' && airCode1 === airCode2) || (airCode1 !== '' && airCode1 === airCode3)) {
          vm.refer.airLine1 = null;
          result = true;
        }
      }
      if (type === '2') {
        if ((airCode2 !== '' && airCode2 === airCode1) || (airCode2 !== '' && airCode2 === airCode3)) {
          vm.refer.airLine2 = null;
          result = true;
        }
      }
      if (type === '3') {
        if (airCode3 !== '' && (airCode3 === airCode1) || airCode3 !== '' && (airCode3 === airCode2)) {
          vm.refer.airLine3 = null;
          result = true;
        }
      }
      if (result) {
        Notification.warning({
          message: '航空公司不允许重复'
        });
      }
    }
    /**
     * 航空公司不为空
     */
    function validAircode() {
      var result = true;
      var airCode1 = vm.refer.airLine1 && vm.refer.airLine1.airCode || '';
      var airCode2 = vm.refer.airLine2 && vm.refer.airLine2.airCode || '';
      var airCode3 = vm.refer.airLine3 && vm.refer.airLine3.airCode || '';
      if (airCode1 || airCode2 || airCode3) {
        
      } else {
        Notification.error({
          message: '可能出运航空公司至少选择一个!'
        });
        result = false;
      }
      var dest = vm.refer.dest && vm.refer.dest.airportCode;
      if (dest) {
      } else {
        Notification.error({
          message: '目的港必录!'
        });
        result = false;
      }
      return result;
    }
    /**
     * 获取保存需要的数据
     */
    function getData() {
      var refer = angular.copy(vm.refer),
        obj = {},
        fileids = [];
      obj.goodsId = vm.goodsId;
      obj.airLines = (refer.airLine1 ? refer.airLine1.airCode : '') + ";" + (refer.airLine2 ? refer.airLine2.airCode : '') + ";" + (refer.airLine3 ? refer.airLine3.airCode : '');
      obj.dest = refer.dest && refer.dest.airportCode;
      obj.namesEn = refer.namesEn;
      obj.namesCn = refer.namesCn || '';
      refer.remoteFilename1 && refer.remoteFilename1.id ? fileids.push(refer.remoteFilename1.id) : null;
      refer.remoteFilename2 && refer.remoteFilename2.id ? fileids.push(refer.remoteFilename2.id) : null;
      obj.fileIds = fileids.join(';');
      return obj;
    }
    /**
     * 发送咨询内容
     *
     */
    function sent() {
      save(false, true);
    }
    /**
     * 发送方法
     */
    function sendMsg() {
      $rootScope.loading = true;
      restAPI.refer.referSet.save({}, {
          "goodsId": vm.goodsId,
          "type": "1",
          "contents": vm.content
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.content = null;
            search();
            vm.btn.upload1 = false;
            vm.btn.upload2 = false;
            vm.btn.upload3 = false;
            vm.refer.status = "103";
            goReply();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 查询咨询内容
     */
    function search() {
      var goodsId = vm.goodsId;
      restAPI.goodsId.goodsIdSet.save({}, {
          goodsId: goodsId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setRecords(resp);
            vm.ask = true;
            vm.add = false;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 显示咨询内容
     */
    function setRecords(resp) {
      var records = resp.data.pGoodsKnowsAnswers;
      var data = [],
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
        } else {
          if (!index) {
            index = true;
          }
        }
        data[j] && records[i].contents && data[j].push(records[i]);
      }
      vm.records = data;
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
          newName: respDt1.oldName.substring(0, 10) + (respDt1.oldName.length > 10 ? '...' : '')
        }
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
          newName: respDt2.oldName.substring(0, 10) + (respDt2.oldName.length > 10 ? '...' : '')
        }
      } else {
        Notification.error({
          message: '上传失败'
        });
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
              vm.refer.remoteFilename1 = null;
              vm.refer.progress1 = '';
              vm.btn.upload1 = true;
              vm.btn.upload3 = true;
            } else if (type === 'othertype') {
              vm.refer.remoteFilename2 = null;
              vm.refer.progress2 = '';
              vm.btn.upload2 = true;
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
     * 删除品名咨询
     */
    function remove() {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + vm.goodsId,
              content: '你将要删除品名咨询' + vm.goodsId + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        restAPI.delnameAdvice.delnameAdvice.save({}, {
          goodsId: vm.goodsId
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
     * 在线填写产品说明
     */
    function productExplain() {
      save(true);
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

    /*让滚动条滚动到底部*/
    function scrollBottom() {
      var scr = $.find('.border2');
      if (scr.length > 0) {
        var border = scr[0];
        border.scrollTop = border.scrollHeight;
      }
    }

    /**
     * 更换页面
     */
    function goReply() {
      $state.go("agentAssist.reply", {
        'goodsId': vm.goodsId
      });
    }
  }
];

module.exports = angular.module('app.agentAssist.refer', []).controller('referCtrl', refer_fn);