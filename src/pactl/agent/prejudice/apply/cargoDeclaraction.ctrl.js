'use strict';

module.exports = ['$rootScope', '$scope', 'restAPI', 'Auth', '$modalInstance', 'items', 'Notification',
  function ($rootScope, $scope, restAPI, Auth, $modalInstance, items, Notification) {
    var vm = $scope;
    vm.addLocalcheck = addLocalcheck;
    vm.cancel = cancel;
    vm.compositionData = [];
    vm.changeLocal = changeLocal;
    vm.editAble = items.editAble;
    vm.loading = false;
    vm.obj = {};
    vm.obj.checkedFlag = false;
    vm.purposeData = [];
    vm.save = save;
    vm.title = items.title;
    vm.oldData = {};
    vm.newData = angular.copy(items.newData);

    getPurpose();

    /**
     * 产品用途
     */
    function getPurpose() {
      vm.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480578873935978'
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          vm.purposeData = resp.rows;
          getComposition();
        });
    }
    /**
     * 产品构成
     */
    function getComposition() {
      vm.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1480578890829889'
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          vm.compositionData = resp.rows;
          getCheckType();
        });
    }
    /**
     * 获取现场检查类型
     */
    function getCheckType() {
      restAPI.localecheck.queryList.save({}, {
          awId: items.awId
        })
        .$promise.then(function (resp) {
          angular.forEach(resp.rows, function (v, k) {
            if (v.checkFlag === 'true' || v.checkFlag === true) {
              v.checkFlag = true;
            } else if (v.checkFlag === 'false' || v.checkFlag === false) {
              v.checkFlag = false;
            }
          });
          vm.checkTypeData = resp.rows;
          search();
        });
    }
    /**
     * 获取数据
     */
    function search() {
      vm.loading = true;
      restAPI.declare.cargoDeclare.save({}, {
          awId: items.awId
        })
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            vm.obj = resp.data;
            if(vm.obj.cargoDeclare.dangerFlag==='0' || vm.obj.cargoDeclare.dangerFlag==='3') {
              vm.editAble = false;
            }
            vm.oldData = getData();
            vm.obj.cargoDeclare = vm.newData.cargoDeclare;
            vm.checkTypeData = JSON.parse(vm.newData.localCheck);
            if (!vm.obj.cargoDeclare) {
              vm.obj.cargoDeclare = {};
            }
            if (!vm.obj.cargoDeclare.contact) {
              vm.obj.cargoDeclare.contact = Auth.getUser().username;
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

    function changeLocal(param) {
      var datas = [];
      angular.forEach(vm.checkTypeData, function (v) {
        if (param === '0' || param === '3') {
          if (v.checkId === '102') {
            v.checkFlag = true;
          }
          if (v.checkId === '101') {
            v.checkFlag = false;
          }
        } else if (param === '4') {
          if (v.checkId === '102') {
            v.checkFlag = false;
          }
        } else if (param === '1' || param === '2') {
          if (v.checkId === '102' || v.checkId === '104') {
            v.checkFlag = false;
          }
        }
        datas.push(v)
      });
    }
    /**
     * 增加现场检查
     */
    function addLocalcheck($e, id) {
      var checked = $e.target.checked;
      var datas = [];
      var data = vm.checkTypeData;
      angular.forEach(data, function (v, k) {
          if(v.checkId === id) {
            v.checkFlag = checked;
          }
          if (vm.obj.cargoDeclare.dangerFlag === '0' || vm.obj.cargoDeclare.dangerFlag === '3') {
            if (v.checkId === '102') {
              v.checkFlag = true;
            }
            if (v.checkId === '101') {
              v.checkFlag = false;
            }
          } else if (vm.obj.cargoDeclare.dangerFlag === '4') {
            if (v.checkId === '102') {
              v.checkFlag = false;
            }
          } else if (vm.obj.cargoDeclare.dangerFlag === '1' || vm.obj.cargoDeclare.dangerFlag === '2') {
            if (v.checkId === '102' || v.checkId === '104') {
              v.checkFlag = false;
            }
          }
      });
    }

    /**
     * 保存
     */
    function save() {
      var newData = getData();
      var oldData = vm.oldData;
      var obj = compare(newData,oldData);
      $modalInstance.close(obj);
    }

    function compare(newData,oldData) {
      var isDifferent = false;
      var left = "";
      var right = "";
      if(newData.cargoDeclare.dangerFlag !== oldData.cargoDeclare.dangerFlag) {
        isDifferent = true;
        right += "货物性质:"+getDangerName(newData.cargoDeclare.dangerFlag)+";";
        left += "货物性质:"+getDangerName(oldData.cargoDeclare.dangerFlag)+";";
      }
      if(newData.cargoDeclare.contact !== oldData.cargoDeclare.contact) {
        isDifferent = true;
        right += "联系人:"+getEmptyName(newData.cargoDeclare.contact)+";";
        left += "联系人:"+getEmptyName(oldData.cargoDeclare.contact)+";";
      }
      if(newData.cargoDeclare.emergencyPhone !== oldData.cargoDeclare.emergencyPhone) {
        isDifferent = true;
        right += "应急电话:"+getEmptyName(newData.cargoDeclare.emergencyPhone)+";";
        left += "应急电话:"+getEmptyName(oldData.cargoDeclare.emergencyPhone)+";";
      }
      if(newData.localCheck !== oldData.localCheck) {
        isDifferent = true;
        right += "现场检查:"+getLocalCheck(newData.localCheck)+";";
        left += "现场检查:"+getLocalCheck(oldData.localCheck)+";";
      }
      var obj = {};
      obj.isDifferent = isDifferent;
      obj.differenceLeft = left;
      obj.differenceRight = right;
      obj.newData = newData;
      obj.oldData = oldData;
      return obj;
    }

    function getEmptyName(value) {
      if(value) {
        return value;
      } else {
        return "";
      }
    }

    function getDangerName(flag) {
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

    function getLocalCheck(str) {
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

    /**
     * 获取需要保存的数据
     */
    function getData() {
      var obj = {};
      obj.awId = items.awId;
      obj.cdId = vm.obj.cargoDeclare.cdId || '';
      obj.cargoUse = [];
      angular.forEach(vm.purposeData, function (v, k) {
        if (v.checked) {
          obj.cargoUse.push(v.name);
        }
      });
      obj.cargoUse = obj.cargoUse.join(';');
      obj.cargoForm = [];
      angular.forEach(vm.compositionData, function (v, k) {
        if (v.checked) {
          obj.cargoForm.push(v.name);
        }
      });
      obj.cargoForm = obj.cargoForm.join(';');
      obj.cargoUseOther = vm.obj.cargoDeclare.cargoUseOther;
      obj.cargoFormOther = vm.obj.cargoDeclare.cargoFormOther;
      obj.cargoPrinciple = vm.obj.cargoDeclare.cargoPrinciple;
      obj.cargoInstruction = vm.obj.cargoDeclare.cargoInstruction;
      obj.fullName = vm.obj.cargoDeclare.fullName;
      obj.phone = vm.obj.cargoDeclare.phone;
      obj.dangerFlag = vm.obj.cargoDeclare.dangerFlag;
      obj.contact = vm.obj.cargoDeclare.contact;
      obj.emergencyPhone = vm.obj.cargoDeclare.emergencyPhone;
      var data = {cargoDeclare:obj}
      data.localCheck = JSON.stringify(vm.checkTypeData);
      return data;
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];