'use strict';

var applyView_fn = ['$scope', '$stateParams', '$modal', '$rootScope', 'restAPI', 'Notification', '$state', 'Auth', 'editData',
  function ($scope, $stateParams, $modal, $rootScope, restAPI, Notification, $state, Auth, editData) {
    var vm = $scope;
    var awId = $stateParams.awId;
    vm.showText = {
      version: $stateParams.version
    };
    vm.waybillNo = $stateParams.waybillNo;
    vm.back = back;
    vm.billObj = {
      oldData: [],
      masterData: [],
      masterKeyData: [], //主单关键字段
      subData: [],
      subKeyData: [], //分单关键字段
      versionData: {}, //版本信息
      statusData: {},
      firstCheckData: {}, //首检状态
      originbillObj: {}, //原始的所有数据
      newSubBillObj: [], //新的分单数据
      errorData: [],
      subErrorData: [],
      nowSubBill: {}, //当前的分单数据
      nowSubIndex: '' //当前的分单index
    };
    vm.cancel = cancel;
    vm.checkTypeObj = {};
    vm.filedCnData = [];
    vm.save = save;
    vm.statusData = [{
      id: 'none',
      name: '待审核'
    }, {
      id: 'success',
      name: '通过'
    }, {
      id: 'error',
      name: '退回'
    }];
    vm.showCommit = showCommit;
    vm.showNoCommit = showNoCommit;
    vm.showCert = showCert;
    vm.up = up;
    /***********/
    vm.openDialog = openDialog;
    vm.declareDiff = {};

    check();
    /**
     * 校验
     */
    function check() {
      if (awId && vm.waybillNo) {
        search();
      } else {
        $state.go('index');
      }
    }
    /**
     * 获取数据
     */
    function search() {
      getCheckType();
      getCurrentVersion();
      getMasterKey();
      getSubKey();
      getDoneData();
      getStatus();
      getFirstCheck();
      getFiledCn();
    }
    /**
     * 获取字段要显示的中文名
     * 
     */
    function getFiledCn() {
      restAPI.field.queryAll.save({}, {})
        .$promise.then(function (resp) {
          if (resp.ok) {
            vm.filedCnData = resp.data;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 获取当前用户的操作version
     * 
     */
    function getCurrentVersion() {
      restAPI.dataEdit.getVersion.save({}, {
        awId: awId
      }).$promise.then(function (resp) {
        if (resp.ok) {
          vm.billObj.versionData = resp.data;
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 主单关键信息
     * 
     * key  主单201
     */
    function getMasterKey() {
      restAPI.dataEdit.getKeyField.save({}, {
        key: '201'
      }).$promise.then(function (resp) {
        if (resp.ok) {
          vm.billObj.masterKeyData = resp.data;
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 分单关键信息
     * 
     * key 分单202
     */
    function getSubKey() {
      restAPI.dataEdit.getKeyField.save({}, {
        key: '202'
      }).$promise.then(function (resp) {
        if (resp.ok) {
          vm.billObj.subKeyData = resp.data;
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 获取审核完成的数据修改申请
     */
    function getDoneData() {
      restAPI.dataEdit.getDoneData.save({}, {
        DIFF_VERSION: vm.showText.version,
        PARENT_AW_ID: awId
      }).$promise.then(function (resp) {
        if (resp.rows) {
          setTable(resp);
        }
      });
    }
    /**
     * 显示表格数据
     * 
     * @param {any} params
     */
    function setTable(params) {
      var data = [];
      angular.forEach(params.rows, function (v, k) {
        if (v.difference.diffClass === 'class') {
          if (v.difference.classAction === 'update') {
            v.difference.oldValue = '';
            v.srcArr = [];
            angular.forEach(v.files, function (m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                v.difference.oldValue = m.fileHttpPath;
              } else {
                v.srcArr.push(m.fileHttpPath);
              }
            });
          } else if (v.difference.classAction === 'insert') {
            v.difference.newValue = '';
            v.srcArr = [];
            angular.forEach(v.files, function (m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                v.difference.newValue = m.fileHttpPath;
              } else {
                v.srcArr.push(m.fileHttpPath);
              }
            });
          }
        }
        if(v.difference.diffClass === 'cargoDeclare') {
          vm.declareDiff.cargoDeclare = v.difference;
        } else if(v.difference.diffClass === 'liBattery') {
          vm.declareDiff.liBattery = v.difference;
          if(!vm.declareDiff.liBattery.newValue || vm.declareDiff.liBattery.newValue === "") {
            vm.declareDiff.liBattery.newValue = "{}";
          }
          if(!vm.declareDiff.liBattery.oldValue || vm.declareDiff.liBattery.oldValue === "") {
            vm.declareDiff.liBattery.oldValue = "{}";
          }
        } 
        data.push(v);
      });
      vm.billObj.oldData = data;
      setCargoDeclare();
      setLiBattery();
    }

    function setCargoDeclare() {
      vm.loading = true;
      restAPI.declare.cargoDeclare.save({}, {
        awId: awId
      })
      .$promise.then(function (resp) {
         vm.loading = false;
        if (resp.ok && resp.data && resp.data.cargoDeclare) {
          vm.billObj.showCargoDeclare = resp.data.cargoDeclare;
          var localCheck = [];
          angular.forEach(vm.checkTypeObj, function (v, k) {
            if (v.checkFlag === 'true' || v.checkFlag === true) {
              v.checkFlag = true;
            } else if (v.checkFlag === 'false' || v.checkFlag === false) {
              v.checkFlag = false;
            }
            localCheck.push(v);
          });
          vm.billObj.showCargoDeclare.localCheck =  JSON.stringify(localCheck);
          setCargoDeclareDiff();
        }
      });
    }

    function setCargoDeclareDiff() {
      if(vm.declareDiff.cargoDeclare) {
        var newData = JSON.parse(vm.declareDiff.cargoDeclare.newValue);
        var oldData = JSON.parse(vm.declareDiff.cargoDeclare.oldValue);
        vm.billObj.cargoDeclare=compareCargoDeclare(newData,oldData);
        vm.billObj.showCargoDeclare = vm.billObj.cargoDeclare.newData;
      } else {
        var newCargoDeclareData = {cargoDeclare:vm.billObj.showCargoDeclare,localCheck:vm.billObj.showCargoDeclare.localCheck};
        var oldCargoDeclareData = {cargoDeclare:vm.billObj.showCargoDeclare,localCheck:vm.billObj.showCargoDeclare.localCheck};
        delete newCargoDeclareData.cargoDeclare.localCheck;
        delete oldCargoDeclareData.cargoDeclare.localCheck;

        vm.billObj.cargoDeclare = {
          isDifferent : false,
          newData : newCargoDeclareData,
          oldData : oldCargoDeclareData
        }
        vm.billObj.showCargoDeclare = vm.billObj.cargoDeclare.newData;
      }
    }

    function compareCargoDeclare(newData,oldData) {
      var isDifferent = true;
      var left = "";
      var right = "";
      var newCargoDeclare = angular.copy(vm.billObj.showCargoDeclare);
      var oldCargoDeclare = angular.copy(vm.billObj.showCargoDeclare);
      if(newData.dangerFlag !== oldData.dangerFlag) {
        isDifferent = true;
        right += "货物性质:"+getCargoDeclareDangerName(newData.dangerFlag)+";";
        left += "货物性质:"+getCargoDeclareDangerName(oldData.dangerFlag)+";";
        newCargoDeclare.dangerFlag = newData.dangerFlag;
      }
      if(newData.contact !== oldData.contact) {
        isDifferent = true;
        right += "联系人:"+newData.contact+";";
        left += "联系人:"+oldData.contact+";";
        newCargoDeclare.contact = newData.contact;
      }
      if(newData.emergencyPhone !== oldData.emergencyPhone) {
        isDifferent = true;
        right += "应急电话:"+newData.emergencyPhone+";";
        left += "应急电话:"+oldData.emergencyPhone+";";
        newCargoDeclare.emergencyPhone = newData.emergencyPhone;
      }
      if(newData.localCheck !== oldData.localCheck) {
        isDifferent = true;
        right += "现场检查:"+getCargoDeclareLocalCheck(newData.localCheck)+";";
        left += "现场检查:"+getCargoDeclareLocalCheck(oldData.localCheck)+";";
        newCargoDeclare.localCheck = newData.localCheck;
      }
      var obj = {};
      obj.isDifferent = isDifferent;
      obj.differenceLeft = left;
      obj.differenceRight = right;

      var newCargoDeclareData = {cargoDeclare:newCargoDeclare,localCheck:newData.localCheck};
      var oldCargoDeclareData = {cargoDeclare:oldCargoDeclare,localCheck:oldData.localCheck};
      delete newCargoDeclareData.cargoDeclare.localCheck;
      delete oldCargoDeclareData.cargoDeclare.localCheck;
      
      obj.newData = newCargoDeclareData;
      obj.oldData = oldCargoDeclareData;

      return obj;
    }

    function getCargoDeclareDangerName(flag) {
      var name = "";
      if(flag === "1") {
        name = "普货-须提供 《货物运输条件鉴定书》";
      }else if(flag === "2") {
        name = "普货-无《货物运输条件鉴定书》";
      }else if(flag === "0") {
        name = "危险品-须提供 《货物运输条件鉴定书》";
      }else if(flag === "3") {
        name = "危险品-无《货物运输条件鉴定书》";
      }else if(flag === "4") {
        name = "锂电池";
      }
      return name;
    }

    function getCargoDeclareLocalCheck(str) {
      var localCheck = JSON.parse(str); 
      var localCheckName = "";
      angular.forEach(localCheck, function (v, k) {
        if (v.checkFlag === 'true' || v.checkFlag === true) {
          if(localCheckName.length>0) {
            localCheckName += ",";
          }
          localCheckName += v.checkName;
        }
      });
      return localCheckName;
    }

    function setLiBattery() {
      vm.loading = true;
      restAPI.declare.battaryDeclare.save({}, {
          awId: awId
        })
        .$promise.then(function(resp) {
          vm.loading = false;
          if (resp.ok) {
            vm.billObj.showLiBattery = resp.data || {};
            setLiBatteryDiff();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }


    function setLiBatteryDiff() {
      if(vm.declareDiff.liBattery) {
        var newData = JSON.parse(vm.declareDiff.liBattery.newValue);
        var oldData = JSON.parse(vm.declareDiff.liBattery.oldValue);
        vm.billObj.liBattery=compareBatteryDiff(newData,oldData);
        vm.billObj.showLiBattery = vm.billObj.liBattery.newData;
      } else {
        vm.billObj.liBattery = {
          isDifferent : false,
          newData : vm.billObj.showLiBattery,
          oldData : vm.billObj.showLiBattery
        }
      }
    }

    function compareBatteryDiff(newData,oldData) {
      var isDifferent = false;
      var left = "";
      var right = "";
      var newLiBattery = angular.copy(vm.billObj.showLiBattery);
      var oldLiBattery = angular.copy(vm.billObj.showLiBattery);
      if(newData.overpack !== oldData.overpack) {
        isDifferent = true;
        right += "OVERPACK:"+getLiBatteryFlag(newData.overpack)+";";
        left += "OVERPACK:"+getLiBatteryFlag(oldData.overpack)+";";
        newLiBattery.overpack = newData.overpack;
      }
      if(newData.phone !== oldData.phone) {
        isDifferent = true;
        right += "联系电话:"+getLiBatteryEmptyName(newData.phone)+";";
        left += "联系电话:"+getLiBatteryEmptyName(oldData.phone)+";";
        newLiBattery.phone = newData.phone;
      }
      if(newData.eliIiOnly !== oldData.eliIiOnly) {
        isDifferent = true;
        right += "965:"+getLiBatteryFlag(newData.eliIiOnly)+";";
        left += "965:"+getLiBatteryFlag(oldData.eliIiOnly)+";";
        newLiBattery.eliIiOnly = newData.eliIiOnly;
      }
      // if(newData.eliIbOnly !== oldData.eliIbOnly) {
      //   isDifferent = true;
      //   right += ":"+newData.eliIbOnly+";";
      //   left += ":"+oldData.eliIbOnly+";";
      // }
      if(newData.eliIiPack !== oldData.eliIiPack) {
        isDifferent = true;
        right += "966:"+getLiBatteryFlag(newData.eliIiPack)+";";
        left += "966:"+getLiBatteryFlag(oldData.eliIiPack)+";";
        newLiBattery.eliIiPack = newData.eliIiPack;
      }
      if(newData.eliRelation !== oldData.eliRelation) {
        isDifferent = true;
        right += "967:"+getLiBatteryFlag(newData.eliRelation)+";";
        left += "967:"+getLiBatteryFlag(oldData.eliRelation)+";";
        newLiBattery.eliRelation = newData.eliRelation;
      }
      if(newData.eliButtonFlag !== oldData.eliButtonFlag) {
        isDifferent = true;
        right += "ELI纽扣电池:"+getLiBatteryFlag(newData.eliButtonFlag)+";";
        left += "ELI纽扣电池:"+getLiBatteryFlag(oldData.eliButtonFlag)+";";
        newLiBattery.eliButtonFlag = newData.eliButtonFlag;
      }
      if(newData.eliBatteryCellNo !== oldData.eliBatteryCellNo) {
        isDifferent = true;
        right += "PI967锂电池芯:"+getLiBatteryEmptyName(newData.eliBatteryCellNo)+";";
        left += "PI967锂电池芯:"+getLiBatteryEmptyName(oldData.eliBatteryCellNo)+";";
        newLiBattery.eliBatteryCellNo = newData.eliBatteryCellNo;
      }
      if(newData.eliBatteryNo !== oldData.eliBatteryNo) {
        isDifferent = true;
        right += "PI967锂电池:"+getLiBatteryEmptyName(newData.eliBatteryNo)+";";
        left += "PI967锂电池:"+getLiBatteryEmptyName(oldData.eliBatteryNo)+";";
        newLiBattery.eliBatteryNo = newData.eliBatteryNo;
      }
      if(newData.noeli !== oldData.noeli) {
        isDifferent = true;
        right += "ELI无需粘贴锂电池操作标签:"+getLiBatteryFlag(newData.noeli)+";";
        left += "ELI无需粘贴锂电池操作标签:"+getLiBatteryFlag(oldData.noeli)+";";
        newLiBattery.noeli = newData.noeli;
      }
      if(newData.elmIiOnly !== oldData.elmIiOnly) {
        isDifferent = true;
        right += "968:"+getLiBatteryFlag(newData.elmIiOnly)+";";
        left += "968:"+getLiBatteryFlag(oldData.elmIiOnly)+";";
        newLiBattery.elmIiOnly = newData.elmIiOnly;
      }
      // if(newData.elmIbOnly !== oldData.elmIbOnly) {
      //   isDifferent = true;
      //   right += ":"+newData.elmIbOnly+";";
      //   left += ":"+oldData.elmIbOnly+";";
      // }
      if(newData.elmIiPack !== oldData.elmIiPack) {
        isDifferent = true;
        right += "969:"+getLiBatteryFlag(newData.elmIiPack)+";";
        left += "969:"+getLiBatteryFlag(oldData.elmIiPack)+";";
        newLiBattery.elmIiPack = newData.elmIiPack;
      }
      if(newData.elmRelation !== oldData.elmRelation) {
        isDifferent = true;
        right += "970:"+getLiBatteryFlag(newData.elmRelation)+";";
        left += "970:"+getLiBatteryFlag(oldData.elmRelation)+";";
        newLiBattery.elmRelation = newData.elmRelation;
      }
      if(newData.elmButtonFlag !== oldData.elmButtonFlag) {
        isDifferent = true;
        right += "ELM纽扣电池:"+getLiBatteryFlag(newData.elmButtonFlag)+";";
        left += "ELM纽扣电池:"+getLiBatteryFlag(oldData.elmButtonFlag)+";";
        newLiBattery.elmButtonFlag = newData.elmButtonFlag;
      }
      if(newData.elmBatteryCellNo !== oldData.elmBatteryCellNo) {
        isDifferent = true;
        right += "PI970锂电池芯:"+getLiBatteryEmptyName(newData.elmBatteryCellNo)+";";
        left += "PI970锂电池芯:"+getLiBatteryEmptyName(oldData.elmBatteryCellNo)+";";
        newLiBattery.elmBatteryCellNo = newData.elmBatteryCellNo;
      }
      if(newData.elmBatteryNo !== oldData.elmBatteryNo) {
        isDifferent = true;
        right += "PI970锂电池:"+getLiBatteryEmptyName(newData.elmBatteryNo)+";";
        left += "PI970锂电池:"+getLiBatteryEmptyName(oldData.elmBatteryNo)+";";
        newLiBattery.elmBatteryNo = newData.elmBatteryNo;
      }
      if(newData.noelm !== oldData.noelm) {
        isDifferent = true;
        right += "ELM无需粘贴锂电池操作标签:"+getLiBatteryFlag(newData.noelm)+";";
        left += "ELM无需粘贴锂电池操作标签:"+getLiBatteryFlag(oldData.noelm)+";";
        newLiBattery.noelm = newData.noelm;
      }
      if(newData.nameAddress !== oldData.nameAddress) {
        isDifferent = true;
        right += "托运人名称/地址:"+getLiBatteryEmptyName(newData.nameAddress)+";";
        left += "托运人名称/地址:"+getLiBatteryEmptyName(oldData.nameAddress)+";";
        newLiBattery.nameAddress = newData.nameAddress;
      }
      if(newData.signName !== oldData.signName) {
        isDifferent = true;
        right += "托运人或其代理人签名:"+getLiBatteryEmptyName(newData.signName)+";";
        left += "托运人或其代理人签名:"+getLiBatteryEmptyName(oldData.signName)+";";
        newLiBattery.signName = newData.signName;
      }
      if(newData.createTime !== oldData.createTime) {
        isDifferent = true;
        right += "日期:"+getLiBatteryEmptyName(newData.createTime)+";";
        left += "日期:"+getLiBatteryEmptyName(oldData.createTime)+";";
        newLiBattery.createTime = newData.createTime;
      }

      newLiBattery.eli = {};
      newLiBattery.elm = {};
      if ("1" ===newLiBattery.eliIbOnly
					|| "1" ===newLiBattery.eliIiOnly
					|| "1" ===newLiBattery.eliIiPack
					|| "1" ===newLiBattery.eliRelation) {
				newLiBattery.eli.flag = "true";
			} else {
				newLiBattery.eli.flag = "false";
			}
			if ("1" ===newLiBattery.elmIbOnly
					|| "1" ===newLiBattery.elmIiOnly
					|| "1" ===newLiBattery.elmIiPack
					|| "1" ===newLiBattery.elmRelation) {
				newLiBattery.elm.flag = "true";
			} else {
				newLiBattery.elm.flag = "false";
			}

      var obj = {};
      obj.isDifferent = isDifferent;
      obj.differenceLeft = left;
      obj.differenceRight = right;
      obj.newData = newLiBattery;
      obj.oldData = oldLiBattery;
      return obj;
    }

    function getLiBatteryEmptyName(value) {
      if(value) {
        return value;
      } else {
        return "";
      }
    }

    function getLiBatteryFlag(flag) {
      if(flag === "1") {
        return "√";
      } else {
        return "";
      }
    }
    /**
     * 查询运单状态
     * 
     */
    function getStatus() {
      restAPI.dataEdit.getStatus.save({}, {
        awId: awId
      }).$promise.then(function (resp) {
        if (resp.ok) {
          vm.billObj.statusData = resp.data;
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 是否可以出现提交按钮
     */
    function showCommit() {
      var wStatus = vm.billObj.versionData.wStatus,
        aStatus = vm.billObj.versionData.aStatus;
      if (vm.billObj.statusData.dataUpdateFlag !== '1' &&
        ((aStatus === '200' || aStatus === '201' || aStatus === '202') &&
          (wStatus === '101' || wStatus === '301' || wStatus === '302'))) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 显示撤销提交
     */
    function showNoCommit() {
      if (vm.billObj.statusData.dataUpdateFlag === '1') {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 查询首检状态
     * 
     */
    function getFirstCheck() {
      restAPI.dataEdit.getFirstCheck.save({}, {
        awId: awId
      }).$promise.then(function (resp) {
        if (resp.ok) {
          vm.billObj.firstCheckData = resp.data;
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 获取现场检查类型
     */
    function getCheckType() {
      restAPI.waybill.localcheckList.save({}, {
          awId: awId
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            vm.checkTypeObj = resp.data;
          }
        });
    }
    /**
     * 航段没填写完整
     */
    function showFltError() {
      Notification.error({
        message: '有航段信息缺失，请补充完整'
      });
    }
    /**
     * 对航段的校验
     */
    function validFlt(billObj) {
      if (billObj.dest4 || billObj.carrier4) {
        if (!billObj.dest4 || !billObj.carrier4 || !billObj.dest3 || !billObj.carrier3 ||
          !billObj.dest2 || !billObj.carrier2 || !billObj.dest1 || !billObj.carrier1) {
          showFltError();
          return false;
        }
      }
      if (billObj.dest3 || billObj.carrier3) {
        if (!billObj.dest3 || !billObj.carrier3 || !billObj.dest2 || !billObj.carrier2 || !billObj.dest1 || !billObj.carrier1) {
          showFltError();
          return false;
        }
      }
      if (billObj.dest2 || billObj.carrier2) {
        if (!billObj.dest2 || !billObj.carrier2 || !billObj.dest1 || !billObj.carrier1) {
          showFltError();
          return false;
        }
      }
      if (billObj.dest1 || billObj.carrier1) {
        if (!billObj.carrier1 || !billObj.dest1) {
          showFltError();
          return false;
        }
      }
      return true;
    }
    /**
     * 保存
     * 
     *    根据wStatus来选择不同的接口
     * 
     *    条件:
            wStatus为000和102时,直接修改/update/directly
            wStatus为100或者101并且aStatus为210或者211时/update/withoutkeywords
            wStatus为101或301或302并且aStatus为200或201或202时/update/withkeywords (当messageFlag为1时才可以做拉上拉下)
     * 
     */
    function save(callback) {
      if (angular.isNumber(vm.billObj.nowSubIndex)) {
        var oSubData = vm.billObj.newSubBillObj[vm.billObj.nowSubIndex];
        oSubData.pAirWaybillInfo = vm.billObj.nowSubBill;
        vm.billObj.newSubBillObj.splice(vm.billObj.nowSubIndex, 1, oSubData);
      }
      var wStatus = vm.billObj.versionData.wStatus,
        aStatus = vm.billObj.versionData.aStatus;
      if (vm.billObj.errorData.length) {
        Notification.error({
          message: '主单有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      if (vm.billObj.subErrorData.length) {
        Notification.error({
          message: '分单有数据格式错误，请检查标红的输入框'
        });
        return false;
      }
      var obj = getData(),
        masterRcpNo = 0,
        subRcpNo = 0,
        subGrossWeight = 0,
        masterGrossWeight = 0;
      for (var index = 0; index < obj.waybillInfoList.length; index++) {
        var element = obj.waybillInfoList[index];
        if (index === 0) {
          if (!validFlt(element)) {
            showFltError();
            return false;
          }
          masterRcpNo = +(element.rcpNo || 0);
          masterGrossWeight = +(element.grossWeight || 0);
        } else {
          subRcpNo += +(element.rcpNo || 0);
          subGrossWeight += +(element.grossWeight || 0);
        }
      }
      if (obj.waybillInfoList.length > 1) {
        if (masterGrossWeight !== subGrossWeight) {
          Notification.error({
            message: '主单和分单的重量不相等'
          });
          return false;
        }
        if (masterRcpNo > subRcpNo) {
          Notification.error({
            message: '主单件数不得大于分单件数之和'
          });
          return false;
        }
      }
      if (wStatus === '000' || wStatus === '102') {
        saveDirectData(callback);
      } else if ((wStatus === '101' || wStatus === '301' || wStatus === '302') && (aStatus === '200' || aStatus === '201' || aStatus === '202')) {
        saveKeyData(callback);
      } else if ((wStatus === '100' || wStatus === '101') && (aStatus === '210' || aStatus === '211')) {
        saveData(callback);
      } else {
        Notification.error({
          message: '当前的状态不匹配，不能进行任何的保存'
        });
      }
    }
    /**
     * directly 保存
     */
    function saveDirectData(callback) {
      var obj = getData();
      $rootScope.loading = true;
      restAPI.dataEdit.saveDirectData.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            if (callback) {
              callback();
            } else {
              $state.reload();
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * withoutkeywords 保存
     */
    function saveData(callback) {
      var obj = getData();
      $rootScope.loading = true;
      restAPI.dataEdit.saveData.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            if (callback) {
              callback();
            } else {
              $state.reload();
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * withkeywords 保存
     */
    function saveKeyData(callback) {
      var obj = getData();
      $rootScope.loading = true;
      restAPI.dataEdit.saveKeyData.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            if (callback) {
              callback();
            } else {
              $state.reload();
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 需要保存的数据
     */
    function getData() {
      var obj = {};
      obj.version = vm.billObj.versionData;
      obj.waybillInfoList = [];
      obj.waybillBooks = [];
      var data = angular.copy(vm.billObj),
        billObj = angular.copy(data.originbillObj);
      obj.waybillInfoList.push(getObjData(data, billObj.pAirWaybillInfo));
      Array.prototype.push.apply(obj.waybillBooks, getBookData(data));
      angular.forEach(billObj.airWayBillInfoVos, function (v, k) {
        obj.waybillInfoList.push(getObjData(data.newSubBillObj[k].pAirWaybillInfo, v.pAirWaybillInfo));
        Array.prototype.push.apply(obj.waybillBooks, getBookData(data.newSubBillObj[k].pAirWaybillInfo));
      });
      return obj;
    }
    /**
     * 获取具体数据
     * 
     * @param {any} data  新数据
     * @param {any} billObj  原数据
     * @returns
     */
    function getObjData(data, billObj) {
      var obj = {};
      angular.forEach(editData.getOriEditData(), function (v, k) {
        if (!billObj.hasOwnProperty(v)) {
          billObj[v] = undefined;
        }
      });
      for (var key in billObj) {
        if (billObj.hasOwnProperty(key)) {
          var element1 = billObj[key],
            element2 = data[key];
          if (data.hasOwnProperty(key)) {
            switch (key) {
              case 'agreedFlag':
                if (element2 === '0' || element2 === false) {
                  obj[key] = '0';
                } else if (element2 === '1' || element2 === true) {
                  obj[key] = '1';
                }
                break;
              case 'spCountry':
              case 'csCountry':
                if (angular.isObject(element2)) {
                  obj[key] = element2.countryCode;
                } else if (angular.isString(element2)) {
                  obj[key] = element2;
                } else {
                  obj[key] = data[key];
                }
                break;
              case 'agentPartIdentifier':
              case 'accounInforIdentif':
              case 'accounInforIdentif1':
              case 'accounInforIdentif2':
              case 'accounInforIdentif3':
              case 'accounInforIdentif4':
              case 'accounInforIdentif5':
              case 'chargeCode':
              case 'wtVal':
              case 'other':
              case 'weightCode':
              case 'rateClass':
              case 'volumeCode':
                if (angular.isObject(element2)) {
                  obj[key] = element2.id;
                } else if (angular.isString(element2)) {
                  obj[key] = element2;
                } else {
                  obj[key] = data[key];
                }
                break;
              case 'dept':
              case 'dest1':
              case 'dest2':
              case 'dest3':
              case 'dest4':
                if (angular.isObject(element2)) {
                  obj[key] = element2.airportCode;
                } else if (angular.isString(element2)) {
                  obj[key] = element2;
                } else {
                  obj[key] = data[key];
                }
                break;
              case 'carrier1':
              case 'carrier2':
              case 'carrier3':
              case 'carrier4':
                if (angular.isObject(element2)) {
                  obj[key] = element2.airCode;
                } else if (angular.isString(element2)) {
                  obj[key] = element2;
                } else {
                  obj[key] = data[key];
                }
                break;
              case 'currency':
              case 'destCurrency':
                if (angular.isObject(element2)) {
                  obj[key] = element2.currencyCode;
                } else if (angular.isString(element2)) {
                  obj[key] = element2;
                } else {
                  obj[key] = data[key];
                }
                break;
              default:
                obj[key] = data[key];
                break;
            }
          } else {
            obj[key] = element1;
          }
        }
      }
      if (!billObj.hasOwnProperty('refStatus') && data.hasOwnProperty('refStatus')) {
        obj['refStatus'] = data['refStatus'];
      }
      return obj;
    }
    /**
     * 获取需要保存的证书数据
     * 
     * @param {any} item
     */
    function getBookData(item) {
      var params = item.certData;
      var bookType = ['book', 'electric'];
      var data = [];
      if (!params) {
        return data;
      }
      angular.forEach(bookType, function (v, k) {
        var data1 = params[v],
          data2 = params[v + 'Old'];
        angular.forEach(data1, function (m, n) {
          if (m.originType === '2') {
            if (m.type.id === 'sharing') {
              data.push({
                action: 'insert',
                detail: {
                  fileIdList: m.ids,
                  book: {
                    awId: item.awId,
                    bookType: m.type.id,
                    bookCheckType: v,
                    bookNo: m.bookNo,
                    ocId: m.officeCode && m.officeCode.ocId,
                    officeCode: m.officeCode && m.officeCode.officeCode,
                    officeName: m.officeCode && m.officeCode.officeName,
                    bookId: m.book.bookId
                  }
                }
              });
            } else {
              data.push({
                action: 'insert',
                detail: {
                  fileIdList: m.ids,
                  book: {
                    awId: item.awId,
                    bookType: m.type.id,
                    bookCheckType: v,
                    bookNo: m.bookNo,
                    ocId: m.officeCode && m.officeCode.ocId,
                    officeCode: m.officeCode && m.officeCode.officeCode,
                    officeName: m.officeCode && m.officeCode.officeName
                  }
                }
              });
            }
          }
        });
        angular.forEach(data2, function (m, n) {
          data.push({
            action: 'update',
            detail: {
              awId: item.awId,
              id: m.book.id,
              deleteFlag: '1'
            }
          });
        });
      });
      return data;
    }
    /**
     * 提交
     */
    function up() {
      var callback = function () {
        $rootScope.loading = true;
        restAPI.dataEdit.agentCommit.save({}, {
            awId: awId
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '提交成功'
              });
              $state.reload();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }
      save(callback);
    }
    /**
     * 取消提交
     */
    function cancel() {
      var callback = function () {
        $rootScope.loading = true;
        restAPI.dataEdit.agentCancel.save({}, {
            awId: awId
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '撤销提交成功'
              });
              $state.reload();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }
      save(callback);
    }
    /**
     * 是否显示pdf
     */
    function showCert(params) {
      if (/(https?:)|\/.+\.([pP][dD][fF])|([jJ][pP][eE][gG])/.test(params)) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 返回
     */
    function back() {
      $state.go('agentPrejudice.pre', {
        awId: awId
      });
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
          items: function () {
            return params;
          }
        }
      });
    }
  }
];

module.exports = angular.module('app.agentPrejudice.applyView', []).controller('applyViewCtrl', applyView_fn);