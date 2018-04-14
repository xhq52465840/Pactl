'use strict';

module.exports = ['$scope', 'restAPI', 'Auth', '$modalInstance', 'items', '$modal', '$window', '$state', 'Notification','$rootScope',
  function($scope, restAPI, Auth, $modalInstance, items, $modal, $window, $state, Notification,$rootScope) {
    var vm = $scope;
    var unitId = Auth.getUnitId() + '';
    var myUnitId = Auth.getMyUnitId() + '';
    vm.cancel = cancel;
    vm.declare = {
      type: 'ELI'
    };
    vm.editAble = items.editAble;
    vm.itemObj = {
      eliFlag: 'false',
      elmFlag: 'false'
    };
    vm.awId = items.awId;
    vm.waybillNo = items.waybillNo;
    vm.aircode = items.airCode;
    vm.loading = false;
    vm.obj = {};
    vm.xianghq = [{
      name: "主账户",
      token: 0
    }, {
      name: "子账户",
      token: 1
    }, {
      name: "运单",
      token: 2
    }];
    vm.xianghq1 = [{
      name: "主账户",
      token: 0
    }, {
      name: "运单",
      token: 2
    }];
    vm.unitType = (unitId === myUnitId);
    vm.save = save;
    vm.select = select;
    vm.title = items.title;
    vm.transformData = transformData;
    vm.eli967 = eli967;
    vm.flagEli967=flagEli967;
    vm.flagsEli967=flagsEli967;
    vm.flagElm970=flagElm970
    vm.flagsElm970=flagsElm970
    vm.elm970 = elm970;
    vm.oldData = {};
    vm.newData = angular.copy(items.newData);
    vm.box = ""
    //两电四芯判断
    vm.EliBatteryCellNo=EliBatteryCellNo
    vm.EliBatteryNo=EliBatteryNo
    vm.ElmBatteryCellNo=ElmBatteryCellNo
    vm.ElmBatteryNo=ElmBatteryNo
    getAgentInfo();
		vm.addressFlag='';
		/***pactl不显示打印按钮****/
		vm.printFlag = false
		ifPrint()
		function ifPrint(){
			if(Auth.getUnitType()=='agency'){
	    				vm.printFlag = true
	    				
	    			}
		}
    function getAgentInfo() {
      $rootScope.loading = true;
      restAPI.nameAdvice.queryAgentSystemByAwid.query({
        awId : items.awId
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
     * 获取数据
     */
    function search() {
      vm.loading = true;
      restAPI.declare.battaryDeclare.save({}, {
          awId: items.awId
        })
        .$promise.then(function(resp) {
          vm.loading = false;
          if (resp.ok) {
            vm.obj = resp.data || {};
            vm.oldData = getData();
            vm.obj = vm.newData;
            transformData();
                        /********根据用户账号类型显示不同的数据*************/
                       if(vm.printFlag){
            restAPI.nameAdvice.queryForType.query({
              awId: items.awId
            }, {}).$promise.then(function (resp) {
              var number = resp[0].liPhone;
              var address = resp[0].nameAddress;
              var number2 = resp[0].autograph;
              vm.addressFlag=resp[0].addressFlag
              if (!vm.obj.signName) {
                vm.obj.signName = number2||Auth.getUser().username;
              }
              if (!vm.obj.nameAddress) {
                vm.obj.nameAddress = address;
              }
              if (!vm.obj.phone) {
                vm.obj.phone = number;
              }
              vm.changexhq = function () {
                var myselect = document.getElementById("box");
                var index = myselect.selectedIndex;
                var xx = myselect.options[index].value;
                if (vm.unitType) {
                  if (xx == resp[1].addressFlag) {
                    vm.obj.phone = resp[1].liPhone ? resp[1].liPhone : '';
                    vm.obj.nameAddress = resp[1].nameAddress ? resp[1].nameAddress : '';
                    vm.obj.signName = resp[1].autograph ? resp[1].autograph :  Auth.getUser().username;
                  } else if (xx == resp[0].addressFlag) {
                    vm.obj.phone = resp[0].liPhone ? resp[0].liPhone : '';
                    vm.obj.nameAddress = resp[0].nameAddress ? resp[0].nameAddress : '';
                    vm.obj.signName = resp[0].autograph ? resp[0].autograph :  Auth.getUser().username;
                  } else if (xx == resp[2].addressFlag) {
                    vm.obj.phone = resp[2].liPhone ? resp[2].liPhone : '';
                    vm.obj.nameAddress = resp[2].nameAddress ? resp[2].nameAddress : '';
                    vm.obj.signName = resp[2].autograph ? resp[0].autograph :  Auth.getUser().username;
                  }
                }
                else if (!vm.unitType) {
                  if (xx == resp[1].addressFlag) {
                    vm.obj.phone = resp[1].liPhone ? resp[1].liPhone : '';
                    vm.obj.nameAddress = resp[1].nameAddress ? resp[1].nameAddress : '';
                    vm.obj.signName = resp[1].autograph ? resp[1].autograph :  Auth.getUser().username;
                  } else if (xx == resp[0].addressFlag) {
                    vm.obj.phone = resp[0].liPhone ? resp[0].liPhone : '';
                    vm.obj.nameAddress = resp[0].nameAddress ? resp[0].nameAddress : '';
                    vm.obj.signName = resp[0].autograph ? resp[0].autograph : Auth.getUser().username;
                  } else if (xx == resp[2].addressFlag) {
                    vm.obj.phone = resp[2].liPhone ? resp[2].liPhone : '';
                    vm.obj.nameAddress = resp[2].nameAddress ? resp[2].nameAddress : '';
                    vm.obj.signName = resp[2].autograph ? resp[2].autograph : Auth.getUser().username;
                  }
                }
              }
            })}
            if (!vm.obj.signName) {
              vm.obj.signName = Auth.getUser().username;
            }
            if (!vm.obj.createTime) {
              vm.obj.createTime = getNowFormatDate();
            }
            if (vm.obj.isLocalCheckPass === 'true') {
              //vm.editAble = false;
            }
            if(vm.angetInfo.liPhone && !vm.obj.phone) {
              vm.obj.phone = vm.angetInfo.liPhone;
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
          vm.obj.waybillNo = items.waybillNo;
        });
    }

    function transformData() {
      vm.obj.overpack = (vm.obj.overpack === '1' || vm.obj.overpack === true) ? true : false;
      vm.obj.eliIiOnly = (vm.obj.eliIiOnly === '1' || vm.obj.eliIiOnly === true) ? true : false;
      vm.obj.eliIbOnly = (vm.obj.eliIbOnly === '1' || vm.obj.eliIbOnly === true) ? true : false;
      vm.obj.eliIiPack = (vm.obj.eliIiPack === '1' || vm.obj.eliIiPack === true) ? true : false;
      vm.obj.eliRelation = (vm.obj.eliRelation === '1' || vm.obj.eliRelation === true) ? true : false;
      vm.obj.eliButtonFlag = (vm.obj.eliButtonFlag === '1' || vm.obj.eliButtonFlag === true) ? true : false;
      vm.obj.eliCountLimit = (vm.obj.eliCountLimit === '1' || vm.obj.eliCountLimit === true) ? true : false;
      vm.obj.noeli = (vm.obj.noeli === '1' || vm.obj.noeli === true) ? true : false;
      vm.obj.elmIiOnly = (vm.obj.elmIiOnly === '1' || vm.obj.elmIiOnly === true) ? true : false;
      vm.obj.elmIbOnly = (vm.obj.elmIbOnly === '1' || vm.obj.elmIbOnly === true) ? true : false;
      vm.obj.elmIiPack = (vm.obj.elmIiPack === '1' || vm.obj.elmIiPack === true) ? true : false;
      vm.obj.elmRelation = (vm.obj.elmRelation === '1' || vm.obj.elmRelation === true) ? true : false;
      vm.obj.elmButtonFlag = (vm.obj.elmButtonFlag === '1' || vm.obj.elmButtonFlag === true) ? true : false;
      vm.obj.elmCountLimit = (vm.obj.elmCountLimit === '1' || vm.obj.elmCountLimit === true) ? true : false;
      vm.obj.noelm = (vm.obj.noelm === '1' || vm.obj.noelm === true) ? true : false;
      vm.obj.lessthen5kg = (vm.obj.lessthen5kg === '1' || vm.obj.lessthen5kg === true) ? true : false;
    }
    /**
     * 当前时间
     */
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    /**
     * 选择
     */
    function select(type) {
      vm.declare.type = type;
    }
    /**
     * 保存
     */
    function save() {
      var newData = getData();
      var oldData = vm.oldData;
      var obj = compare(newData,oldData);
      if (!newData.phone) {
        Notification.error({
          message: '联系电话不能为空！'
        });
        return
      }
      if (!newData.nameAddress) {
        Notification.error({
          message: '托运人名称/地址不能为空！'
        });
        return
      }
      if (!newData.signName) {
        Notification.error({
          message: '托运人或其代理人签名不能为空！'
        });
        return
      }
      var error = verifyData(newData);
      if (error && error !== '') {
        showErrorDialog(error);
        return;
      }
      vm.loading = true;
      var data = angular.copy(newData);
      data.dataChange = "1";
      delete data.eli;
      delete data.elm;
      restAPI.declare.addBattary.save({}, data)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            //vm.itemObj.eliFlag = (resp.data.eliIiOnly === '1' || resp.data.eliIiPack === '1' || resp.data.eliRelation === '1') ? 'true' : 'false';
            //vm.itemObj.elmFlag = (resp.data.elmIiOnly === '1' || resp.data.elmIiPack === '1' || resp.data.elmRelation === '1') ? 'true' : 'false';
            $modalInstance.close(obj);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

    /**
     * 锂电池声明差异比较
     * @param {*} newData 
     * @param {*} oldData 
     */
    function compare(newData,oldData) {
      var isDifferent = false;
      var left = "";
      var right = "";
      if(newData.overpack !== oldData.overpack) {
        isDifferent = true;
      }
      if(newData.phone !== oldData.phone) {
        isDifferent = true;
      }
      if(newData.eliIiOnly !== oldData.eliIiOnly) {
        isDifferent = true;
      }
      // if(newData.eliIbOnly !== oldData.eliIbOnly) {
      //   isDifferent = true;
      // }
      if(newData.eliIiPack !== oldData.eliIiPack) {
        isDifferent = true;
      }
      if(newData.eliRelation !== oldData.eliRelation) {
        isDifferent = true;
      }
      if(newData.eliButtonFlag !== oldData.eliButtonFlag) {
        isDifferent = true;
      }
      if(newData.eliBatteryCellNo !== oldData.eliBatteryCellNo) {
        isDifferent = true;
      }
      if(newData.eliBatteryNo !== oldData.eliBatteryNo) {
        isDifferent = true;
      }
      if(newData.noeli !== oldData.noeli) {
        isDifferent = true;
      }
      if(newData.elmIiOnly !== oldData.elmIiOnly) {
        isDifferent = true;
      }
      if(newData.elmIbOnly !== oldData.elmIbOnly) {
        isDifferent = true;
      }
      if(newData.elmIiPack !== oldData.elmIiPack) {
        isDifferent = true;
      }
      if(newData.elmRelation !== oldData.elmRelation) {
        isDifferent = true;
      }
      if(newData.elmButtonFlag !== oldData.elmButtonFlag) {
        isDifferent = true;
      }
      if(newData.elmBatteryCellNo !== oldData.elmBatteryCellNo) {
        isDifferent = true;
      }
      if(newData.elmBatteryNo !== oldData.elmBatteryNo) {
        isDifferent = true;
      }
      if(newData.noelm !== oldData.noelm) {
        isDifferent = true;
      }
      if(newData.nameAddress !== oldData.nameAddress) {
        isDifferent = true;
      }
      if (newData.signName !== oldData.signName) {
        isDifferent = true;
      }
      if (newData.createTime !== oldData.createTime) {
        isDifferent = true;
      }
      if (newData.lessthen5kg !== oldData.lessthen5kg) {
        isDifferent = true;
      }
      if (newData.litype !== oldData.litype) {
        isDifferent = true;
      }
      if (newData.unittype !== oldData.unittype) {
        isDifferent = true;
      }
      if (newData.unitamount !== oldData.unitamount) {
        isDifferent = true;
      }

      right = '锂电池声明:\r\n';
      right += newData.lessthen5kg === '1' ? '单个包装件的净重不超过5KG\r\n' : '';
      if (newData.litype || newData.unittype || newData.unitamount) {
        right += newData.litype ? '电池型号:' + newData.litype + ';' : '';
        if (newData.unittype) {
          if (newData.litype) {
            right += ' ';
          }
          right += newData.unittype ? '设备型号:' + newData.unittype + ';' : '';
        }
        if (newData.unitamount) {
          if (newData.litype || newData.unittype) {
            right += ' ';
          }
          right += newData.unitamount ? '设备数量:' + newData.unitamount + ';' : '';
        }
        right += '\r\n';
      }
      right += "ELI:\r\n"
      if (newData.eliIiOnly === '1' || newData.eliIiPack === '1' || newData.eliRelation === '1' || newData.overpack === '1') {
        right += '    ';
        right += newData.eliIiOnly === '1' ? '965' : '';
        if (newData.eliIiPack === '1') {
          if (newData.eliIiOnly === '1') {
            right += '/';
          }
          right += '966';
        }
        if (newData.eliRelation === '1') {
          if (newData.eliIiOnly === '1' || newData.eliIiPack === '1') {
            right += '/';
          }
          right += '967';
        }
        right += newData.overpack === '1' ? ';overpack;' : '';
        right += '\r\n';
      }

      if (newData.eliBatteryCellNo || newData.eliBatteryNo) {
        right += '    ';
        right += newData.eliBatteryCellNo ? ' ' + newData.eliBatteryCellNo + '芯;' : '';
        right += newData.eliBatteryNo ? '' + newData.eliBatteryNo + '电;' : '';
        right += '\r\n';
      }
      right += newData.eliButtonFlag === '1' ? '    仅装在设备或主板中的纽扣电池; \r\n' : '';
      right += newData.noeli === '1' ? '    无需粘贴锂电池标签; \r\n' : '';

      right += 'ELM:\r\n';
      if (newData.elmIiOnly === '1' || newData.elmIiPack === '1' || newData.elmRelation === '1' || newData.overpack === '1') {
        right += '    ';
        right += newData.elmIiOnly === '1' ? '968' : '';
        if (newData.elmIiPack === '1') {
          if (newData.elmIiOnly === '1') {
            right += '/';
          }
          right += '969';
        }
        if (newData.elmRelation === '1') {
          if (newData.elmIiOnly === '1' || newData.elmIiPack === '1') {
            right += '/';
          }
          right += '970';
        }
        right += newData.overpack === '1' ? ' ;overpack; ' : '';
        right += '\r\n';
      }

      if (newData.elmBatteryCellNo || newData.elmBatteryNo) {
        right += '    ';
        right += newData.elmBatteryCellNo ? '' + newData.elmBatteryCellNo + '芯;' : '';
        right += newData.elmBatteryNo ? '' + newData.elmBatteryNo + '电;' : '';
        right += '\r\n';
      }
      right += newData.elmButtonFlag === '1' ? '    仅装在设备或主板中的纽扣电池; \r\n' : '';
      right += newData.noelm === '1' ? '    无需粘贴锂电池标签; \r\n' : '';
      right += newData.nameAddress ? '' + newData.nameAddress + ';\r\n' : '';
      right += newData.signName ? '' + newData.signName + ';\r\n' : '';
      right += newData.phone ? '' + newData.phone + ';\r\n' : '';
      right += newData.createTime ? '' + newData.createTime + ';\r\n' : '';




      left = '锂电池声明:\r\n';
      left += oldData.lessthen5kg === '1' ? '单个包装件的净重不超过5KG\r\n' : '';
      if (oldData.litype || oldData.unittype || oldData.unitamount) {
        left += oldData.litype ? '电池型号:' + oldData.litype + ';' : '';
        if (oldData.unittype) {
          if (oldData.litype) {
            left += ' ';
          }
          left += oldData.unittype ? '设备型号:' + oldData.unittype + ';' : '';
        }
        if (oldData.unitamount) {
          if (oldData.litype || oldData.unittype) {
            left += ' ';
          }
          left += oldData.unitamount ? '设备数量:' + oldData.unitamount + ';' : '';
        }
        left += '\r\n';
      }
      left += "ELI:\r\n"

      if (oldData.eliIiOnly === '1' || oldData.eliIiPack === '1' || oldData.eliRelation === '1' || oldData.overpack === '1') {
        left += '    ';
        left += oldData.eliIiOnly === '1' ? '965' : '';
        if (oldData.eliIiPack === '1') {
          if (oldData.eliIiOnly === '1') {
            left += '/';
          }
          left += '966';
        }
        if (oldData.eliRelation === '1') {
          if (oldData.eliIiOnly === '1' || oldData.eliIiPack === '1') {
            left += '/';
          }
          left += '967';
        }
        left += oldData.overpack === '1' ? ';overpack;' : '';
        left += '\r\n';
      }

      if (oldData.eliBatteryCellNo || oldData.eliBatteryNo) {
        left += '    ';
        left += oldData.eliBatteryCellNo ? ' ' + oldData.eliBatteryCellNo + '芯;' : '';
        left += oldData.eliBatteryNo ? '' + oldData.eliBatteryNo + '电;' : '';
        left += '\r\n';
      }
      left += oldData.eliButtonFlag === '1' ? '    仅装在设备或主板中的纽扣电池; \r\n' : '';
      left += oldData.noeli === '1' ? '    无需粘贴锂电池标签; \r\n' : '';

      left += 'ELM:\r\n';
      if (oldData.elmIiOnly === '1' || oldData.elmIiPack === '1' || oldData.elmRelation === '1' || oldData.overpack === '1') {
        left += '    ';
        left += oldData.elmIiOnly === '1' ? '968' : '';
        if (oldData.elmIiPack === '1') {
          if (oldData.elmIiOnly === '1') {
            left += '/';
          }
          left += '969';
        }
        if (oldData.elmRelation === '1') {
          if (oldData.elmIiOnly === '1' || oldData.elmIiPack === '1') {
            left += '/';
          }
          left += '970';
        }
        left += oldData.overpack === '1' ? ' ;overpack; ' : '';
        left += '\r\n';
      }
      if (oldData.elmBatteryCellNo || oldData.elmBatteryNo) {
        left += '    ';
        left += oldData.elmBatteryCellNo ? '' + oldData.elmBatteryCellNo + '芯;' : '';
        left += oldData.elmBatteryNo ? '' + oldData.elmBatteryNo + '电;' : '';
        left += '\r\n';
      }
      left += oldData.elmButtonFlag === '1' ? '    仅装在设备或主板中的纽扣电池; \r\n' : '';
      left += oldData.noelm === '1' ? '    无需粘贴锂电池标签; \r\n' : '';
      left += oldData.nameAddress ? '' + oldData.nameAddress + ';\r\n' : '';
      left += oldData.signName ? '' + oldData.signName + ';\r\n' : '';
      left += oldData.phone ? '' + oldData.phone + ';\r\n' : '';
      left += oldData.createTime ? '' + oldData.createTime + ';\r\n' : '';

      var obj = {};
      obj.isDifferent = isDifferent;
      obj.differenceLeft = left;
      obj.differenceRight = right;
      obj.newData = newData;
      obj.oldData = oldData;

      newData.eli = {};
      newData.elm = {};
      if ("1" ===newData.eliIbOnly
					|| "1" ===newData.eliIiOnly
					|| "1" ===newData.eliIiPack
					|| "1" ===newData.eliRelation) {
				newData.eli.flag = "true";
			} else {
				newData.eli.flag = "false";
			}
			if ("1" ===newData.elmIbOnly
					|| "1" ===newData.elmIiOnly
					|| "1" ===newData.elmIiPack
					|| "1" ===newData.elmRelation) {
				newData.elm.flag = "true";
			} else {
				newData.elm.flag = "false";
      }
      if(!newData.awId) {
        newData.awId = vm.awId;
      }
      return obj;
    }

    function getEmptyName(value) {
      if(value) {
        return value;
      } else {
        return "";
      }
    }

    function getFlag(flag) {
      if(flag === "1") {
        return "√";
      } else {
        return "";
      }
    }

    /**
     * 获取需要保存的数据
     */
    function getData() {
      var obj = {};
      obj.lbsId = vm.obj.lbsId || '';
      obj.awId = items.awId;
      obj.overpack = (vm.obj.overpack === '1' || vm.obj.overpack === true) ? '1' : '0';
      obj.phone = vm.obj.phone;
      obj.eliIiOnly = (vm.obj.eliIiOnly === '1' || vm.obj.eliIiOnly === true) ? '1' : '0';
      obj.eliIbOnly = (vm.obj.eliIbOnly === '1' || vm.obj.eliIbOnly === true) ? '1' : '0';
      obj.eliIiPack = (vm.obj.eliIiPack === '1' || vm.obj.eliIiPack === true) ? '1' : '0';
      obj.eliRelation = (vm.obj.eliRelation === '1' || vm.obj.eliRelation === true) ? '1' : '0';
      obj.eliButtonFlag = (vm.obj.eliButtonFlag === '1' || vm.obj.eliButtonFlag === true) ? '1' : '0';
      obj.eliCountLimit = (vm.obj.eliCountLimit === '1' || vm.obj.eliCountLimit === true) ? '1' : '0';
      obj.eliBatteryCellNo = vm.obj.eliBatteryCellNo;
      obj.eliBatteryNo = vm.obj.eliBatteryNo;
      obj.noeli = (vm.obj.noeli === '1' || vm.obj.noeli === true) ? '1' : '0';
      obj.elmIiOnly = (vm.obj.elmIiOnly === '1' || vm.obj.elmIiOnly === true) ? '1' : '0';
      obj.elmIbOnly = (vm.obj.elmIbOnly === '1' || vm.obj.elmIbOnly === true) ? '1' : '0';
      obj.elmIiPack = (vm.obj.elmIiPack === '1' || vm.obj.elmIiPack === true) ? '1' : '0';
      obj.elmRelation = (vm.obj.elmRelation === '1' || vm.obj.elmRelation === true) ? '1' : '0';
      obj.elmButtonFlag = (vm.obj.elmButtonFlag === '1' || vm.obj.elmButtonFlag === true) ? '1' : '0';
      obj.elmCountLimit = (vm.obj.elmCountLimit === '1' || vm.obj.elmCountLimit === true) ? '1' : '0';
      obj.lessthen5kg = (vm.obj.lessthen5kg === '1' || vm.obj.lessthen5kg === true) ? '1' : '0';
      obj.elmBatteryCellNo = vm.obj.elmBatteryCellNo;
      obj.elmBatteryNo = vm.obj.elmBatteryNo;
      obj.noelm = (vm.obj.noelm === '1' || vm.obj.noelm === true) ? '1' : '0';
      obj.nameAddress = vm.obj.nameAddress;
      obj.signName = vm.obj.signName;
      obj.createTime = vm.obj.createTime;
      obj.litype = vm.obj.litype;
      obj.unittype = vm.obj.unittype;
      obj.unitamount = vm.obj.unitamount;
      return obj;
    }
/*****显示错误的信息**************
    function verifyData(obj) {
      var error = '';
      if ((obj.noeli === true || obj.noeli === '1') && (!obj.eliBatteryCellNo || obj.eliBatteryCellNo === '') && (!obj.eliBatteryNo || obj.eliBatteryNo === '') && (!obj.eliButtonFlag || obj.eliButtonFlag === '' || obj.eliButtonFlag == false)) {
        error = error + 'PI967勾选了外包装无需粘贴锂电池操作标签，锂电池芯的数量或者锂电池的数量至少要填写一个;或者勾选[包装件中仅含有装在设备或主板中的纽扣电池];';
      }
      if ((obj.noeli === true || obj.noeli === '1') && obj.eliBatteryCellNo && (obj.eliBatteryCellNo !== '' && obj.eliBatteryCellNo !== '1' && obj.eliBatteryCellNo !== '2' && obj.eliBatteryCellNo !== '3' && obj.eliBatteryCellNo !== '4')) {
        error = error + 'PI967勾选了外包装无需粘贴锂电池操作标签，锂电池芯的数量只能填1,2,3,4;';
      }
      if ((obj.noeli === true || obj.noeli === '1') && obj.eliBatteryNo && (obj.eliBatteryNo !== '' && obj.eliBatteryNo !== '1' && obj.eliBatteryNo !== '2')) {
        error = error + 'PI967勾选了外包装无需粘贴锂电池操作标签，锂电池的数量只能填1,2;';
      }
      if ((obj.noelm === true || obj.noelm === '1') && (!obj.elmBatteryCellNo || obj.elmBatteryCellNo === '') && (!obj.elmBatteryNo || obj.elmBatteryNo === '') && (!obj.elmButtonFlag || obj.elmButtonFlag === '' || obj.elmButtonFlag == false)) {
        error = error + 'PI970勾选了外包装无需粘贴锂电池操作标签，锂电池芯的数量或者锂电池的数量至少要填写一个;或者勾选[包装件中仅含有装在设备或主板中的纽扣电池];';
      }
      if ((obj.noelm === true || obj.noelm === '1') && obj.elmBatteryCellNo && (obj.elmBatteryCellNo !== '' && obj.elmBatteryCellNo !== '1' && obj.elmBatteryCellNo !== '2' && obj.elmBatteryCellNo !== '3' && obj.elmBatteryCellNo !== '4')) {
        error = error + 'PI970勾选了外包装无需粘贴锂电池操作标签，锂电池芯的数量只能填1,2,3,4;';
      }
      if ((obj.noelm === true || obj.noelm === '1') && obj.elmBatteryNo && (obj.elmBatteryNo !== '' && obj.elmBatteryNo !== '1' && obj.elmBatteryNo !== '2')) {
        error = error + 'PI970勾选了外包装无需粘贴锂电池操作标签，锂电池的数量只能填1,2;';
      }
      return error;
    }**/
    /**
     * 显示error
     */
    function verifyData(obj) {
    	var error='';
    	if(obj.noeli===true||obj.noeli==='1'){
    		if(obj.eliBatteryCellNo>4||obj.eliBatteryNo>2){
    			error = '无需粘贴锂电池标签，PI967填写的锂电池芯或锂电池的数量，锂电池芯不超过4个或锂电池不超过2个。'
    		}
    }
    	if(obj.noeli===true||obj.noeli==='1'){
    	if(obj.eliBatteryCellNo&&obj.eliBatteryNo){
    		error =  '无需粘贴锂电池标签，PI967锂电池芯和锂电池只能填写一项。'
    	}}
    	if(obj.noelm===true||obj.noelm==='1'){
    		if(obj.elmBatteryCellNo>4||obj.elmBatteryNo>2){
    			error = '无需粘贴锂电池标签，PI970填写的锂电池芯或锂电池的数量，锂电池芯不超过4个或锂电池不超过2个。'
    			}
    		}
    	if(obj.noelm===true||obj.noelm==='1'){
    		if(obj.elmBatteryCellNo&&obj.elmBatteryNo){
    		error = '无需粘贴锂电池标签，PI970代理锂电池芯和锂电池只能填写一项。'
    	}
    		}
    	return error
    }
    function showErrorDialog(msg) {
      var errorDialog = $modal.open({
        template: require('../../../remove/remove1.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '操作提示',
              content: msg
            };
          }
        }
      });
    }
    /****两电四芯判断****/
    function EliBatteryCellNo(obj){
    	if(obj.noeli){
    		if(obj.eliButtonFlag&&!obj.eliCountLimit&&obj.eliBatteryCellNo){
    			 obj.noeli = false;
    		}
    	}
    	if(obj.noeli){
    		if(!obj.eliBatteryCellNo&&!obj.eliButtonFlag&&obj.eliCountLimit&&!obj.eliBatteryNo){
    			 obj.noeli = false;
    		}
    	}
    }
    function  EliBatteryNo(obj){
    	if(obj.noeli){
    		if(obj.eliButtonFlag&&!obj.eliCountLimit&&obj.eliBatteryNo){
    			 obj.noeli = false;
    		}
    	}
    	if(obj.noeli){
    		if(!obj.eliBatteryNo&&!obj.eliButtonFlag&&obj.eliCountLimit&&!obj.eliBatteryCellNo){
    			 obj.noeli = false;
    		}
    	}
    }
    function ElmBatteryCellNo(obj){
    	if(obj.noelm){
    		if(obj.elmButtonFlag&&!obj.elmCountLimit&&obj.elmBatteryCellNo){
    			 obj.noelm = false;
    		}
    	}
    	if(obj.noelm){
    		if(!obj.elmBatteryCellNo&&!obj.elmButtonFlag&&obj.elmCountLimit&&!obj.elmBatteryNo){
    			 obj.noelm = false;
    		}
    	}
    }
    function  ElmBatteryNo(obj){
    	if(obj.noelm){
    		if(obj.elmButtonFlag&&!obj.elmCountLimit&&obj.elmBatteryNo){
    			 obj.noelm = false;
    		}
    	}
    	if(obj.noelm){
    		if(!obj.elmBatteryNo&&!obj.elmButtonFlag&&obj.elmCountLimit&&!obj.elmBatteryCellNo){
    			 obj.noelm = false;
    		}
    	}
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    function flagEli967(obj){
    	if(obj.noeli){
    		if((!obj.eliBatteryCellNo && !obj.eliBatteryNo)&&!obj.eliButtonFlag){
    			 obj.noeli = false;
    		}
    	}
    	
    }
    function flagsEli967(obj){
    	if(obj.noeli){
    		if(obj.eliBatteryCellNo || obj.eliBatteryNo){
    			 obj.noeli = false;
    		}
    		if((obj.eliBatteryCellNo || obj.eliBatteryNo)&&obj.eliButtonFlag){
    			obj.noeli = false;
    		}
    	}
    }
    function eli967(obj) {
      if (!obj.eliRelation) {
        obj.eliBatteryCellNo = '';
        obj.eliBatteryNo = '';
        obj.eliButtonFlag = '';
        obj.noeli = false;
      }
    }
    function flagElm970(obj){
    	if(obj.noelm){
    		if((!obj.elmBatteryCellNo && !obj.elmBatteryNo)&&!obj.elmButtonFlag){
    			 obj.noelm = false;
    		}
    	}
    }
    function flagsElm970(obj){
    	if(obj.noelm){
    		if(obj.elmBatteryCellNo || obj.elmBatteryNo){
    			 obj.noelm = false;
    		}
    		if((obj.elmBatteryCellNo || obj.elmBatteryNo)&&obj.elmButtonFlag){
    			obj.noelm = false;
    		}
    	}
    }
    function elm970(obj) {
      if (!obj.elmRelation) {
        obj.elmBatteryCellNo = '';
        obj.elmBatteryNo = '';
        obj.elmButtonFlag = '';
        obj.noelm = false;
      }
    }
  }
];