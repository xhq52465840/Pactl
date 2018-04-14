'use strict';

module.exports = ['$scope', '$modalInstance', '$modal', 'restAPI', 'items', 'Notification',
  function ($scope, $modalInstance, $modal, restAPI, items, Notification) {
    var vm = $scope;
    vm.addUN = addUN;
    vm.afterClick = false;
    vm.save2ButtonClick = true;
    vm.cancel = cancel;
    vm.checkName = checkName;
    vm.changeNum = changeNum;
    vm.disableTag = disableTag;
    vm.passTag = passTag;
    vm.passTagChanged = false;
    vm.oldPassTag1 = '0'; //首检的变化
    vm.oldPassTag2 = []; //复检的变化
    vm.newItems = [];
    // vm.noPass = noPass;
    vm.loading = false;
    vm.localeCheck = [];
    vm.title = items.title;
    vm.btnName = items.btnName;
    vm.inspect = angular.copy(items.obj);
    vm.inspect.type = '1';
    vm.removeItem = removeItem;
    vm.save1 = save1;
    vm.save2 = save2;
    vm.selectTab = selectTab;
    vm.type1 = false;
    vm.type2 = false;
    vm.tabChange = tabChange;
    vm.setTableChange1 = setTableChange1;
    vm.selcetName = selcetName;
    vm.setFltCheckFlag = setFltCheckFlag;
    vm.editable2 = editable2;
    vm.editable1 = editable1;
    var selected = [];
    var selectedItem = [];

    search();

    /**
     * UNDatas
     */
    vm.UNDatas = vm.inspect.selectData;

    function upload(data) {
      var callback = function (resp) {
        data.file = '';
        if (resp.data && resp.data.data) {
          data.fileObj = {
            id: resp.data.data.fileId,
            name: resp.data.data.oldName,
            newName: resp.data.data.oldName.substring(0, 10) + (resp.data.data.oldName.length > 10 ? '...' : '')
          };
        }
      };
      if (data.file) {
        _upload._upload(data.file, callback, restAPI.file.uploadFile);
      }
    }
    /**
     *  查询
     */
    function search() {
      vm.loading = true;
      restAPI.preJudice.queryCommon.save({}, vm.inspect.awId)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            editable1();
            editable2();
            vm.oldPassTag2 = []; //复检的变化
            vm.newItems = [];
            vm.localeCheck = resp.data.localeCheck;
            // angular.forEach(resp.data.localeCheck || [], function(v, k) {
            //   vm.localeCheck.push({
            //     checkId: v.checkId,
            //     checkName: v.checkName,
            //     checkFlag: v.checkFlag === 'true' ? true : false
            //   });
            // });
            vm.inspect.fltCheckFlag = resp.data.fltCheckFlag;
            vm.inspect.fltCheckFlag1 = vm.inspect.fltCheckFlag === '1';
            vm.inspect.fltCheckFlag2 = vm.inspect.fltCheckFlag === '2';
            vm.inspect.passFlag = resp.data.passFlag === null ? '0' : resp.data.passFlag;
            vm.oldPassTag1 = vm.inspect.passFlag;
            vm.inspect.checkBean = resp.data.checkBean || [];
            angular.forEach(vm.inspect.checkBean, function (v, k) {
              if (k === 0) {
                vm.inspect.newItems = [];
              }
              var dgrClass = [];
              v.dgrClass && angular.forEach(v.dgrClass.split(";"), function (v, k) {
                angular.forEach(vm.UNDatas, function (m, n) {
                  if (v === m.name) {
                    dgrClass.push(m);
                  }
                });
              });
              vm.inspect.newItems.push({
                awId: vm.inspect.awId,
                createdDate: v.createdDate ? v.createdDate : '',
                fltCheckFlag: v.fltCheckFlag,
                id: v.id ? v.id : '',
                unNumber: v.unNumber,
                dgrClass: dgrClass ? dgrClass : '',
                dgrId: vm.inspect.dgrId ? vm.inspect.dgrId.name : ''
              })
            });
            vm.inspect.dgrId = '';
            angular.forEach(vm.inspect.selectID, function (v, k) {
              if (v.name === resp.data.dgrId) {
                vm.inspect.dgrId = v;
              }
            });
            // vm.inspect.idChecked = resp.data.dgrId ? true : false;
            vm.inspect.comment = resp.data.comment || '';
            vm.inspect.recheckBean = [];
            angular.forEach(resp.data.recheckBean || [], function (v, k) {
              if (k === 0) {
                vm.newItems = [];
              }
              vm.inspect.recheckBean.push({
                awId: vm.inspect.awId,
                checkFlag: (v.effectFlag === '1') ? 'true' : 'false',
                checkId: v.checkId ? v.checkId : '',
                checkName: v.checkName ? v.checkName : '',
                createdDate: v.createdDate ? v.createdDate : null,
                effectFlag: v.effectFlag ? v.effectFlag : '', //查询出来的值
                oldEffectFlag: v.effectFlag ? v.effectFlag : '', // 对查询的值进行备份，用于比较
                id: v.id ? v.id : '',
                operator: v.operator
              });
            });
            vm.inspect.preMask = items.obj.preMask;
            vm.checkVersion = resp.data.checkVersion;
            vm.recheckVersion = resp.data.recheckVersion;
            vm.type1 = false;
            vm.type2 = false;
          }
        });
    }
    // 1.预审通过后，安检开始前，PACTL可以修改。安检开始后不能修改。
    // 安检通过后，PACTL可以修改。 以及已提交时都可以修改
    // 3.其他内容只有在已提交没有结论时才能改
    function editable1() {
      if (vm.inspect.wStatus === '100' || (vm.inspect.wStatus === '101' && (vm.inspect.aStatus === '210' || vm.inspect.aStatus === '211')) || vm.inspect.aStatus === '201') {
        return true;
      } else {
        return false;
      }
    }

    function editable2() {
      if (vm.inspect.wStatus === '100') {
        return false;
      } else {
        return true;
      }
    }

    function setFltCheckFlag(value) {
      if (value === '1') {
        if (vm.inspect.fltCheckFlag1 === true) {
          vm.inspect.fltCheckFlag2 = false;
        }
      }
      if (value === '2') {
        if (vm.inspect.fltCheckFlag2 === true) {
          vm.inspect.fltCheckFlag1 = false;
        }
      }
      setTableChange1();
    }
    /**
     * 检查需要保存的数据
     */
    function getData1() {
      var obj = {};
      obj.comment = vm.inspect.comment;
      obj.awId = vm.inspect.awId;
      obj.dgrId = vm.inspect.dgrId ? vm.inspect.dgrId.name : '';
      if (vm.inspect.fltCheckFlag1) {
        vm.inspect.fltCheckFlag = '1';
      } else if (vm.inspect.fltCheckFlag2) {
        vm.inspect.fltCheckFlag = '2';
      } else {
        vm.inspect.fltCheckFlag = '0';
      }
      obj.fltCheckFlag = vm.inspect.fltCheckFlag;
      obj.passFlag = vm.inspect.passFlag; //通过标记
      obj.checkVersion = vm.checkVersion;
      obj.localeCheck = [];
      angular.forEach(vm.localeCheck, function (v, k) {
        obj.localeCheck.push({
          checkId: v.checkId,
          checkName: v.checkName,
          checkFlag: v.checkFlag ? 'true' : 'false'
        });
      });
      obj.checkBean = [];
      angular.forEach(vm.inspect.newItems, function (v, k) {
        var dgrClass = [];
        angular.forEach(v.dgrClass || [], function (m, n) {
          dgrClass.push(m.name);
        });
        obj.checkBean.push({
          awId: vm.inspect.awId,
          createdDate: v.createdDate ? v.createdDate : null,
          id: v.id ? v.id : '',
          unNumber: v.unNumber,
          dgrClass: dgrClass.join(';'),
          dgrId: vm.inspect.dgrId ? vm.inspect.dgrId.name : ''
        });
      });
      obj.version = vm.version;
      return obj;
    }
    /**
     * 复检需要保存的数据
     */
    function getData2() {
      var obj = {};
      obj.awId = vm.inspect.awId;
      obj.recheckVersion = vm.recheckVersion;
      obj.recheckBean = [];
      angular.forEach(vm.inspect.recheckBean, function (v, k) {
        obj.recheckBean.push({
          awId: vm.inspect.awId,
          checkFlag: (v.effectFlag === '1') ? 'true' : 'false',
          checkId: v.checkId ? v.checkId : '',
          checkName: v.checkName ? v.checkName : '',
          createdDate: v.createdDate ? v.createdDate : null,
          effectFlag: v.effectFlag ? v.effectFlag : '',
          id: v.id ? v.id : '',
          operator: v.operator
        });
      });
      return obj;
    }
    /**
     * 检查要保存的数据
     */
    function checkData1(obj) {
      var error = '';
      //如果是航空公司做检查，不控制UN必录
      if (obj.fltCheckFlag === '1' || obj.fltCheckFlag === '2') {
        return error;
      }
      //检查是否有危险品
      var hasDanger = false;
      angular.forEach(obj.localeCheck, function (v, k) {
        if (v.checkId === '102' && v.checkFlag === 'true') {
          hasDanger = true;
        }
      });
      //检查是否有干冰
      var hasDryice = false;
      angular.forEach(obj.localeCheck, function (v, k) {
        if (v.checkId === '105' && v.checkFlag === 'true') {
          hasDryice = true;
        }
      });
      //检查是否有UN
      var hasUn = false;
      angular.forEach(obj.checkBean, function (v, k) {
        if (v.unNumber && v.unNumber !== '') {
          hasUn = true;
        }
        if (v.unNumber && v.unNumber.length !== 4) {
          error = error + "UN " + v.unNumber + " 不正确,必须是4位数字;";
        } else if (v.unNumber && v.unNumber !== '' && (!v.dgrClass || v.dgrClass === '')) {
          error = error + "请填写 UN 为 " + v.unNumber + " 的危险品分类;";
        }
      });
      if (hasDanger && !hasUn && (!obj.dgrId || obj.dgrId === '')) {
        error = "非航空公司现场检查危险品请至少填写 UN 或者 ID";
        return error;
      }
      if (hasDryice && !hasUn) {
        error = "非航空公司现场检查干冰请至少填写 UN";
        return error;
      }
      return error;
    }
    /**
     * 检查
     */
    function selcetName(data) {
      data.checkFlag = !data.checkFlag;
      if (data.checked) {
        selected.push(data.checkId);
        selectedItem.push({
          checkId: data.checkId,
          checkName: data.checkName,
          checkFlag: data.checkFlag
        });
      } else {
        var index = selected.indexOf(data.checkId);
        selected.splice(index, 1);
        selectedItem.splice(index, 1);
      }
    }
    /**
     * 检查 保存
     */
    function save1(obj) {
      var obj = getData1();
      var error = checkData1(obj);
      if (error && error !== '') {
        Notification.error({
          message: error
        });
        return;
      }
      vm.loading = true;
      restAPI.preJudice.saveCommon.save({}, obj)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '现场检查成功'
            });
            vm.oldPassTag1 = obj.passFlag;
            vm.passTagChanged = false;
            vm.type1 = false;
            vm.checkVersion = resp.data.checkVersion;
            $modalInstance.close();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 复检 保存
     */
    function save2(obj) {
      var obj = getData2();
      vm.loading = true;
      restAPI.preJudice.saveRechec.save({}, obj)
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            Notification.success({
              message: 'RE-check成功'
            });
            vm.afterClick = false;
            vm.save2ButtonClick = true;
            vm.type2 = false;
            vm.recheckVersion = resp.data.recheckVersion;
            search();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 不通过
     */
    function noPass() {
      var noDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '此条数据将不通过',
              content: '你将要不通过此条数据' + '?'
            };
          }
        }
      });
      noDialog.result.then(function () {
        restAPI.preJudice.noPass.save({}, {
          awId: vm.inspect.awId,
          fileId: vm.inspect.fileObj ? vm.inspect.fileObj.id : '',
          comment: vm.inspect.comment
        }).$promise.then(function (resp) {
          if (resp.ok) {
            Notification.success({
              message: '不通过成功'
            });
            vm.afterenabled = true;
            vm.afterforbid = false;
            searchGoodId();
          } else {
            Notification.error({
              message: resp.msg
            });
          }
          $modalInstance.close();
        });
      })
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     *  新增UN
     */
    function addUN() {
      if (!vm.inspect.newItems) {
        vm.inspect.newItems = [];
      }
      vm.inspect.newItems.push({
        unNumber: '',
        dgrClass: ''
      });
      vm.type1 = true;
    }
    /**
     * 移除UN
     */
    function removeItem(index) {
      vm.inspect.newItems.splice(index, 1);
      vm.type1 = true;
    }
    /**
     * re-checked,点击按钮添加新项目
     */
    function checkName(params) {
      vm.loading = true;
      restAPI.preJudice.checkName.save({}, {})
        .$promise.then(function (resp) {
          vm.loading = false;
          if (resp.ok) {
            //params.checkFlag = !params.checkFlag;
            vm.inspect.recheckBean.push({
              checkFlag: (params.effectFlag === '1') ? 'true' : 'false',
              checkId: params.checkId ? params.checkId : '',
              checkName: params.checkName ? params.checkName : '',
              createdDate: resp.data.nowtime,
              effectFlag: '1',
              id: params.id ? params.id : '',
              operator: resp.data.username
            });
            vm.afterClick = true;
            vm.save2ButtonClick = false;
            if (vm.oldPassTag2 !== vm.inspect.passFlag2) {
              vm.passTagChanged = true;
              vm.type2 = true;
            } else {
              vm.passTagChanged = false;
              vm.type2 = false;
            }
          }
        });
    }
    /**
     * 失效操作
     *
     * @param {any} params
     */
    function disableTag(params, type) {
      if (editable2()) {
        return;
      }
      params.effectFlag = type;
      var index = vm.oldPassTag2.indexOf(params.id);
      if (params.hasOwnProperty('oldEffectFlag')) {
        if (params.oldEffectFlag === params.effectFlag) {
          if (index > -1) {
            vm.oldPassTag2.splice(index, 1);
          }
        } else {
          if (index < 0) {
            vm.oldPassTag2.push(index);
          }
        }
      }
      vm.type2 = true;
      vm.save2ButtonClick = false;
    }
    /**
     * 通过标记操作
     *
     * @param {any} inspect
     */
    function passTag(type) {
      if (editable2()) {
        return;
      }
      vm.inspect.passFlag = type;
      if (vm.oldPassTag1 !== vm.inspect.passFlag1) {
        vm.passTagChanged = true;
        vm.type1 = true;
      } else {
        vm.passTagChanged = false;
        vm.type1 = false;
      }
    }
    /**
     * 切换tab
     *
     */
    function selectTab(type) {
      vm.inspect.type = type;
    }
    /**
     * 只能输入数字
     *
     * @param {any} text
     */
    function changeNum(param) {
      try {
        param.unNumber = param.unNumber.replace(/[^0-9]/g, '');
        setTableChange1();
      } catch (error) {
        return;
      }
    }

    function tabChange(param) {
      if (param === '1') {
        Notification.error({
          message: '检查页面的数据发生变化，请保存后切换到复检页面.'
        });
      } else if (param === '2') {
        Notification.error({
          message: '复检页面的数据发生变化，请保存后切换到检查页面.'
        });
      };
    }

    function setTableChange1() {
      vm.type1 = true;
    }
  }
];