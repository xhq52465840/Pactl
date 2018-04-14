'use strict';

var jsSHA = require('../../../../lib/sha1/sha1.js');

var user_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', '$stateParams',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, $stateParams) {
    var vm = $scope;
    vm.add = add;
    vm.agentData = [];
    vm.disable = disable;
    vm.enable = enable;
    vm.edit = edit;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.reset = reset;
    vm.search = search;
    vm.userObj = {};
    vm.userData = [];
    vm.modify = modify;
    vm.historys = historys;
    vm.superModify = superModify;
    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getUserGroup();
    }
    /**
     * 查询
     */
    function search() {
      getUserData();
    }
    /**
     * 获取用户数据
     */
    function getUserData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.user.pageUsers.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.userData = resp.data || [];
          angular.forEach(vm.userData, function (v, k) {
            var agData = vm.agentData,
              len = agData.length;
              for (var index = 0; index < len; index++) {
                if (agData[index].id == v.dept) {
                  v.dept = agData[index];
                  v.deptName = agData[index].name;
                  v.unitType = agData[index].unitType;
                  break;
                }
              }
              for (var index = 0; index < v.userProperties.length; index++) {
                var element = v.userProperties[index];
                if(v.unitType === 'security') {
                  if (element.propName === 'unitcode') {
                    v.employid = element.propValue;
                  }
                  if(element.propName === 'unit') {
                    v.securityUnit = element.propValue;
                  }
                } else {
                  if (element.propName === 'employid') {
                    v.employid = element.propValue;
                  }
                }
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
        },
        userGroup = null;
      obj.columns = [{
        data: 't.lastUpdate'
      }];
      obj.order = [{
        column: 0,
        dir: 'desc'
      }];
      userGroup = $stateParams.userGroup;
      if ($stateParams.userGroup) {
        for (var index = 0; index < vm.userGroupData.length; index++) {
          var element = vm.userGroupData[index];
          if (element.id == userGroup) {
            vm.userObj.userGroup = element;
            break;
          }
        }
      }
      obj.rule.push([{
        key: 'type',
        op: '!=',
        value: 'salesAgent'
      }]);
      angular.forEach(vm.userObj, function (v, k) {
        if (v) {
          obj.rule.push([{
            key: k,
            op: (k === 'userGroup' || k === 'deptId') ? '=' : 'like',
            value: v.id || v
          }]);
        }
      });
      return obj;
    }
    /**
     * 重置
     */
    function reset() {
      vm.userObj = {};
      $stateParams.userGroup = '';
      search();
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
      var addUserDialog = $modal.open({
        template: require('./addUser.html'),
        controller: require('./addUser.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '新增用户',
              obj: {},
              userGroupData: vm.userGroupData,
              agentData: vm.agentData
            };
          }
        }
      });
      addUserDialog.result.then(function (data) {
        $rootScope.loading = true;
        var hashObj = new jsSHA('SHA-1', 'TEXT');
        var obj = {};
        hashObj.update(data.password);
        obj.account = data.account;
        obj.repeatPassword = hashObj.getHash('HEX');
        if (data.employid) {
          obj.userProperties = [];
          obj.userProperties.push({
            propValue: data.employid,
            propName: 'employid'
          });
          if(data.dept.unitType === 'security') {
            obj.userProperties.push({
              propValue: data.employid,
              propName: 'unitcode'
            });
          }
        }
        obj.fullname = data.fullname;
        obj.email = data.email;
        obj.expireDate = data.expireDate;
        obj.userGroups = [];
        if (data.userGroup && data.userGroup.length) {
          angular.forEach(data.userGroup, function (v, k) {
            obj.userGroups.push({
              id: v.id
            })
          });
        }
        obj.roles = [];
        if (data.roles && data.roles.length) {
          angular.forEach(data.roles, function (v, k) {
            obj.roles.push({
              id: v.id
            })
          });
        }
        obj.deptId = data.dept && data.dept.id;
        if (data.fileObj && data.fileObj.id) {
          obj.avatar = {
            fileName: data.fileObj.id,
            type: 'user'
          }
        }
        obj.ismanager = data.ismanager;
        var agentUser = {agentUser:obj};
        agentUser.isSuper = data.isSuper;
        restAPI.user.addusers.save({}, agentUser)
          .$promise.then(function (resp) {
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '添加用户成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 编辑
     */
    function edit(param) {
      var editUserDialog = $modal.open({
        template: require('./editUser.html'),
        controller: require('./editUser.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '编辑用户：' + param.fullname,
              obj: param,
              userGroupData: vm.userGroupData,
              agentData: vm.agentData
            };
          }
        }
      });
      editUserDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        obj.userProperties = [];
        obj.userProperties.push({
            propValue: data.employid,
            propName: 'employid'
        });
        if (data.employid) {
          if(data.unitType === 'security') {
            obj.userProperties.push({
              propValue: data.employid,
              propName: 'unitcode'
            });
          }
        }
        if (data.securityUnit) {
          obj.userProperties.push({
            propValue: data.securityUnit,
            propName: 'unit'
          });
        }
        if (obj.userProperties && obj.userProperties.length>0) {
          obj.userProperties = JSON.stringify(obj.userProperties);
        }
        obj.fullname = data.fullname;
        obj.email = data.email;
        obj.expireDate = data.expireDate;
        obj.userGroups = [];
        if (data.userGroup && data.userGroup.length) {
          angular.forEach(data.userGroup, function (v, k) {
            obj.userGroups.push({
              id: v.id
            })
          });
        }
        obj.userRoles = [];//roles
        if (data.roles && data.roles.length) {
          angular.forEach(data.roles, function (v, k) {
            obj.userRoles.push({
              id: v.id
            })
          });
        }
        obj.deptId = data.dept && data.dept.id;
        if (data.fileObj && data.fileObj.id) {
          /*obj.avatar = JSON.stringify({
            fileName: data.fileObj.id,
            type: 'user'
          })*/
          obj.avatar = data.fileObj.id
        }
        obj.ismanager = data.ismanager;
        obj.isSuper = data.isSuper;
        if(!data.ismanager){
          obj.isSuper = data.ismanager;
        }
        restAPI.user.editUser.put({
            id: param.id
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
                message: '编辑用户成功'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 获取用户组
     */
    function getUserGroup() {
      $rootScope.loading = true;
      restAPI.userGroup.usergroups.query({}, {})
        .$promise.then(function (resp) {
          vm.userGroupData = resp;
          getAgent();
        });
    }
    /**
     * 获取机构
     */
    function getAgent() {
      restAPI.unit.units.query({}, {})
        .$promise.then(function (resp) {
          angular.forEach(resp, function (v, k) {
            if (v.unitType != 'salesAgent') {
              vm.agentData.push(v);
            }
          });
          //vm.agentData = resp;
          search();
        });
    }
    /**
     * 无效
     */
    function disable(params) {
      var userEnable = $modal.open({
				template: require('./enable.html'),
				controller: require('./enable.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				// appendTo: angular.element('.head-location'),
				resolve: {
					items: function () {
						return {
							title: '禁用:'+ params.account,
							obj: {
								id: params.id
							}
						};
					}
				}
      });
    	userEnable.result.then(function (data) {
				$rootScope.loading = true;
        restAPI.user.ableUser.put({
          id: params.id,
          type: 'disable'
        }, data.content || ' ')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
          } else {
            delete params.status;
            search();
            Notification.success({
              message: '操作成功'
            });
          }
        });
			}, function () {

			});
     
    }
    // function disable(params) {
    //   restAPI.user.ableUser.put({
    //       id: params.id,
    //       type: 'disable'
    //     }, {})
    //     .$promise.then(function (resp) {
    //       if(resp && resp.status===9999) {
    //           $rootScope.loading = false;
    //           Notification.error({
    //             message: resp.msg
    //           });
    //       } else {
    //         delete params.status;
    //         Notification.success({
    //           message: '操作成功'
    //         });
    //       }
    //     });
    // }


    /**
		 * 退单
		 */
		// function back(param) {
		// 	var backDialog = $modal.open({
		// 		template: require('./others/backDialog.html'),
		// 		controller: require('./others/backDialog.ctrl.js'),
		// 		size: 'md',
		// 		backdrop: 'static',
		// 		keyboard: false,
		// 		// appendTo: angular.element('.head-location'),
		// 		resolve: {
		// 			items: function () {
		// 				return {
		// 					title: '退单',
		// 					obj: {
		// 						waybillNo: param.waybillNo
		// 					}
		// 				};
		// 			}
		// 		}
		// 	});
		// 	backDialog.result.then(function (data) {
		// 		$rootScope.loading = true;
		// 		restAPI.waybill.returnbill.save({}, {
		// 			awId: param.awId,
		// 			comment: data.content
		// 		}).$promise.then(function (resp) {
		// 			$rootScope.loading = false;
		// 			if (resp.ok) {
		// 				Notification.success({
		// 					message: '退单成功'
		// 				});
		// 				changeProgress();
		// 			} else {
		// 				Notification.error({
		// 					message: resp.msg
		// 				});
		// 			}
		// 		});
		// 	}, function () {

		// 	});
		// }
	
    /**
     * 有效
     */
    function enable(params) {
      var userEnable = $modal.open({
				template: require('./enable.html'),
				controller: require('./enable.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				// appendTo: angular.element('.head-location'),
				resolve: {
					items: function () {
						return {
							title: '启用:'+ params.account,
							obj: {
								id: params.id
							}
						};
					}
				}
      });
    	userEnable.result.then(function (data) {
				$rootScope.loading = true;
        restAPI.user.ableUser.put({
          id: params.id,
          type: 'enable'
        }, data.content || ' ')
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
          } else {
            params.status = '正常';
            search();
            Notification.success({
              message: '操作成功'
            });

          }
        });
			}, function () {

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
              content: '你将要删除用户' + name + '。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.user.delUser.remove({
            id: id
          }, {})
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if(resp && resp.status===9999) {
              $rootScope.loading = false;
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '删除用户成功'
              });
            }
          });
      }, function () {

      });
    }


    /**
     * 主账户超管密码修改
     */
    function superModify(param) {
      var addSuperSecurityDialog = $modal.open({
        template: require('./changeSuperPassword.html'),
        controller: require('./changeSuperPassword.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '主账户超管密码修改',
            };
          }
        }
      });
      addSuperSecurityDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        var hashObj = new jsSHA('SHA-1', 'TEXT');
        hashObj.update(data.password);
        obj.repeatPassword = hashObj.getHash('HEX');
        restAPI.user.updateSuperPassword.save(
           obj.repeatPassword).$promise.then(function (resp) {
           $rootScope.loading = false;
           if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '修改密码成功'
              });
            }
        });
      }, function (resp) {

      });
    }


    /**
     * 修改密码
     */
    function modify(param) {
      var addsecurityDialog = $modal.open({
        template: require('./changepassword.html'),
        controller: require('./changepassword.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '修改密码',
              obj: param
            };
          }
        }
      });
      addsecurityDialog.result.then(function (data) {
        $rootScope.loading = true;
        var obj = {};
        var hashObj = new jsSHA('SHA-1', 'TEXT');
        hashObj.update(data.password);
        obj.account = data.account;
        obj.repeatPassword = hashObj.getHash('HEX');

        restAPI.user.updatePassword.save({
          id: param.id
        }, obj).$promise.then(function (resp) {
           $rootScope.loading = false;
           if(resp && resp.status===9999) {
              Notification.error({
                message: resp.msg
              });
            } else {
              search();
              Notification.success({
                message: '修改密码成功'
              });
            }
        });
      }, function (resp) {

      });
    }


    /**
		 * 历史文档
		 */
		function historys(param) {
			var hisDialog = $modal.open({
				template: require('./operateHistory.html'),
				controller: require('./operateHistory.ctrl.js'),
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '用户操作历史记录：' + param.account,
							id: param.id,
						};
					}
				}
			});
		}

  }
];

module.exports = angular.module('app.user.user', []).controller('userCtrl', user_fn);