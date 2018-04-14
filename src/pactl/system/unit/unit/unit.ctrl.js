'use strict';

var unit_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.edit = edit;
    vm.unitObj = {};
    vm.unitData = [];
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.reset = reset;
    vm.search = search;
    vm.typeData = [];
    vm.disableUnit = disableUnit;
    vm.enableUnit = enableUnit;

    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getType();
    }
    /**
     * 获取类型
     */
    function getType() {
      $rootScope.loading = true;
      restAPI.ddic.pcode.query({
          pcode: 'PACTL_UNIT_TYPE'
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = true;
          vm.typeData = resp;
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getUnitData();
    }
    /**
     * 获取机构数据
     */
    function getUnitData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.unit.pageUnits.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.unitData = resp.data;

          angular.forEach(vm.unitData, function (v, k) {
            //处理角色
            v.roleText = ''
            if(v.unitRoleAddDO && v.unitRoleAddDO.length>0) {
              angular.forEach(v.unitRoleAddDO, function (m, n) {
                if(n%3===0) {
                  //v.roleText += "<br>";
                }
                v.roleText += '<span class="label label-info mr5" style="font-weight: 500;font-size: 15px;margin: 5px;padding: 5px;display: inline-block;">'+m.role.name+'</span>';
              });
            }
          });

          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        length: vm.page.length,
        start: vm.page.start,
        rule: []
      };
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      angular.forEach(vm.unitObj, function (v, k) {
        if (v) {
          obj.rule.push([{
            key: k,
            op: k === 'unitType' ? '=' : 'like',
            value: v.code || v
          }]);
        }
      });
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 新增
     */
    function add() {
      var addUnitDialog = $modal.open({
        template: require('./addUnit.html'),
        controller: require('./addUnit.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增机构',
              typeData: vm.typeData,
              obj: {
                isvalid: '1'
              }
            };
          }
        }
      });
      addUnitDialog.result.then(function (data) {
        // $rootScope.loading = true;
        // var obj = getAddData(data);
        // restAPI.unit.units.save({}, obj)
        //   .$promise.then(function (resp) {
        //     if(resp && resp.status===9999) {
        //       $rootScope.loading = false;
        //       Notification.error({
        //         message: resp.msg
        //       });
        //     } else {
              search();
          //     Notification.success({
          //       message: '添加机构成功'
          //     });
          //   }
          // });
      }, function (resp) {

      });
    }
    /**
     * 获取新增的数据
     * 
     */
    function getAddData(data) {
      var obj = {};
      obj.avatar = data.fileObj && data.fileObj.id;
      obj.code = data.code;
      obj.name = data.name;
      obj.ename = data.ename;
      obj.aliase = data.aliase;
      obj.unitType = data.unitType.code;
      obj.plan = [];
      angular.forEach(data.plan, function (v, k) {
        obj.plan.push(v.id)
      });
      obj.plan = obj.plan.join(',');
      obj.role = [];
      angular.forEach(data.role, function (v, k) {
        obj.role.push(v.id)
      });
      obj.role = obj.role.join(',');
      obj.description = data.description;
      obj.sort = data.sort;
      obj.isvalid = data.isvalid;
      return obj;
    }
    /**
     * 编辑
     */
    function edit(param) {
      var editUnitDialog = $modal.open({
        template: require('./addUnit.html'),
        controller: require('./addUnit.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑机构',
              typeData: vm.typeData,
              obj: param
            };
          }
        }
      });
      editUnitDialog.result.then(function (data) {
        // $rootScope.loading = true;
        // var obj = getAddData(data);
        // restAPI.unit.editUnit.put({
        //     id: param.id
        //   }, obj)
        //   .$promise.then(function (resp) {
        //     if(resp && resp.status===9999) {
        //       $rootScope.loading = false;
        //       Notification.error({
        //         message: resp.msg
        //       });
        //     } else {
              search();
          //     Notification.success({
          //       message: '编辑机构成功'
          //     });
          //   }
          // });
      }, function (resp) {

      });
    }
    /**
     * 删除
     * 
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除机构：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.unit.editUnit.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '删除机构成功'
              });
            }
          });
      }, function () {

      });
    }

    function disableUnit(item) {
      var name = item.name || item.code;
       var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '禁用：' + name,
              content: '你将要禁用机构：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        var obj = {};
        obj.isvalid = "0";
        restAPI.operAgent.disabledUnit.save({
            id: item.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '禁用机构成功'
              });
            }
          });
      });
    }

    function enableUnit(item) {
      var name = item.name || item.code;
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '启用：' + name,
              content: '你将要启用机构：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        var obj = {};
        obj.isvalid = "1";
        restAPI.operAgent.disabledUnit.save({
            id: item.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '启用机构成功'
              });
            }
          });
      });
    }
    /**
     * 重置
     */
    function reset() {
      vm.unitObj = {};
      search();
    }
  }
];

module.exports = angular.module('app.unit.unit', []).controller('unitCtrl', unit_fn);