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
    var emergencyPhone='1233';
    vm.obj.checkedFlag = false;
    vm.purposeData = [];
    vm.save = save;
    vm.title = items.title;
    vm.liSection2 = false;

    getPurpose();
    getNumber();
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
          getAirLineParams();
        });
    }

     /**
     * 获取航空公司数据
     */
    function getAirLineParams() {
      $rootScope.loading = true;
      restAPI.airData.queryParams.save({}, {
          airCode : items.airCode
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setParam(resp.data || {});
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

     /**
     * 设置参数
     */
    function setParam(param) {
      vm.liSection2 = param.liSection2 === "1";
      search();
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
            if (!vm.obj.cargoDeclare) {
              vm.obj.cargoDeclare = {};
            }
            restAPI.nameAdvice.queryAgentSystem.save().$promise.then(function(resp){
            	console.log(resp)
       		 var k =  resp.data.goodsDeclarePhone;
       		 var l = resp.data.goodsDeclareName
       		 if (!vm.obj.cargoDeclare.contact) {
            		 vm.obj.cargoDeclare.contact =  l
            }
       		if(!vm.obj.cargoDeclare.emergencyPhone){
            		 vm.obj.cargoDeclare.emergencyPhone =  k
            }
       	 })
           
            
        
            if (vm.obj.cargoDeclare.cargoUse) {
              var data = vm.obj.cargoDeclare.cargoUse.split(';');
              angular.forEach(data, function (v, k) {
                for (var index = 0; index < vm.purposeData.length; index++) {
                  var element = vm.purposeData[index];
                  if (v === element.name) {
                    element.checked = true;
                    break;
                  }
                }
              });
            }
            if (vm.obj.cargoDeclare.cargoForm) {
              var data = vm.obj.cargoDeclare.cargoForm.split(';');
              angular.forEach(data, function (v, k) {
                for (var index = 0; index < vm.compositionData.length; index++) {
                  var element = vm.compositionData[index];
                  if (v === element.name) {
                    element.checked = true;
                    break;
                  }
                }
              });
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
          } else if(v.checkId === '104' && vm.liSection2 === true) {
             v.checkFlag = true;
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
      var obj = getData();
      if(!obj.cargoDeclare.contact || !obj.cargoDeclare.emergencyPhone){
        Notification.error({
          message: '联系人和24H紧急电话不能为空！'
        });
        return
      }
      vm.loading = true;
      restAPI.declare.add.save({}, obj)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            $modalInstance.close();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

    /**
     * 封装函数调用一个方法调接口
     */
    function getNumber(){
    	
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