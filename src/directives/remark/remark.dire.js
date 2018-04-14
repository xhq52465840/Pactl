'use strict';

module.exports = ['Notification', '$rootScope', 'restAPI', 'Auth',
  function (Notification, $rootScope, restAPI, Auth) {
    return {
      restrict: 'EA',
      template: require('./remark.html'),
      replace: true,
      scope: {
        type: '@',
        awid: '='
      },
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var vm = $scope;
          var content = '';
          vm.add = add;
          vm.edit = edit;
          vm.editContent = editContent;
          vm.getRemark = getRemark;
          vm.remove = remove;
          vm.remarkObj = {};
          vm.remarks = [];
          vm.userId = Auth.getId() + '';

          /**
           * 获取备注信息
           */
          function getRemark() {
            if (vm.type === 'pactl') {
              restAPI.remark.queryPactlRemark.save({}, {
                  awId: vm.awid
                })
                .$promise.then(function (resp) {
                  vm.remarks = resp.rows || [];
                });
            } else if (vm.type === 'agent') {
              restAPI.remark.queryAgentRemark.save({}, {
                  awId: vm.awid
                })
                .$promise.then(function (resp) {
                  vm.remarks = resp.rows || [];
                });
            } else if (vm.type === 'receive') {
              restAPI.remark.queryReceiveRemark.save({}, {
                  awId: vm.awid
                })
                .$promise.then(function (resp) {
                  vm.remarks = resp.rows || [];
                });
            }
          }
          /**
           * 增加
           */
          function add() {
            vm.remarkObj.content.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            if (vm.type === 'pactl') {
              restAPI.remark.addPactlRemark.save({}, {
                  awId: vm.awid,
                  content: vm.remarkObj.content
                })
                .$promise.then(function (resp) {
                  addCallback(resp);
                });
            } else if (vm.type === 'agent') {
              restAPI.remark.addAgentRemark.save({}, {
                  awId: vm.awid,
                  content: vm.remarkObj.content
                })
                .$promise.then(function (resp) {
                  addCallback(resp);
                });
            } else if (vm.type === 'receive') {
              restAPI.remark.addReceiveRemark.save({}, {
                  awId: vm.awid,
                  content: vm.remarkObj.content
                })
                .$promise.then(function (resp) {
                  addCallback(resp);
                });
            }
          }
          /**
           * 新增之后的回调
           */
          function addCallback(resp) {
            if (resp.ok) {
              vm.remarkObj.content = '';
              getRemark();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          }
          /**
           * 编辑
           */
          function edit(params, $e) {
            params.isEdit = true;
            content = angular.copy(params.content);
          }
          /**
           * 编辑数据
           */
          function editContent(params, index) {
            params.content.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            if (params.content === content || params.content === '') {
              params.content = content;
              params.isEdit = false;
              return false;
            }
            if (vm.type === 'pactl') {
              restAPI.remark.addPactlRemark.save({}, {
                  awId: vm.awid,
                  content: params.content,
                  wbcId: params.wbcId
                })
                .$promise.then(function (resp) {
                  editCallback(params, resp);
                });
            } else if (vm.type === 'agent') {
              restAPI.remark.addAgentRemark.save({}, {
                  awId: vm.awid,
                  content: params.content,
                  wbcId: params.wbcId
                })
                .$promise.then(function (resp) {
                  editCallback(params, resp);
                });
            } else if (vm.type === 'receive') {
              restAPI.remark.addReceiveRemark.save({}, {
                  awId: vm.awid,
                  content: params.content,
                  wbcId: params.wbcId
                })
                .$promise.then(function (resp) {
                  editCallback(params, resp);
                });
            }

          }
          /**
           * 编辑之后的回调
           */
          function editCallback(params, resp) {
            if (resp.ok) {
              params.isEdit = false;
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          }
          /**
           * 删除
           */
          function remove(params, index) {
            restAPI.remark.removeRemark.save({}, {
                wbcId: params.wbcId
              })
              .$promise.then(function (resp) {
                if (resp.ok) {
                  vm.remarks.splice(index, 1);
                } else {
                  Notification.error({
                    message: resp.msg
                  });
                }
              });
          }
        }
      ],
      link: function (scope, element, attrs, ctrls, transcludeFn) {
        scope.$watch('awid', function (newVal, oldVal) {
          if (newVal) {
            scope.getRemark();
          }
        });
      }
    }
  }
];