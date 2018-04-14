'use strict';

var localInspect_fn = ['$scope', 'restAPI', 'Page', '$rootScope', '$modal', '$stateParams', 'Notification', '$state',
  function ($scope, restAPI, Page, $rootScope, $modal, $stateParams, Notification, $state) {
    var vm = $scope;
    var waybillNo = '';
    vm.changeStatus = changeStatus;
    vm.PassReasonData = [];
    vm.inspect = inspect;
    vm.insideSearch = insideSearch;
    vm.noPass = noPass;
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();
    vm.pass = pass;
    vm.wStatusCode = '';
    vm.pre = {};
    vm.pres = {};
    vm.buttonGroup = {
      pass: false,
      noPass: false,
      inspect: false,
      other: false,
      save: false
    };
    vm.progressObj = {}; //右侧进度
    vm.reasonData = [];
    vm.save = save;
    vm.showNameAdvice = showNameAdvice;
    vm.subBillLists = [];
    vm.search = search;
    vm.searchBook = searchBook;
    // vm.shiftCommon = shiftCommon;
    vm.showCargoDeclaraction = showCargoDeclaraction;
    vm.showBatteryDeclaraction = showBatteryDeclaraction;
    vm.totalObj = {
      totalCount: 0,
      packages: 0,
      weight: 0
    };
    vm.dbPre = dbPre;
    vm.informalRule = '';

    getInformalRule();
    
    function getInformalRule(user, token, data) {
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
    search();
    getReason();
    /**
     * 校验
     */
    function check() {
      waybillNo = $stateParams.waybillNo;
      
    }
    /**
     * 查询
     */
    function search() {
      $rootScope.loading = true;
    //  debugger
      restAPI.preJudice.queryCheck.save({}, waybillNo)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.data.parentBillInfo) {
            setData(resp.data);
          } else {
            showNoResult();
          }
        });
    }
    /**
     * 显示信息
     */
    function setData(param) {
      vm.parentBillInfo = param.parentBillInfo;
      vm.parentBillInfo.wayBill = '<div class="pre-name">' +
        (vm.parentBillInfo.ssr ? '<div><div class="pre-enTitle">SSR: </div> <div class="pre-enValue">' +
          vm.parentBillInfo.ssr + '</div></div>' : '') +
        (vm.parentBillInfo.osi1 ? '<div><div class="pre-enTitle">OSI: </div> <div class="pre-enValue">' +
          vm.parentBillInfo.osi1 + '</div></div>' : '') +
        (vm.parentBillInfo.holdCode ? '<div><div class="pre-enTitle">SHC: </div> <div class="pre-enValue">' +
          vm.parentBillInfo.holdCode + '</div></div>' : '') +
        (vm.parentBillInfo.alsoNotify ? '<div><div class="pre-enTitle">Also notify: </div> <div class="pre-enValue">' +
          vm.parentBillInfo.alsoNotify + '</div></div>' : '') + '</div>';
      vm.parentBillInfo.div = '<div class="pre-name">' + (vm.parentBillInfo.goodsNameEn ? '<div><div class="pre-enTitle">补充英文: </div> <div class="pre-enValue">' + vm.parentBillInfo.goodsNameEn + '</div></div>' : '') + (vm.parentBillInfo.goodsNameCn ? '<div><div class="pre-enTitle">补充中文: </div> <div class="pre-enValue">' + vm.parentBillInfo.goodsNameCn + '</div></div>' : '') + (vm.parentBillInfo.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + vm.parentBillInfo.goodsRemarks + '</pre></div>' : '') + '</div>';
      //getUnitById(vm.parentBillInfo.agentSalesId);
      vm.parentBillBooks = param.parentBillBooks;
      vm.version = param.version;
      vm.subBillLists = param.sonBillList || [];
      angular.forEach(vm.subBillLists, function (v, k) {
        v.sonBillInfo.goodsNameEn = v.sonBillInfo.remark;
        v.div = '<div class="pre-name">' + (v.sonBillInfo.goodsNameEn ? '<div><div class="pre-enTitle">补充英文:</div> <div class="pre-enValue">' + v.sonBillInfo.goodsNameEn + '</div></div>' : '') + (v.sonBillInfo.goodsNameCn ? '<div><div class="pre-enTitle">补充中文:</div> <div class="pre-enValue">' + v.sonBillInfo.goodsNameCn + '</div></div>' : '') + (v.sonBillInfo.goodsRemarks ? '<div><div class="pre-enTitle">详细描述:</div><pre class="name-pre">' + v.sonBillInfo.goodsRemarks + '</pre></div>' : '') + '</div>';
      })
      showSublist();
      queryHistory();
      showButton();
      getCargoDeclare(vm.parentBillInfo.awId);
      getBattaryDeclare(vm.parentBillInfo.awId);
      searchType(vm.parentBillInfo.awId);
    }
    /**
     * 查询锂电池类型：ELI显示勾选对应的 965,966或者967ELM显示勾选对应的 968,969或者970
     */
    function searchType(param) {
      vm.loading = true;
      restAPI.declare.battaryDeclare.save({}, {
          awId: param
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            //主单展示精简的详细信息
            vm.pres.eli = '';
            vm.pres.elm = '';
            vm.pres.eli += resp.data && resp.data.eliIiOnly === '1' ? '<div class="eliOrElm1"> 965 </div>' : '';
            vm.pres.eli += resp.data && resp.data.eliIiPack === '1' ? '<div class="eliOrElm1"> /966 </div>' : '';
            vm.pres.eli += resp.data && resp.data.eliRelation === '1' ? '<div class="eliOrElm1"> /967 </div>' : '';
            vm.pres.eli += resp.data && resp.data.overpack === '1' ? '<div class="eliOrElm1"> ;overpack; </div>' : '';
            // if (resp.data.eliBatteryCellNo) {
            vm.pres.eli += resp.data && resp.data.eliBatteryCellNo !== '0' ? '<div class="eliOrElm1">' + resp.data.eliBatteryCellNo + '芯;</div>' : '';
            // }
            // if (resp.data.eliBatteryNo) {
            vm.pres.eli += resp.data && resp.data.eliBatteryNo !== '0' ? '<div class="eliOrElm1">' + resp.data.eliBatteryNo + '电;</div>' : '';
            // }
            vm.pres.eli += resp.data && resp.data.eliButtonFlag === '1' ? '<div class="eliOrElm1"> 仅装在设备或主板中的纽扣电池; </div>' : '';
            vm.pres.eli += resp.data && resp.data.noeli === '1' ? '<div class="eliOrElm1"> 无需粘贴锂电池标签; </div>' : '';
            vm.pres.eli += resp.data && resp.data.nameAddress ? '<div class="eliOrElm1 nameAddress">' + resp.data.nameAddress + ';</div>' : '';
            vm.pres.eli += resp.data && resp.data.signName ? '<div class="eliOrElm1">' + resp.data.signName + ';</div>' : '';
            vm.pres.eli += resp.data && resp.data.phone ? '<div class="eliOrElm1">' + resp.data.phone + ';</div>' : '';
            vm.pres.eli += resp.data && resp.data.createTime ? '<div class="eliOrElm1">' + resp.data.createTime + ';</div>' : '';

            vm.pres.elm += resp.data && resp.data.elmIiOnly === '1' ? '<div class="eliOrElm1"> 968 </div>' : '';
            vm.pres.elm += resp.data && resp.data.elmIiPack === '1' ? '<div class="eliOrElm1"> /969 </div>' : '';
            vm.pres.elm += resp.data && resp.data.elmRelation === '1' ? '<div class="eliOrElm1"> /970 </div>' : '';
            vm.pres.elm += resp.data && resp.data.overpack === '1' ? '<div class="eliOrElm1"> ;overpack; </div>' : '';
            // if (resp.data.elmBatteryCellNo) {
            vm.pres.elm += resp.data && resp.data.elmBatteryCellNo !== '0' ? '<div class="eliOrElm1">' + resp.data.elmBatteryCellNo + '芯;</div>' : '';
            // }
            // if (resp.data.elmBatteryNo) {
            vm.pres.elm += resp.data && resp.data.elmBatteryNo !== '0' ? '<div class="eliOrElm1">' + resp.data.elmBatteryNo + '电;</div>' : '';
            // }
            vm.pres.elm += resp.data && resp.data.elmButtonFlag === '1' ? '<div class="eliOrElm1"> 仅装在设备或主板中的纽扣电池; </div>' : '';
            vm.pres.elm += resp.data && resp.data.noelm === '1' ? '<div class="eliOrElm1"> 无需粘贴锂电池标签; </div>' : '';
            vm.pres.elm += resp.data && resp.data.nameAddress ? '<div class="eliOrElm1 nameAddress">' + resp.data.nameAddress + ';</div>' : '';
            vm.pres.elm += resp.data && resp.data.signName ? '<div class="eliOrElm1">' + resp.data.signName + ';</div>' : '';
            vm.pres.elm += resp.data && resp.data.phone ? '<div class="eliOrElm1">' + resp.data.phone + ';</div>' : '';
            vm.pres.elm += resp.data && resp.data.createTime ? '<div class="eliOrElm1">' + resp.data.createTime + ';</div>' : '';

            //这个是分单的信息
            vm.pre.eli = '';
            vm.pre.elm = '';
            vm.pre.eli += resp.data && resp.data.eliIiOnly === '1' ? '<div class="eliOrElm"> 965 </div>' : '';
            vm.pre.eli += resp.data && resp.data.eliIiPack === '1' ? '<div class="eliOrElm"> 966 </div>' : '';
            vm.pre.eli += resp.data && resp.data.eliRelation === '1' ? '<div class="eliOrElm"> 967 </div>' : '';
            vm.pre.elm += resp.data && resp.data.elmIiOnly === '1' ? '<div class="eliOrElm"> 968 </div>' : '';
            vm.pre.elm += resp.data && resp.data.elmIiPack === '1' ? '<div class="eliOrElm"> 969 </div>' : '';
            vm.pre.elm += resp.data && resp.data.elmRelation === '1' ? '<div class="eliOrElm"> 970 </div>' : '';
          }
        });
    }
    /**
     * 保函
     */
    function getCargoDeclare(awId) {
      restAPI.declare.cargoDeclare.save({}, {
          awId: awId
        })
        .$promise.then(function (resp) {
          if (resp.ok && resp.data && resp.data.cargoDeclare) {
            vm.showCargoDeclare = resp.data.cargoDeclare;
          } else {
            vm.showCargoDeclare = false;
          }
        });
    }
    /**
     * 锂电池
     */
    function getBattaryDeclare(awId) {
      restAPI.declare.battaryDeclare.save({}, {
          awId: awId
        })
        .$promise.then(function (resp) {
          if (resp.ok && resp.data) {
            vm.showBattaryDeclare = resp.data.battaryDeclare;
          } else {
            vm.showBattaryDeclare = false;
          }
        });
    }
    /**
     * 根据id获取agent信息
     */
    function getUnitById(id) {
      restAPI.operAgent.agentDetail.get({
          id: id
        })
        .$promise.then(function (resp) {
          vm.parentBillInfo.agentSalesEnname = resp.ename;
        });
    }
    /**
     * 获取退回原因
     */
    function getReason() {
      restAPI.baseData.queryAll.save({}, {
          type: '1479635761551284'
        })
        .$promise.then(function (resp) {
          vm.reasonData = resp.rows;
        });
    }
    /**
     * 现场检查,UN数据
     */
    function getSelectData() {
      restAPI.baseData.queryAll.save({}, {
          type: '1484818480396416'
        })
        .$promise.then(function (resp) {
          vm.selectData = resp.rows;
        });
    };
    /**
     * 现场检查,ID数据
     */
    function getSelectID() {
      restAPI.baseData.queryAll.save({}, {
          type: '1484818677260588'
        })
        .$promise.then(function (resp) {
          vm.selectID = resp.rows;
        });
    };
    getSelectID();
    getSelectData();
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
      vm.totalObj.packages = 0;
      vm.totalObj.weight = 0;
      vm.totalObj.totalCount = vm.subBillLists.length;
      angular.forEach(vm.subBillLists, function (v, k) {
        setAuditRemarks(v);
        vm.totalObj.packages += v.sonBillInfo.rcpNo || 0;
        vm.totalObj.weight += v.sonBillInfo.grossWeight || 0;
      });
      var resp = {
        rows: vm.subBillLists,
        total: vm.subBillLists.length
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
     * 当没有数据时
     */
    function showNoResult() {
      Notification.error({
        message: '未找到任何数据'
      });
      $state.go('index');
    }
    /**
     * 最近记录
     */
    function queryHistory() {
      $rootScope.loading = true;
      restAPI.preJudice.queryRecord.save({}, {
          "page": "1",
          "rows": "10"
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.recentlyHistory = resp.rows;
        });
    }
    /**
     * 弹出分单退回原因
     */
    function returnReason(params) {
      var reasonDialog = $modal.open({
        template: require('./returnReason.html'),
        controller: require('./returnReason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '不通过',
              btnName: '确认退回',
              reasonData: vm.reasonData,
              obj: {
                waybillNo: params.sonBillInfo.waybillNo,
                subBillLists: params.sonBillInfo
              }
            };
          }
        }
      });
      reasonDialog.result.then(function (data) {
        $rootScope.loading = true;
        var saveData = [];
        var remarkData = [];
        var subBillAuditRemarks = '';
        angular.forEach(data.remarkData, function (v, k) {
          remarkData.push(v.name || '');
        });
        subBillAuditRemarks = remarkData.join(";");
        params.sonBillInfo.subBillAuditRemarks = subBillAuditRemarks;
        params.sonBillInfo.subBillAudit = '2';
        setAuditRemarks(params);
        $rootScope.loading = false;
      }, function () {

      });
    }

    function setAuditRemarks(row) {
      if (row.sonBillInfo.subBillAuditRemarks && row.sonBillInfo.subBillAuditRemarks !== '') {
        var subBillAuditRemarks = row.sonBillInfo.subBillAuditRemarks.split(";");
        row.auditRemarks = '';
        angular.forEach(subBillAuditRemarks, function (v1, k1) {
          row.auditRemarks += v1 + '<br>';
        });
        if (row.auditRemarks !== '') {
          row.auditRemarks = '<div class="pre-name" style="width:100%;">' + row.auditRemarks + '</div>';
        }
      }
    }

    /**
     * 退回/通过
     */
    function changeStatus(param, type, cancel) {
      var sonBillInfo = param.sonBillInfo;
      restAPI.preJudice.checkStatus.save({}, {
          awId: sonBillInfo.awId,
          operation: type === '1' ? 'pass' : 'reject'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = true;
          // start:小郭,data不等于true时，不能点击通过，默认为退回
          if (resp.status === 9999 && type === '1') {
            // sonBillInfo.subBillAudit = '';
            // param.disablePass = true;
            $rootScope.loading = false;
            Notification.error({
              message: resp.msg
            });
            return
          };
          // end by lixd
          if (resp.status !== 9999) {
            if (vm.buttonGroup.save) {
              $rootScope.loading = false;
              return;
            }
            if (cancel) {
              sonBillInfo.subBillAudit = '0';
              sonBillInfo.subBillAuditRemarks = '';
              $rootScope.loading = false;
            } else {
              if (type === '1') {
                sonBillInfo.subBillAudit = '1';
                sonBillInfo.subBillAuditRemarks = '';
                $rootScope.loading = false;
              } else if (type === '2') {
                $rootScope.loading = false;
                if (sonBillInfo.goodsQuoteId) {
                  quoteNameAdvice(param, type);
                } else {
                  returnReason(param);
                }
              }
            }
          } else {
            Notification.error({
              message: resp.msg
            });
            $rootScope.loading = false;
          }
        });
    }
    /**
     * 保存
     */
    function save(awId) {
      var saveData = [];
      angular.forEach(vm.subBillLists, function (v, k) {
        if (v.sonBillInfo.subBillAudit || v.sonBillInfo.awId===awId) {
          saveData.push({
            awId: v.sonBillInfo.awId,
            subBillAudit: v.sonBillInfo.subBillAudit ? v.sonBillInfo.subBillAudit : '',
            subBillAuditRemarks: v.sonBillInfo.subBillAuditRemarks ? v.sonBillInfo.subBillAuditRemarks : ''
          });
        }
      });
      if (saveData.length) {
        saveOP(saveData);
      } else {
        Notification.warning({
          message: '没有数据需要保存'
        });
      }
    }
    /**
     * 真实保存
     */
    function saveOP(params, callBack, data) {
      $rootScope.loading = true;
      restAPI.preJudice.saveCargo.save({}, params)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            callBack && callBack(data);
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
     * 显示主单、分单品名补充
     */
    function showNameAdvice(param) {
      $modal.open({
        template: require('../../receive/acceptance/nameAaddedDialog.html'),
        controller: require('../../receive/acceptance/nameAaddedDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '品名补充',
              obj: {
                goodsNameCn: param.goodsNameCn,
                goodsNameEn: param.goodsNameEn,
                goodsRemarks: param.goodsRemarks
              }
            };
          }
        }
      });
    }
    /**
     * 主单证书显示
     */
    function searchBook(param, type) {
      if (type === 'other') {
        showOtherBook(param, type);
      } else {
        showBook(param, type);
      }
    }
    /**
     * 显示其他文档
     *
     */
    function showOtherBook(param, type) {
      var otherBookDialog = $modal.open({
        template: require('../ordinaryCargo/otherBook.html'),
        controller: require('../ordinaryCargo/otherBook.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '其他文档',
              obj: {
                awId: param.awId,
                bookType: type,
              }
            };
          }
        }
      });
    }
    /**
     * 显示证书
     */
    function showBook(param, type) {
      vm.wStatusCode = vm.progressObj.waybillStatus.wStatus == '100';
      var bookDialog = $modal.open({
        template: require('../ordinaryCargo/book.html'),
        controller: require('../ordinaryCargo/book.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '证书',
              obj: {
                awId: param.awId,
                bookType: type,
                goodsDesc: param.goodsDesc,
                goodsNameEn: param.goodsNameEn,
                goodsNameCn: param.goodsNameCn,
                saveForbidden: vm.buttonGroup.pass,
                wStatusCode: vm.wStatusCode
              }
            };
          }
        }
      });
      bookDialog.result.then(function (data) {
        $rootScope.loading = true;
        restAPI.preJudice.saveBookCheck.save({}, data.books)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              if(data.isBookTypeChange===true && param.type==='1') {
                param.subBillAudit = '';
                param.subBillAuditRemarks = '';
                save(param.awId);
              } else {
                Notification.success({
                  message: '保存成功'
                });
              }
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
     * 现场检查
     */
    function inspect() {
      var comDialog = $modal.open({
        template: require('./inspect.html'),
        controller: require('./inspect.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '现场检查',
              btnName: '确定',
              obj: {
                awId: vm.parentBillInfo.awId,
                waybillNo: waybillNo,
                preMask: vm.parentBillInfo.preMask,
                selectData: vm.selectData,
                selectID: vm.selectID,
                aStatus: vm.progressObj.waybillStatus.aStatus,
                wStatus: vm.progressObj.waybillStatus.wStatus
              }
            };
          }
        }
      });
      comDialog.result.then(function (resp) {
        refeshRecord();
      }, function () {
        refeshRecord();
      });
    }
    /**
     * 显示按钮
     * 1.假如已有结果，preMask(2)通过；preMask(3)退回；通过的不能再通过；
     * 退回的不能再退回；通过的可以退回；退回的将分单改为通过，可以点击通过;
     * 2没有安检通过的运单，在收单界面不允许用户点击如下按钮：
     *检查清单、通过、不通过
     */
    function showButton() {
      if (vm.parentBillInfo.preMask === '3') {
        vm.buttonGroup.pass = true;
        vm.buttonGroup.noPass = true;
        vm.buttonGroup.inspect = true;
        vm.buttonGroup.other = true;
        vm.buttonGroup.save = true;
      } else if (vm.parentBillInfo.preMask === '2') {
        vm.buttonGroup.pass = true;
        vm.buttonGroup.noPass = false;
        vm.buttonGroup.inspect = true;
        vm.buttonGroup.other = true;
        if (vm.subBillLists.length > 0) {
          vm.buttonGroup.save = false;
        } else {
          vm.buttonGroup.save = true;
        }
      }
    }
    /**
     * 通过
     * 1.所有的数据都是通过，才能通过；不行时，提醒具体的分单号不能操作
     */
    function pass() {
      var saveData = [],
        btnMark = [];
      angular.forEach(vm.subBillLists, function (v, k) {
        if (v.sonBillInfo.subBillAudit !== '1') {
          btnMark.push(v.sonBillInfo.waybillNo);
        }
        saveData.push({
          awId: v.sonBillInfo.awId,
          subBillAudit: v.sonBillInfo.subBillAudit ? v.sonBillInfo.subBillAudit : '',
          subBillAuditRemarks: ''
        });
      });
      if (btnMark.length) {
        passCallBack2(btnMark);
      } else {
        showPassDialog(saveData);
      }
    }
    /**
     * 通过弹窗
     */
    function showPassDialog(saveData) {
      var passDialog = $modal.open({
        template: require('./pass.html'),
        controller: require('./pass.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '通过',
              btnName: '确认通过',
              obj: {
                waybillNo: waybillNo
              }
            };
          }
        }
      });
      passDialog.result.then(function (resp) {
        var obj = {};
        if (resp.fileObj) {
          obj.fileId = resp.fileObj.id;
        }
        obj.comment = resp.actionComments;
        obj.awId = vm.parentBillInfo.awId;
        obj.version = vm.version;
        saveOP(saveData, passCallBack1, obj);
      }, function () {

      });
    }
    /**
     * 真实通过
     */
    function passCallBack1(data) {
      $rootScope.loading = true;
      restAPI.preJudice.checkPass.save({}, data)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.buttonGroup.pass = true;
            vm.buttonGroup.noPass = false;
            vm.buttonGroup.inspect = true;
            vm.buttonGroup.other = true;
            vm.buttonGroup.save = true;
            //gotoNext();
            changeProgress();
            refeshRecord();
            // singleSearch();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 真实通过,点击确定按钮，弹出是否进入下一单预审，“是”页面加载下一单待审核的单，
     * 点击“否”页面停留在原页面，此时只有【不通过】可操作，倒计时停止，
     * 不能再刷新，进度“预审通过”有一个绿色的√；
     */
    function gotoNext() {
      var nextDialog = $modal.open({
        template: require('./gotoNext.html'),
        controller: require('./gotoNext.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '继续审单',
              content: '你是否继续审单？'
            };
          }
        }
      });
      nextDialog.result.then(function (data) {
        search();
      }, function (resp) {});
    }
    getPassReason();
    /**
     * 获取不通过原因
     */
    function getPassReason() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1479635761551284'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.PassReasonData = resp.rows;
          check();
        });
    }
    /**
     * 真实通过--未检验通过
     */
    function passCallBack2(btnMark) {
      $modal.open({
        template: require('./gotoNext.html'),
        controller: require('./gotoNext.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '不能通过原因',
              content: '有分单数据为退回或未做操作。',
              content1: '不能通过分单号为' + btnMark.join('，')
            };
          }
        }
      });
    }
    /**
     * 不通过
     * 1.不通过的数据要全部被操作,假如该运单引用了品名咨询，
     * 需要弹出提示信息，让PACTL用户去查看品名咨询，如果未引用则无需弹出
     */
    function noPass(param1, param2, type) {
      var saveData = [],
        btnMark = [],
        btnMark1 = [];
      angular.forEach(vm.subBillLists, function (v, k) {
        if (v.sonBillInfo.subBillAudit === '2' && !v.sonBillInfo.subBillAuditRemarks) {
          btnMark.push(v.sonBillInfo.waybillNo);
        }
        if (!v.sonBillInfo.subBillAudit) {
          btnMark1.push(v.sonBillInfo.waybillNo);
        }
        saveData.push({
          awId: v.sonBillInfo.awId,
          subBillAudit: v.sonBillInfo.subBillAudit ? v.sonBillInfo.subBillAudit : '',
          subBillAuditRemarks: v.sonBillInfo.subBillAuditRemarks ? v.sonBillInfo.subBillAuditRemarks : ''
        });
      });
      if (type === 'main' && vm.progressObj.waybillStatus.wStatus === '101') {
				dbPre();
			} else {
        if (param1 >= 1) {
          if (btnMark.length || btnMark1.length) {
            noPassCallBack2(btnMark, btnMark1);
          } else {
            showNoPassDialog(saveData);
          }
        } else {
          if (param2.goodsQuoteId) {
            quoteNameAdvice(param2, 'main', saveData);
          } else {
            if (btnMark.length || btnMark1.length) {
              noPassCallBack2(btnMark, btnMark1);
            } else {
              showNoPassDialog(saveData);
            }
          }
        }
      }
    }


    /**
		 * 重新预审
		 */
		function dbPre() {
			var dbPreDialog = $modal.open({
				template: require('../../../remove/remove.html'),
				controller: require('../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							content: '是否需要重新预审?'
						};
					}
				}
			});
			dbPreDialog.result.then(function () {
				restAPI.preJudice.dbPre.save({}, {
          awId: vm.parentBillInfo.awId,
          isLocalCheck: '1'
				}).$promise.then(function (resp) {
					if (resp.ok) {
						Notification.success({
							message: '重新预审成功'
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

    function quoteNameAdvice(param, type, saveData) {
      var nameAdviceDialog = null;
      var goodsQuoteType = type === 'main' ? param.goodsQuoteType : param.sonBillInfo.goodsQuoteType;
      var goodsQuoteId = type === 'main' ? param.goodsQuoteId : param.sonBillInfo.goodsQuoteId;
      var awId = type === 'main' ? param.awId : param.sonBillInfo.awId;
      if (goodsQuoteType === '101') {
        nameAdviceDialog = $modal.open({
          template: require('../ordinaryCargo/nameAdviceDetial.html'),
          controller: require('../ordinaryCargo/nameAdviceDetial.ctrl.js'),
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '品名咨询的详情',
                goodsId: goodsQuoteId,
                awId: awId,
                isSonBill: false
              };
            }
          }
        });
      } else if (goodsQuoteType === '102' || goodsQuoteType === '103') {
        nameAdviceDialog = $modal.open({
          template: require('../ordinaryCargo/shippingWayBill.html'),
          controller: require('../ordinaryCargo/shippingWayBill.ctrl.js'),
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '引用运单信息',
                shippingWayBillAwId: goodsQuoteId,
                awId: awId,
                goodsQuoteType: goodsQuoteType
              };
            }
          }
        });
      }
      nameAdviceDialog.result.then(function (data) {
        $rootScope.loading = true;
        if (type === "2") {
          returnReason(param);
        } else {
          showNoPassDialog(saveData);
        }
      }, function (resp) {});
    }
    /**
     * 不通过弹窗
     */
    function showNoPassDialog(saveData) {
      var nopassDialog = $modal.open({
        template: require('./noPass.html'),
        controller: require('./noPass.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '不通过',
              btnName: '确认退回',
              PassReasonData: vm.PassReasonData,
              obj: {
                waybillNo: waybillNo
              }
            };
          }
        }
      });
      nopassDialog.result.then(function (resp) {
        var obj = {
          comment: []
        };
        if (resp.fileObj) {
          obj.fileId = resp.fileObj.id;
        }
        angular.forEach(resp.remarkData, function (v, k) {
          obj.comment.push(v.name);
        });
        obj.comment = obj.comment.join(';');
        obj.awId = vm.parentBillInfo.awId;
        obj.version = vm.version;
        saveOP(saveData, noPassCallBack1, obj);
      }, function () {

      });
    }
    /**
     * 真实不通过
     */
    function noPassCallBack1(data) {
      $rootScope.loading = true;
      restAPI.preJudice.checkNoPass.save({}, data)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.buttonGroup.pass = true;
            vm.buttonGroup.noPass = true;
            vm.buttonGroup.inspect = true;
            vm.buttonGroup.other = true;
            vm.buttonGroup.save = true;
            //gotoNext();
            changeProgress();
            refeshRecord();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 真实不通过--未检验通过
     */
    function noPassCallBack2(btnMark, btnMark1) {
      $modal.open({
        template: require('./gotoNext.html'),
        controller: require('./gotoNext.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '不能通过原因',
              content: '有分单数据为退回原因未填写或未做操作。',
              content1: btnMark.length ? '未填写退回原因的分单号为' + btnMark.join('，') + '；' : '' +
                btnMark1.length ? '未操作的分单号为' + btnMark1.join('，') : ''
            };
          }
        }
      });
    }
    /**
     * 改变进度条
     */
    function changeProgress() {
      $scope.$broadcast('change-progress');
    }
    /**
     * 刷新审核历史
     */
    function refeshRecord() {
      $scope.$broadcast('history-records');
    }
    /**
     * 货物申报
     */
    function showCargoDeclaraction() {
    	if(vm.progressObj.waybillStatus.shipmentFlag=='1'){
    		return false
    	}
      var cargoDeclaractionDialog = $modal.open({
        template: require('../declaraction/cargoDeclaraction.html'),
        controller: require('../declaraction/cargoDeclaraction.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '货物申报',
              awId: vm.parentBillInfo.awId,
              waybillNo: vm.parentBillInfo.waybillNo
            };
          }
        }
      });
      cargoDeclaractionDialog.result.then(function () {
        $state.reload();
      });
    }

    /**
     * 锂电池
     */
    function showBatteryDeclaraction(param, defaultValue) {
    	if(vm.progressObj.waybillStatus.shipmentFlag=='1'){
    		return false
    	}
      var batteryDeclaractionDialog = $modal.open({
        template: require('../declaraction/batteryDeclaraction.html'),
        controller: require('../declaraction/batteryDeclaraction.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '锂电池',
              awId: vm.parentBillInfo.awId,
              waybillNo: vm.parentBillInfo.waybillNo,
              editAble: false,
              eliFlag: param.eliFlag,
              elmFlag: param.elmFlag,
              defaultValue: defaultValue,
              airCode: vm.parentBillInfo.carrier1
            };
          }
        }
      });
    }

    $scope.$on('inside-search', function (event, data) {
      var name = data.sortObj.name,
        sort = data.sortObj.sort;
      vm.subBillLists.sort(function (a, b) {
        var data1 = a.sonBillInfo[name],
          data2 = b.sonBillInfo[name]
        if (data1 < data2) {
          return sort === 'asc' ? -1 : 1;
        } else if (data1 > data2) {
          return sort === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    });
  }
];

module.exports = angular.module('app.pactlPrejudice.localInspect', []).controller('localInspectCtrl', localInspect_fn);