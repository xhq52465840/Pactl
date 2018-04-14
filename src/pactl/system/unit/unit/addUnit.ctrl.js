'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope','$modal','Page','Notification',
  function ($scope, $modalInstance, items, restAPI, $rootScope,$modal,Page,Notification) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.cancel = cancel;
    vm.planData = [];
    vm.save = save;
    vm.title = obj.title;
    vm.typeData = obj.typeData;
    vm.uploadCallback = uploadCallback;
    vm.tabType = "base";
    vm.unitObj = {
      isvalid: '1'
    };
    vm.unitObj.file = {};
    vm.unitObj.fileObj = {};
    vm.select = select;
    vm.unitEnData = [];
    vm.add = add;
    vm.edit = edit;
    vm.remove = remove;
    vm.showItem = {
			start: 0,
			end: 0
		};
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();
    vm.changeText = changeText;

    /**
     * 只能输入大写和特殊字符
     */
    function changeText(text) {
      try {
        vm.unitObj[text] = vm.unitObj[text].replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, '').toUpperCase();
      } catch (error) {
        return;
      }
    }

    getPlan();

    /**
     * 获取权限方案
     */
    function getPlan() {
      $rootScope.loading = true;
      restAPI.permissionscheme.permissionschemes.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.planData = resp;
          getRoleData();
        });
    }
    /**
     * 获取角色数据
     */
    function getRoleData() {
      $rootScope.loading = true;
      restAPI.role.roles.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.roleData = resp;
          setData();
        });
    }
    /**
     * 显示数据
     */
    function setData() {
      if (obj.obj.id) {
        vm.isedit = true;
        vm.unitObj.code = obj.obj.code;
        vm.unitObj.name = obj.obj.name;
        vm.unitObj.ename = obj.obj.ename;
        vm.unitObj.aliase = obj.obj.aliase;
        vm.unitObj.id = obj.obj.id;
        if (obj.obj.unitType) {
          for (var index = 0; index < vm.typeData.length; index++) {
            var element = vm.typeData[index];
            if (obj.obj.unitType === element.code) {
              vm.unitObj.unitType = element;
            }
          }
        }
        if (obj.obj.unitSchemeDO.length) {
          vm.unitObj.plan = [];
          var plan = [];
          angular.forEach(obj.obj.unitSchemeDO, function (v, k) {
            plan.push(v.pScheme.id);
          });
          angular.forEach(vm.planData, function (v, k) {
            if (plan.indexOf(v.id) > -1) {
              vm.unitObj.plan.push(v);
            }
          });
        }
        if (obj.obj.unitRoleAddDO.length) {
          vm.unitObj.role = [];
          var role = [];
          angular.forEach(obj.obj.unitRoleAddDO, function (v, k) {
            role.push(v.role.id);
          });
          angular.forEach(vm.roleData, function (v, k) {
            if (role.indexOf(v.id) > -1) {
              vm.unitObj.role.push(v);
            }
          });
        }
        vm.unitObj.description = obj.obj.description;
        vm.unitObj.sort = obj.obj.sort;
        vm.unitObj.isvalid = obj.obj.isvalid?"1":"0";
        if (obj.obj.avatar) {
          vm.unitObj.fileObj = {
            id: obj.obj.avatar,
            url: obj.obj.avatarUrl
          };
        }
        if (obj.obj.unitSchemeDO.length) {
          vm.unitObj.plan = [];
          var plan = [];
          angular.forEach(obj.obj.unitSchemeDO, function (v, k) {
            plan.push(v.pScheme.id);
          });
          angular.forEach(vm.planData, function (v, k) {
            if (plan.indexOf(v.id) > -1) {
              vm.unitObj.plan.push(v);
            }
          });
        }
        showUnitEnData();
      }else{
        vm.isedit = false;
        var salesAgentIndex = -1;
        for (var index = 0; index < vm.typeData.length; index++) {
          var element = vm.typeData[index];
          if ("salesAgent" === element.code) {
            salesAgentIndex = index;
          }
        }
        if(salesAgentIndex >= 0) {
          vm.typeData.splice(salesAgentIndex,1);
        }
      }
    }
    /**
     * 选择
     */
    function select(type) {
      vm.tabType = type;
    }
    /**
     * 保存
     */
    function save() {
      if(!vm.unitObj.unitType || !vm.unitObj.unitType.code) {
        Notification.error({
          message: "请填写类别"
        });
        return;
      } 
      if(vm.isedit) {
        $rootScope.loading = true;
        var obj = getAddData(vm.unitObj);
        restAPI.unit.editUnit.put({
            id: vm.unitObj.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              Notification.success({
                message: '编辑机构成功'
              });
              $modalInstance.close(vm.unitObj);
            }
          });
      } else {
        $rootScope.loading = true;
        var obj = getAddData(vm.unitObj);
        restAPI.unit.units.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              Notification.success({
                message: '添加机构成功'
              });
              $modalInstance.close(vm.unitObj);
            }
          });
      }
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
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function showUnitEnData() {
      $rootScope.loading = true;
      restAPI.unit.listEname.query({unitId:vm.unitObj.id},{})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp.length && resp.length>0) {
            vm.unitEnData = resp;
            var resp = {
              rows: vm.unitEnData,
              total: vm.unitEnData.length
            };
            vm.showItem = {
              start: (vm.page.currentPage - 1) * vm.page.length - 1,
              end: vm.page.currentPage * vm.page.length
            };
            Page.setPage(vm.page, resp);
          }
      });
    }
    /**
		 * 翻页
		 */
		function pageChanged() {
			Page.pageChanged(vm.page, showUnitEnData);
		}
    function add() {
      var addUnitDialog = $modal.open({
        template: require('./addUnitEn.html'),
        controller: require('./addUnitEn.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增机构英文名称',
              obj: {}
            };
          }
        }
      });
      addUnitDialog.result.then(function (data) {
        // vm.unitEnData.push({
        //   ename:data.ename,
        // });
        $rootScope.loading = true;
        var obj = {};
        obj.ename = data.ename;
        obj.unitId = vm.unitObj.id;
        restAPI.unit.addEname.save({}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              showUnitEnData();
              Notification.success({
                message: '添加机构英文名称成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    function edit(item) {
      var addUnitDialog = $modal.open({
        template: require('./addUnitEn.html'),
        controller: require('./addUnitEn.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '修改机构英文名称',
              obj: item
            };
          }
        }
      });
      addUnitDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.ename = data.ename;
        obj.unitId = vm.unitObj.id;
        restAPI.unit.editEname.put({ id: item.id}, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              showUnitEnData();
              Notification.success({
                message: '修改机构英文名称成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    function remove(item,index) {
      var name = item.ename;
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
              content: '你将要删除英文名称：' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        var obj = {};
        obj.unitId = vm.unitObj.id;
        restAPI.unit.editEname.remove({
            id: item.id
          }, obj)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              showUnitEnData();
              Notification.success({
                message: '删除机构英文名称成功'
              });
            }
          });
      });
    }
    /**
     * 上传图片
     * 
     * @param {any} params 
     */
    function uploadCallback(res, param) {
      var file = res;
      vm.unitObj.fileObj = {
        id: file.avatarId,
        url: file.httpUrl
      };
    }    
  }
];