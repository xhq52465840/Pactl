'use strict';

var apply_fn = ['$scope', '$stateParams', '$modal', '$rootScope', 'restAPI', 'Notification', '$state',
  function($scope, $stateParams, $modal, $rootScope, restAPI, Notification, $state) {
    var vm = $scope;
    var awId = $stateParams.awId;
    vm.showText = {
      version: $stateParams.version
    };
    vm.waybillNo = $stateParams.waybillNo;
    vm.audit = audit;
    vm.billObj = {
      auditData: []
    };
    vm.checkTypeObj = {};
    vm.filedCnData = [];
    vm.isPass = isPass;
    vm.remark = remark;
    vm.save = save;
    /***********/
    vm.showCert = showCert;
    vm.openDialog = openDialog;
    vm.declareDiff = {};
    check();
    vm.reBook = reBook;

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
      getFiledCn();
      getCheckType();
      getAuditData();
    }
    /**
     * 获取字段要显示的中文名
     * 
     */
    function getFiledCn() {
      restAPI.field.queryAll.save({}, {})
        .$promise.then(function(resp) {
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
     * 获取提交前的数据修改申请
     */
    function getAuditData() {
      restAPI.dataEdit.getAuditData.save({}, {
        awId: awId
      }).$promise.then(function(resp) {
        if (resp.rows) {
          setTable(resp);
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }
    /**
     * 显示表格数据 apply
     * 
     * @param {any} params
     */
    function setTable(params) {
      var data = [];
      angular.forEach(params.rows, function(v, k) {
        if (v.difference.diffClass === 'class') {
          if (v.difference.classAction === 'update') {
            v.difference.oldValue = [];
            v.difference.newValue = '';
            v.srcArr = [];
            angular.forEach(v.files, function(m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                v.difference.oldValue = m.fileHttpPath;
              } else {
                v.srcArr.push(m.fileHttpPath);
              }
            });
          } else if (v.difference.classAction === 'insert') {
            v.difference.oldValue = '';
            v.difference.newValue = [];
            v.srcArr = [];
            angular.forEach(v.files, function(m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                v.difference.newValue = m.fileHttpPath;
              } else {
                v.srcArr.push(m.fileHttpPath);
              }
            });
          }
          if(v.difference.classType === 'onetime' && v.book && v.book.bookCheckType && v.book.bookCheckType !== 'other') {
            v.book.reBook = v.book.reBook==="1"?true:false;
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
      setCargoDeclare();
      setLiBattery();
      vm.billObj.auditData = data;
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
     * 标记收证书正本
     */
    function reBook($e, param) {
			vm.loading = true;
			restAPI.dataEdit.rebook.save({}, {
				wcdId: param.difference.wcdId,
				reBook: $e.target.checked ? '1' : '0',
				awId: param.difference.awId
			}).$promise.then(function (resp) {
				if (resp.ok) {
					Notification.success({
						message: $e.target.checked ? '收正本证书成功' : '取消收正本证书成功'
					});
					vm.loading = false;
				} else {
					Notification.error({
						message: resp.msg
					});
					vm.loading = false;
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
        .$promise.then(function(resp) {
          if (resp.ok) {
            vm.checkTypeObj = resp.data;
          }
        });
    }
    /**
     * 备注
     */
    function remark(params) {
      var addRemarkDialog = $modal.open({
        template: require('./remark.html'),
        controller: require('./remark.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '添加备注',
              obj: {
                remark: params.difference.reviewComment
              }
            };
          }
        }
      });
      addRemarkDialog.result.then(function(data) {
        params.difference.reviewComment = data.remark;
      }, function(resp) {

      });
    }
    /**
     * 通过/退回
     */
    function isPass(param, type,book) {
      if (type === 'success' && param.classType === 'onetime') {
        if(book && book.bookCheckType !== 'other') {
          Notification.warning({
            message: '记得收取正本哦！'
          });
        }
      }
      param.reviewResult = type;
    }
    /**
     * 保存
     */
    function save() {
      var data = getSaveData();
      var callback = function() {
        Notification.success({
          message: '保存成功'
        });
        getAuditData();
      };
      saveData(data, callback);
    }
    /**
     * 获取需要保存的数据
     */
    function getSaveData() {
      var data = [];
      var auditData = angular.copy(vm.billObj.auditData);
      angular.forEach(auditData, function(v, k) {
        data.push(v.difference);
        if (v.difference.diffClass === 'class') {
          v.difference.oldValue = '';
          v.difference.newValue = '';
          if(v.difference.classType === 'onetime' && v.book && v.book.bookCheckType && v.book.bookCheckType !== 'other') {
            var diffJson = JSON.parse(v.difference.diffJson);
            diffJson.book.reBook = v.book.reBook===true?"1":"0";
            v.difference.diffJson = JSON.stringify(diffJson);
          }
        }
      });
      return data;
    }
    /**
     * 先保存数据
     */
    function saveData(obj, callback) {
      $rootScope.loading = true;
      restAPI.dataEdit.pactlSave.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            callback && callback();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 审核
     */
    function audit() {
      var data = angular.copy(vm.billObj.auditData),
        data2 = [];
      for (var index = 0; index < data.length; index++) {
        var element = data[index];
        if (element.difference.reviewResult === 'none') {
          Notification.error({
            message: '有数据未操作'
          });
          return false;
        } else {
          if (element.difference.diffClass === 'class') {
            element.difference.oldValue = '';
            element.difference.newValue = '';
          }
          data2.push(element.difference);
        }
        if (element.difference.diffClass === 'class') {
          element.difference.oldValue = '';
          element.difference.newValue = '';
          if(element.difference.classType === 'onetime' && element.book && element.book.bookCheckType && element.book.bookCheckType !== 'other') {
            var diffJson = JSON.parse(element.difference.diffJson);
            diffJson.book.reBook = element.book.reBook===true?"1":"0";
            element.difference.diffJson = JSON.stringify(diffJson);
          }
        }
      }
      saveData(data2, auditData);
    }
    /**
     * 审核
     */
    function auditData() {
      $rootScope.loading = true;
      restAPI.dataEdit.pactlAudit.save({}, {
          awId: awId
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '审核成功'
            });
            goApplyView();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 更换页面
     */
    function goApplyView() {
      $state.go("pactlReceive.applyView", {
        awId: awId,
        waybillNo: vm.waybillNo,
        version: vm.showText.version
      });
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
  }
];

module.exports = angular.module('app.pactlReceive.apply', []).controller('applyCtrl', apply_fn);