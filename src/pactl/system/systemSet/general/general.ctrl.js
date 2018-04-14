'use strict';

var general_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.general = {
      data1: {},
      data2: {},
      data3: {},
      data4: {},
      data5: {}
    };
    vm.save = save;
    search();

    vm.codeData = [{
      "name": "否",
      "id": "0"
    }, {
      "name": "是",
      "id": "1"
    }]

    /**
     * 通用查询
     */
    function search() {
      $rootScope.loading = true;
      restAPI.systemSet.queryList.save({}, $.param({
        regKeySeq: "SYSYEM_SETTINGS_COMMON"
      })).$promise.then(function (resp) {
        $rootScope.loading = false;
        if (resp.ok) {
          angular.forEach(resp.data, function (v, k) {
            if (v.regKey === 'systemTitle') {
              vm.general.data1 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'maxTryTime') {
              vm.general.data2 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'requiredCheck') {
              if (v.regVal) {
                if (v.regVal === '0') {
                  v.regVal = vm.codeData[0];
                } else if (v.regVal === '1') {
                  v.regVal = vm.codeData[1];
                }
              }
              vm.general.data3 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              }
            } else if (v.regKey === 'pageOption') {
              vm.general.data4 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            } else if (v.regKey === 'pageDefault') {
              vm.general.data5 = {
                regVal: v.regVal,
                regKey: v.regKey,
                id: v.id,
                valType: v.valType,
                unitId: v.unitId,
                parentId: v.parentId
              };
            }
          });
        } else {
          Notification.error({
            message: resp.msg
          });
        }
      });
    }

    function verification() {
      var defaultReg = new RegExp("^[0-9]*$");
      var optReg = new RegExp("^[0-9]{1,4}(,[0-9]{1,4}){0,}$");
      

      var pageOption = vm.general.data4.regVal;
      if(pageOption && !optReg.test(pageOption)) {
        return "分页选项格式不正确,正确格式如下 10,50,100,500 最大不要超过 1000";
      }
      if(pageOption) {
        //检查分页选项是否重复
        var pageOptions = pageOption.split(",");
        var optionsCount = {};
        for(var i=0;i<pageOptions.length;i++) {
          if(parseInt(pageOptions[i])>1000) {
            return "分页选项最大不能超过 1000";
          }
          var count = 1;
          if(optionsCount[pageOptions[i]]) {
            count = optionsCount[pageOptions[i]]+1;
          } 
          optionsCount[pageOptions[i]] = count;
        }
        var str = "";
        for(var v in optionsCount) {
          if(optionsCount[v]>1) {
            if(str.length>0) {
              str += ","
            }
            str += v;
          }
        }
        if(str.length>0) {
          return "分页选项中以下选项重复："+str;
        }
        var pageDefault = vm.general.data5.regVal;
        if(pageDefault) {
          if(!defaultReg.test(pageDefault)) {
            return "默认每页数量格式不正确,请填写数字,并且是在分页选项中存在的";
          }
          if((","+pageOptions+",").indexOf(","+pageDefault+",")<0) {
            return "默认每页数量在分页选项中不存在";
          }
        }
      }
    }

    /**
     *  update保存
     */
    function save() {
      var error = verification();
      if(error) {
        Notification.error({
          message: error
        });
        return false;
      }
      var data = [],
        obj1 = angular.copy(vm.general.data1),
        obj2 = angular.copy(vm.general.data2),
        obj3 = angular.copy(vm.general.data3),
        obj4 = angular.copy(vm.general.data4),
        obj5 = angular.copy(vm.general.data5);
      data.push(obj1);
      data.push(obj2);
      obj3.regVal && (obj3.regVal = obj3.regVal.id);
      data.push(obj3);
      data.push(obj4);
      data.push(obj5);
      $rootScope.loading = true;
      restAPI.systemSet.updateList.save({}, data)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '更新成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
  }
];

module.exports = angular.module('app.systemSet.general', []).controller('generalCtrl', general_fn);