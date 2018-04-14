'use strict';

module.exports = ['$scope', 'restAPI', 'Auth', '$modalInstance', 'items', 'Notification',
  function ($scope, restAPI, Auth, $modalInstance, items, Notification) {
    var vm = $scope;
    vm.cancel = cancel;
    vm.compositionData = [];
    vm.editAble = items.editAble;
    vm.loading = false;
    vm.obj = {};
    vm.purposeData = [];
    vm.title = items.title;

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
            if (!vm.obj.cargoDeclare) {
              vm.obj.cargoDeclare = {};
            }
            if (!vm.obj.cargoDeclare.contact) {
              //vm.obj.cargoDeclare.contact = Auth.getUser().username;
            }
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
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];