'use strict';

module.exports = ['$scope', 'restAPI', 'Auth', '$modalInstance', 'items', '$modal', '$window', '$state', 'Notification', '$rootScope',
  function ($scope, restAPI, Auth, $modalInstance, items, $modal, $window, $state, Notification, $rootScope) {
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
    vm.awId = '';
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
    vm.onlyNum = onlyNum;
    vm.angetInfo = {};
    vm.box = ""
    getAgentInfo();
    vm.addressFlag=''
  //  vm.agentSystem.addressFlag=vm.box
//ng-init="agentSystem.addressFlag='0'"
    function getAgentInfo() {
      $rootScope.loading = true;
      restAPI.nameAdvice.queryAgentSystemByAwid.query({
          awId: items.awId
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp && resp.length > 0) {
            vm.angetInfo = resp[0];
          }
          search();
        });
    }
    /**
     * 根据awId来获取获取运单号
     * 
     * **/
    function getWaybillNo(awId) {
        vm.loading = true;
        restAPI.subBill.getMasterBill.save(
            awId
          )
          .$promise.then(function (resp) {
            vm.loading = false;
            if (resp.ok) {
            	vm.obj.waybillNo=resp.data.pAirWaybillInfo.waybillNo;
            	vm.aircode = resp.data.pAirWaybillInfo.carrier1;
            }
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
        .$promise.then(function (resp) {
        	console.log(resp)
          vm.loading = false;
          if (resp.ok) {
            console.log(resp)
            vm.obj = resp.data || {};
            transformData();
            if (!vm.obj.createTime) {
              vm.obj.createTime = getNowFormatDate();
            }
            if (vm.obj.isLocalCheckPass === 'true') {
              vm.editAble = false;
            }
          }
          getWaybillNo(items.awId);
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
      var obj = getData();
      if (!obj.phone) {
        Notification.error({
          message: '联系电话不能为空！'
        });
        return
      }
      if (!obj.nameAddress) {
        Notification.error({
          message: '托运人名称/地址不能为空！'
        });
        return
      }
      if (!obj.signName) {
        Notification.error({
          message: '托运人或其代理人签名不能为空！'
        });
        return
      }
      var error = verifyData(obj);
      if (error && error !== '') {
        showErrorDialog(error);
        return;
      }
      vm.loading = true;
      restAPI.declare.addBattary.save({}, obj)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '保存成功'
            });
            vm.itemObj.eliFlag = (resp.data.eliIiOnly === '1' || resp.data.eliIiPack === '1' || resp.data.eliRelation === '1') ? 'true' : 'false';
            vm.itemObj.elmFlag = (resp.data.elmIiOnly === '1' || resp.data.elmIiPack === '1' || resp.data.elmRelation === '1') ? 'true' : 'false';
            $modalInstance.close(vm.itemObj);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
    获取需要保存的数据 1.勾选“1”或“2”后，才能进行“无需锂电池操作标签的选择”。

    填写2电或4芯后，选择“2”，可勾选“无需锂电池操作标签”。

    填写2电或4芯后，选择“1”，必须同时选择“2”，才能勾选“无需锂电池操作标签”。

	未填写2电或4芯，选择“1”，可勾选“无需锂电池操作标签”。
    
    function getData(){
    	var obj = {};
    	obj.lbsId = vm.obj.lbsId || '';
        obj.awId = items.awId;
        obj.phone = vm.obj.phone;
        obj.overpack = (vm.obj.overpack === '1' || vm.obj.overpack === true) ? '1' : '0';
        //已按要求在合成包装件上注明“OVERPACK” 字样（如适用）
        obj.eliIiOnly = (vm.obj.eliIiOnly === '1' || vm.obj.eliIiOnly === true) ? '1' : '0';
        //纯运输电池或电池芯且本票含锂电池的包装件仅有一件（ICAO/IATA 包装说明 965,Section II）– 包装件内只有电池或电池芯，没有设备包装件限量:
        obj.eliIiPack = (vm.obj.eliIiPack === '1' || vm.obj.eliIiPack === true) ? '1' : '0';
        //和设备包装在一起(ICAO/IATA  包装说明 966, Section II) –电池或电池芯作为附件和电子设备包装在一个包 装件内，该设备由电池驱动，且电池没有安装在设备内(2009.1.1之后生产的电池需在外箱上显示瓦时数)
        obj.eliRelation = (vm.obj.eliRelation === '1' || vm.obj.eliRelation === true) ? '1' : '0';
        //安装在设备中(ICAO/IATA 包装说明 967, Section II) –电池或电池芯安装在设备中(2009.1.1之后生产的电池需在外箱上显示瓦时数)。
        obj.eliButtonFlag = (vm.obj.eliButtonFlag === '1' || vm.obj.eliButtonFlag === true) ? '1' : '0';
        obj.eliBatteryCellNo = vm.obj.eliBatteryCellNo;
        //对于PI967，单个包装件内所含的锂电池芯和锂电池数量：
        obj.eliBatteryNo = vm.obj.eliBatteryNo;
        //锂电池芯（和/或）
        obj.noeli = (vm.obj.noeli === '1' || vm.obj.noeli === true) ? '1' : '0';
        obj.noelm = (vm.obj.noelm === '1' || vm.obj.noelm === true) ? '1' : '0';
        // 货物外包装上无需粘贴锂电池操作标签
        obj.nameAddress = vm.obj.nameAddress;
        obj.signName = vm.obj.signName;
        obj.createTime = vm.obj.createTime;
        obj.litype = vm.obj.litype;
        obj.unittype = vm.obj.unittype;
        obj.unitamount = vm.obj.unitamount;
        return obj;
    } /*
    
    *1.勾选“1”或“2”后，才能进行“无需锂电池操作标签的选择”。

    填写2电或4芯后，选择“2”，可勾选“无需锂电池操作标签”。

    填写2电或4芯后，选择“1”，必须同时选择“2”，才能勾选“无需锂电池操作标签”。

	未填写2电或4芯，选择“1”，可勾选“无需锂电池操作标签”。
    *
    *
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
      //（1） 包装件中仅含有装在设备或主板中的纽扣电池
      obj.eliBatteryCellNo = vm.obj.eliBatteryCellNo;
      obj.eliBatteryNo = vm.obj.eliBatteryNo;
      obj.noeli = (vm.obj.noeli === '1' || vm.obj.noeli === true) ? '1' : '0';
      // 货物外包装上无需粘贴锂电池操作标签
      obj.elmIiOnly = (vm.obj.elmIiOnly === '1' || vm.obj.elmIiOnly === true) ? '1' : '0';
      obj.elmIbOnly = (vm.obj.elmIbOnly === '1' || vm.obj.elmIbOnly === true) ? '1' : '0';
      obj.elmIiPack = (vm.obj.elmIiPack === '1' || vm.obj.elmIiPack === true) ? '1' : '0';
      obj.elmRelation = (vm.obj.elmRelation === '1' || vm.obj.elmRelation === true) ? '1' : '0';
      obj.elmButtonFlag = (vm.obj.elmButtonFlag === '1' || vm.obj.elmButtonFlag === true) ? '1' : '0';
      //（1） 包装件中仅含有装在设备或主板中的纽扣电池
      obj.lessthen5kg = (vm.obj.lessthen5kg === '1' || vm.obj.lessthen5kg === true) ? '1' : '0';
      obj.elmBatteryCellNo = vm.obj.elmBatteryCellNo;
      obj.elmBatteryNo = vm.obj.elmBatteryNo;
      obj.noelm = (vm.obj.noelm === '1' || vm.obj.noelm === true) ? '1' : '0';
      // 货物外包装上无需粘贴锂电池操作标签
      obj.nameAddress = vm.obj.nameAddress;
      obj.signName = vm.obj.signName;
      obj.createTime = vm.obj.createTime;
      obj.litype = vm.obj.litype;
      obj.unittype = vm.obj.unittype;
      obj.unitamount = vm.obj.unitamount;
      return obj;
    }
 /**
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
    }
   
     * 显示error
     */
    function verifyData(obj) {
    	var error='';
    	/*if(!(obj.eliBatteryCellNo===true||obj.eliBatteryCellNo==='1')&&!obj.eliCountLimit){
    		error = error+'  填写2电或4芯后，选择“2”，才能勾选“无需锂电池操作标签”'
    	}
    	if(!(obj.eliBatteryCellNo===true||obj.eliBatteryCellNo==='1')&&(!obj.eliButtonFlag&&!!obj.eliCountLimit)){
    		error = error+'  填写2电或4芯后，选择“1”，必须同时选择“2”，才能勾选“无需锂电池操作标签”'
    	}
    	if(!(obj.eliBatteryCellNo===true||obj.eliBatteryCellNo==='1')&&!obj.eliButtonFlag){
    		error = error +'未填写2电或4芯，选择“1”，才能勾选“无需锂电池操作标签'
    	}*/
    		if(obj.eliBatteryCellNo>4||obj.eliBatteryNo>2){
    			error = '无需粘贴锂电池标签，PI967填写的锂电池芯或锂电池的数量，锂电池芯不超过4个或锂电池不超过2个。'
    		}
    	
    	if(obj.eliBatteryCellNo&&obj.eliBatteryNo){
    		error =  '无需粘贴锂电池标签，PI967锂电池芯和锂电池只能填写一项。'
    	}
    	/*
    	if(!(obj.elmBatteryCellNo===true||obj.elmBatteryCellNo==='1')&&!obj.elmCountLimit){
    		error = error+'  填写2电或4芯后，选择“2”，才能勾选“无需锂电池操作标签”'
    	}
    	if(!(obj.elmBatteryCellNo===true||obj.elmBatteryCellNo==='1')&&(!obj.elmButtonFlag&&!!obj.elmCountLimit)){
    		error = error+'  填写2电或4芯后，选择“1”，必须同时选择“2”，才能勾选“无需锂电池操作标签”'
    	}
    	if(!(obj.elmBatteryCellNo===true||obj.elmBatteryCellNo==='1')&&!obj.elmButtonFlag){
    		error = error +'未填写2电或4芯，选择“1”，才能勾选“无需锂电池操作标签'
    	}*/
    
    		if(obj.elmBatteryCellNo>4||obj.elmBatteryNo>2){
    			error ='无需粘贴锂电池标签，PI970填写的锂电池芯或锂电池的数量，锂电池芯不超过4个或锂电池不超过2个。'
    		}
    	if(obj.elmBatteryCellNo&&obj.elmBatteryNo){
    		error = '无需粘贴锂电池标签，PI970代理锂电池芯和锂电池只能填写一项。'
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
          items: function () {
            return {
              title: '操作提示',
              content: msg
            };
          }
        }
      });
    }
    /**!((obj.eliBatteryCellNo || obj.eliBatteryNo)&&obj.eliCountLimit)
     * !((obj.eliBatteryCellNo || obj.eliBatteryNo)&&(obj.eliButtonFlag&&obj.eliCountLimit)) 
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    function flagEli967(obj){
    	if(obj.noeli){
    		if(!obj.eliBatteryCellNo || !obj.eliBatteryNo){
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
        obj.eliCountLimit = '';
        obj.noeli = false;
      }
    }
    function flagElm970(obj){
    	if(obj.noelm){
    		if(!obj.elmBatteryCellNo || !obj.elmBatteryNo){
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
        obj.elmCountLimit = '';
        obj.noelm = false;
      }
    }

    function onlyNum(param) {
      try {
        vm.obj[param] = vm.obj[param].replace(/\D/g, '').replace(/^0*/g, '');
      } catch (error) {
        return;
      }
    }

  }
];