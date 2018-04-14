'use strict';

var reCheck_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', '$state',
  function ($scope, restAPI, $modal, Notification, $rootScope, $state) {
    var vm = $scope;
    var addItems = [];
    vm.checkObj = {
      status: [],
      fstatus: []
    };
    vm.checkData = [];
    vm.checkFstatus = checkFstatus;
    vm.clean = clean;
    vm.goodTypeData = [{
      id: '0',
      name: '普货'
    }, {
      id: '1',
      name: '危险品'
    }, {
      id: '2',
      name: '24小时货'
    }];
    vm.airportData = [];
    vm.aisleData = [];
    vm.machineData = [];
    vm.list = list;
    vm.pass = pass;
    vm.refuse = refuse;
    vm.save = save;
    vm.search = search;
    vm.reasonData = [];
    vm.seizureData = [];
    vm.dangerData = [];
    vm.showRemark = showRemark;
    vm.showReason = showReason;
    vm.passYes = passYes;
    vm.showPdfDialog = showPdfDialog;
    vm.passYesWithReason = passYesWithReason;
    vm.removeCheck = removeCheck;
    vm.selectedAwid;
    vm.tr_mouseenter = tr_mouseenter;
    vm.tr_mouseleave = tr_mouseleave;
    vm.refreshDest = refreshDest;
    vm.CheckTimeout1 = -1;
    vm.CheckTimeout2 = -1;
    vm.CheckDetain = 0;
    vm.earliestTime = null;
    vm.getDiffHours = getDiffHours;
    vm.setUrgencyType = setUrgencyType;
    vm.selectFstatus = selectFstatus;
    vm.reset = reset;
    vm.informalRule = '';
		vm.changeType=changeType
		vm.clickType=clickType
		vm.resultFlag=false
		vm.noresultFlag=false
		vm.removeMsg = removeMsg;
		vm.saveMsg = saveMsg;
	vm.user={"securePass":undefined}
    getInformalRule();
    var k;
		//首检已有结论，从普货变成24h安检
		function clickType(e){
			k=123
			if((this.$select.selected.name=='普货')&&(e.fstatus)){
				vm.resultFlag=true
			}else if((this.$select.selected.name=='普货')&&(!e.fstatus)){
				vm.noresultFlag=true
			}else{
				vm.noresultFlag=false
				vm.resultFlag=false
			}
		}
		function changeType(item){
			console.log(k)
				if(this.$select.selected.name=='24小时货'&&vm.resultFlag){
					item.showMsg = true;
					vm.billAwid=item.awId			
				}else if(this.$select.selected.name=='24小时货'&&vm.noresultFlag){
					item.clickFlag=true
				}else{
					item.showMsg = false;
					item.clickFlag=false
				}
				}
		//点击取消隐藏提示信息
		function removeMsg(item){
			item.showMsg = false;
		}
		//点击保存信息
		function saveMsg(item){
			vm.user.securePass=vm.user.securePass==undefined?vm.user.securePass:(vm.user.securePass+'')
			item.showMsg = false;
			if (vm.user.securePass=="0") {
				item.clickFlag=true
			}else{
				item.clickFlag=false
			}
			restAPI.reCheck.addPrompt.save({},{'type':vm.user.securePass, "awId":vm.billAwid}).$promise.then(function(resp){
				if(resp.ok){
					
				}
			})
			vm.user.securePass=undefined
		}
    function getInformalRule() {
      $rootScope.loading = true;
      restAPI.systemSet.querySingleSet.save({},'informalRule')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok && resp.data && resp.data.regVal && resp.data.regVal.length>0) {
            vm.informalRule = resp.data.regVal;
          }
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
          vm.airportData = resp.rows;
        });
    }
     /**
     * 获取目的港
     */
    function getAirportData() {
      $rootScope.loading = true;
      restAPI.airPort.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.airportData = resp.data;
        });
    }

    getMachineData();
    /**
     * 获取安检机
     */
    function getMachineData() {
      $rootScope.loading = true;
      restAPI.machine.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.machineData = resp.data;
          getAisle();
        });
    }
    /**
     * 24小时货通道
     */
    function getAisle(params) {
      $rootScope.loading = true;
      restAPI.aisle.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.aisleData = resp.rows;
          getSeizure();
        });
    }
    /**
     * 获取扣押库
     */
    function getSeizure() {
      $rootScope.loading = true;
      restAPI.seizure.queryAvailable.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.seizureData = resp.list;
          getDanger();
        });
    }
    /**
     * 获取危险品分类
     */
    function getDanger() {
      $rootScope.loading = true;
      restAPI.danger.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.dangerData = resp.rows;
          searchList();
        });
    }
    /**
     * 初始查询
     */
    function searchList() {
      var obj = getCondition();
      $rootScope.loading = true;
      restAPI.reCheck.queryList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.checkData = [];
            addItems = [];
            vm.earliestTime = null;
            if(resp.data && resp.data.CheckTimeout1) {
              vm.CheckTimeout1 = resp.data.CheckTimeout1;
            }
            if(resp.data && resp.data.CheckTimeout2) {
              vm.CheckTimeout2 = resp.data.CheckTimeout2;
            }
            if(resp.data && resp.data.CheckDetain) {
              vm.CheckDetain = resp.data.CheckDetain;
            } else {
              vm.CheckDetain = 0;
            }
            angular.forEach(resp.data.list || [], function (v, k) {
              showList(v);
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 查询
     */
    function search(clean) {
      // if (!vm.checkObj.waybillno) {
      //   Notification.error({
      //     message: '请输入总单号'
      //   });
      //   return false;
      // }
      // getCheckData(clean);
      searchList();
    }
    /**
     * 获取复检数据
     */
    function getCheckData(clean) {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.reCheck.checkList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if(resp.data && resp.data.CheckTimeout1) {
              vm.CheckTimeout1 = resp.data.CheckTimeout1;
            }
            if(resp.data && resp.data.CheckTimeout2) {
              vm.CheckTimeout2 = resp.data.CheckTimeout2;
            }
            angular.forEach(resp.data.list || [], function (v, k) {
              showList(v);
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
          if (clean) {
            vm.checkObj.waybillno = '';
          }
        });
    }
    function setUrgencyType(item,hours) {
      item.urgencyType = "0";
      if(vm.CheckTimeout1 && vm.CheckTimeout1!==-1) {
        var CheckTimeout1 = parseInt(vm.CheckTimeout1);
        if(hours>=CheckTimeout1) {
          item.urgencyType = "1";
        }
      }

      if(vm.CheckTimeout2 && vm.CheckTimeout2!==-1) {
        var CheckTimeout2 = parseInt(vm.CheckTimeout2);
        if(hours>=CheckTimeout2) {
          item.urgencyType = "2";
        }
      }
    }

    function getDiffHours(date1,date2) {
      var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数
      var hours=Math.floor(date3/(1000*60*60));
      return hours;
    }
    /**
     * 重置
     */
    function reset() {
      vm.checkObj = {
        status: [],
        station: [],
        fstatus: []
      };
      vm.checkData = [];
    }
    /**
     * 显示列表
     */
    function showList(data) {
    	data.showMsg = false
    	data.clickFlag = false
      var index = addItems.indexOf(data.id);
      if (index < 0) {
        addItems.unshift(data.id);
        if (data.goods_desc) {
          data.goods_desc1 = data.goods_desc.length > 15 ? data.goods_desc.substring(0, 15) + '...' : data.goods_desc;
          data.div = '<div class="pre-name" style="width:100%;word-break:break-all ">' + data.goods_desc + '</div>';
        }
        if (data.goods_class) {
          angular.forEach(vm.goodTypeData, function (v, k) {
            if (v.id === data.goods_class) {
              data.goods_class = v;
            }
          });
          if(data.warehouse) {
            for (var index = 0; index < vm.seizureData.length; index++) {
              var element = vm.seizureData[index];
              if (data.warehouse === element.id) {
                data.seizure = element;
                break;
              }
            }
          }
          if(data.dgoodsflag) {
            var dgoodsflagIds = data.dgoodsflag && data.dgoodsflag.split(',');
            data.danger = [];
            angular.forEach(dgoodsflagIds, function (v, k) {
              for (var index = 0; index < vm.dangerData.length; index++) {
                var element = vm.dangerData[index];
                if (v === element.id) {
                  data.danger.push(element);
                  break;
                }
              }
            });
          }
        }
        data.count_remark = data.count_remark+"";
        vm.checkData.unshift(data);
      } else {
        addItems.splice(index, 1);
        vm.checkData.splice(index, 1);
        showList(data);
      }
      if(data.fchecktime) {
        try {
          var fchecktime = data.fchecktime;
          if(fchecktime.indexOf('-')>=0) {
            fchecktime = fchecktime.replace(/-/g,'/');
          }
          data.fchecktime = new Date(fchecktime);
          if(!vm.earliestTime) {
            vm.earliestTime = data.fchecktime;
          } else {
            if(vm.earliestTime > data.fchecktime) {
              vm.earliestTime = data.fchecktime;
            }
          }
          var date2 = new Date();
          var diffHours = getDiffHours(data.fchecktime,date2);
          setUrgencyType(data,diffHours);
        } catch (error) {
          
        }
      }
    }

    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {};
      if (vm.checkObj.waybillno) {
        obj.waybillno = vm.checkObj.waybillno;
      }
      // if (vm.sortObj && vm.sortObj.name) {
      //   obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      // }
      obj.waybillno = vm.checkObj.waybillno;
      obj.stime = vm.checkObj.stime;
      obj.etime = vm.checkObj.etime;
      obj.flight = vm.checkObj.flight;
      obj.flt_date = vm.checkObj.flt_date;
      if (vm.checkObj.dest1) {
        obj.dest1 = vm.checkObj.dest1.airportCode;
      }
      if (vm.checkObj.aisle24) {
        obj.aisle24 = vm.checkObj.aisle24.id;
      }
      if (vm.checkObj.goods_class) {
        obj.goods_class = vm.checkObj.goods_class.id;
      }
      if (vm.checkObj.machine) {
        obj.machine = vm.checkObj.machine.id;
      }
      obj.status = vm.checkObj.status.join(';');
      // obj.ct = vm.checkObj.station.join(';');
      obj.fstatus = vm.checkObj.fstatus.join(';');
      return obj;
    }
     /**
     * 首检状态 选择
     */
    function selectFstatus($e, data) {
      var checkbox = $e.target,
        index = vm.checkObj.fstatus.indexOf(data);
      checkbox.checked ? vm.checkObj.fstatus.push(data) : vm.checkObj.fstatus.splice(index, 1);
    }
    /**
     * 清除已完成运单
     */
    function clean() {
      $rootScope.loading = true;
      var arr = [];
      angular.forEach(vm.checkData, function (v, k) {
        arr.push({
          awId: v.awId,
          sstatus: v.sstatus
        });
      });
      restAPI.reCheck.checkmsgc.save({}, arr)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            vm.checkData = [];
            searchList();
          } else {
            Notification.error({
              message: resp.msg
            });
          }

          if (resp.ok) {
            if(resp.data && resp.data.CheckTimeout1) {
              vm.CheckTimeout1 = resp.data.CheckTimeout1;
            }
            if(resp.data && resp.data.CheckTimeout2) {
              vm.CheckTimeout2 = resp.data.CheckTimeout2;
            }
            angular.forEach(resp.data.list || [], function (v, k) {
              showList(v);
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }


        });
    }

    /**
     * 删除当前运单
     */
    function removeCheck(item) {
      var cleDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '从列表中移除',
              content: '你将要从列表中移除运单' + item.waybill_no + ',移除运单不会改变运单安检结论。'
            };
          }
        }
      });
      cleDialog.result.then(function () {
        $rootScope.loading = true;
        var arr = [];
        arr.push({
          awId: item.awId,
          sstatus: item.sstatus
        });
        restAPI.reCheck.delReCheck.save({}, {
            awId: item.awId
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '移除成功'
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
    /**
     * 显示--清除已完成运单--中的数据
     */
    function setOtherData(params) {
      angular.forEach(params, function (m, n) {
        if (addItems.indexOf(m.id) < 0) {
          addItems.push(m.id);
          if (m.goods_class) {
            angular.forEach(vm.goodTypeData, function (v, k) {
              if (v.id === m.goods_class) {
                m.goods_class = v;
              }
            });
            for (var index = 0; index < vm.seizureData.length; index++) {
              var element = vm.seizureData[index];
              if (m.warehouse === element.id) {
                m.seizure = element;
                break;
              }
            }
            var dgoodsflagIds = m.dgoodsflag && m.dgoodsflag.split(',');
            m.danger = [];
            angular.forEach(dgoodsflagIds, function (v, k) {
              for (var index = 0; index < vm.dangerData.length; index++) {
                var element = vm.dangerData[index];
                if (v === element.id) {
                  m.danger.push(element);
                  break;
                }
              }
            });
          }
          if (m.id) {
            vm.checkData.push(m);
          }
        }
      });
    }
    /**
     * 待复检列表
     */
    function list() {
      $state.go('securityItem.reCheckList');
    }
    /**
     * 保存
     */
    function save() {
      var obj = getSaveData();
      $rootScope.loading = true;
      restAPI.reCheck.saveRecheck.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.no === 0) {
            Notification.success({
              message: resp.msg
            });
            searchList();
          } else {
            Notification.error({
              message: resp.fasleNo || resp.msg
            });
          }
        });
    }
    /**
     * 保存数据
     */
    function getSaveData() {
      var data = [];
      angular.forEach(vm.checkData, function (v, k) {
        var danger = [];
        angular.forEach(v.danger, function (m, n) {
          danger.push(m.id);
        });
        data.push({
          awId: v.awId,
          goodsclass: v.goods_class ? v.goods_class.id : '',
          distressPlace: v.distressPlace || '',
          warehouse: v.seizure ? v.seizure.id : '',
          dgoodsflag: danger.join(','),
          sstatus: v.sstatus,
          remark: v.remark
        });
      });
      return data;
    }
    /**
     * 扣押原因
     */
    function refuse(param) {
      if (param.sstatus === '0') {
        refuseNo(param);
      } else {
        refuseYes(param);
      }
    }
    /**
     * 首检状态check
     */
    function checkFstatus(data) {
      if (vm.checkObj.fstatus.indexOf(data) > -1) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 取消扣押
     */
    function refuseNo(param) {
      var cleDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '取消扣押',
              content: '你将要取消扣押。'
            };
          }
        }
      });
      cleDialog.result.then(function () {
        param.sstatus = '3';
        param.seizure = '';
        param.distressPlace = '';
        param.danger = '';
      }, function () {

      });
    }
    /**
     * 扣押
     */
    function refuseYes(param) {
      var refuseDialog = $modal.open({
        template: require('./reason.html'),
        controller: require('./reason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '未通过原因列表',
              type: '0',
              fStatus: param.fstatus,
              sStatus: param.sstatus,
              billNo: param.waybill_no,
              reasonData: vm.reasonData,
              seizureData: vm.seizureData,
              dangerData: vm.dangerData
            };
          }
        }
      });
      refuseDialog.result.then(function (data) {
        param.sstatus = '0';
        param.seizure = data.seizure;
        param.distressPlace = data.distressPlace;
        param.danger = data.danger;
        param.remark = JSON.stringify(data.remarkData);
        param.sremark.push({
          createtime: Date.now(),
          remark: JSON.stringify(data.remarkData)
        });
      }, function (resp) {

      });
    }
    /**
     * 通过原因
     */
    function pass(param) {
      if (param.sstatus === '1') {
        passNo(param);
      } else {
        if (param.fstatus === '0' || param.sstatus === '0') {
          passYesWithReason(param);
        } else {
          passYes(param);
        }
      }
    }

    /**
     * 通过需要填原因
     */
    function passYesWithReason(param) {
      var passDialog = $modal.open({
        template: require('./reason.html'),
        controller: require('./reason.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '通过原因列表',
              type: '1',
              fStatus: param.fstatus,
              sStatus: param.sstatus,
              billNo: param.waybill_no,
              reasonData: vm.reasonData,
              seizureData: vm.seizureData,
              dangerData: vm.dangerData
            };
          }
        }
      });
      passDialog.result.then(function (data) {
        param.sstatus = '1';
        param.seizure = '';
        param.danger = '';
        param.remark = JSON.stringify(data.remarkData);
        param.sremark.push({
          createtime: Date.now(),
          remark: JSON.stringify(data.remarkData)
        });
      }, function (resp) {

      });
    }
    /**
     * 通过不需要填原因
     */
    function passYes(param) {
      var passDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '通过',
              content: '你将要通过运单' + param.waybill_no + '的复检。'
            };
          }
        }
      });
      passDialog.result.then(function (data) {
        param.sstatus = '1';
        param.seizure = '';
        param.danger = '';
      }, function (resp) {

      });
    }
    /**
     * 取消通过
     */
    function passNo(param) {
      var cleDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '取消通过',
              content: '你将要取消通过。'
            };
          }
        }
      });
      cleDialog.result.then(function () {
        param.sstatus = '3';
        param.distressPlace = '';
      }, function () {

      });
    }
    /**
     * 备注
     *
     * @param {any} param
     */
    function showRemark(param) {
      var remarkDialog = $modal.open({
        template: require('./remarkDialog.html'),
        controller: require('./remarkDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              awId: param.awId,
              isAll: '1'
            };
          }
        }
      });
      remarkDialog.result.then(function () {

      }, function (data) {
        param.count_remark = data + "";
      });
    }
    /**
     * 原因
     *
     * @param {any} param
     */
    function showReason(param) {
      var remarkDialog = $modal.open({
        template: require('./reasonDialog.html'),
        controller: require('./reasonDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              reasonData: param.sremark,
              waybill_no: param.waybill_no
            };
          }
        }
      });
    }
    /**
     * 显示pdf
     */
    function showPdfDialog(params, goodsDesc, item) {
      $rootScope.loading = true;
      restAPI.reCheck.getBookPDF.save({}, {
          bookId: params.bookId || params.id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.msg === 'ok') {
            var srcArr = [];
            angular.forEach(resp.data, function (m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                m.src = m.fileHttpPath;
              } else {
                srcArr.push(m.fileHttpPath);
              }
            });
            vm.selectedAwid  = item.awId;
            openDialog({
              officeName: params.officeName,
              bookNo: params.bookNo,
              goodsDesc: goodsDesc,
              srcArr: srcArr,
              waybill_no : item.waybill_no
            });
          } else {
            Notification.error({
              message: '获取证书数据失败'
            });
          }
        });
    }
      
    function tr_mouseenter(item) {
      if(vm.selectedAwid) {
        if(vm.selectedAwid  !== item.awId) {
          delete vm.selectedAwid;
        }
      }
    }

    function tr_mouseleave(item) {
    }
    /**
     *
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

module.exports = angular.module('app.securityItem.reCheck', []).controller('reCheckCtrl', reCheck_fn);