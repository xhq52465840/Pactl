'use strict';

var online_fn = ['$scope', 'restAPI', 'Notification', '$rootScope', '$modal', '$state', '$stateParams', 'Auth',
  function ($scope, restAPI, Notification, $rootScope, $modal, $state, $stateParams, Auth) {
    var vm = $scope;
    var goodsId = '';
    vm.afterSave = false;
    vm.product = {};
    vm.back = back;
    vm.goodsId = '';
    vm.onlyTel = onlyTel;
    vm.save = save;
    vm.searchGoodId = searchGoodId;
    vm.readOnly = false;
    vm.setReadOnly = setReadOnly;
    vm.remove = remove;
    vm.sameAgent = sameAgent;
    vm.showButton = showButton;
    vm.searchGoodReadFlag = searchGoodReadFlag;

    check();

    /**
     * 检测id
     */
    function check() {
      goodsId = $stateParams.goodsId;
      if (goodsId) {
        vm.goodsId = goodsId;
        searchGoodId();
      } else {
        $state.go('agentAssist.reply');
      }
    }
    /**
     * 根据goodsID查询
     */
    function searchGoodId() {
      $rootScope.loading = true;
      restAPI.goodsId.goodsIdSet.save({}, {
          goodsId: goodsId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.data = resp.data.pGoodsAdvice;
          if (resp.ok) {
            vm.airLines = resp.data.pGoodsAdvice.airLines;
            var product = resp.data.pGoodsAdvice.productDesc ? resp.data.pGoodsAdvice.productDesc : '';
            vm.product = product ? JSON.parse(product) : '';
            if (vm.product) {
              vm.afterSave = true;
              // vm.product.dest = vm.product.dest ? ;
              // vm.product.namesCn = vm.data.namesCn ? vm.data.namesCn : '';
            } else {
              vm.product = {};
              vm.product.namesEn = vm.data.namesEn ? vm.data.namesEn : '';
              vm.product.namesCn = vm.data.namesCn ? vm.data.namesCn : '';
              vm.product.dest = vm.data.dest ? vm.data.dest : '';
            }
            setReadOnly();
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }


    function searchGoodReadFlag() {
      $rootScope.loading = true;
      restAPI.goodsId.goodsIdSet.save({}, {
          goodsId: goodsId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          var data = resp.data.pGoodsAdvice;
          if (resp.ok) {
            var product = resp.data.pGoodsAdvice.productDesc ? resp.data.pGoodsAdvice.productDesc : '';
            var temp_product = product ? JSON.parse(product) : '';
            if (temp_product) {
              if (temp_product.isRead) {
                Notification.error({
                  message: '货站已经查看过当前在线产品说明，不能再修改'
                });
                return;
              }
            }
            save();
          } else {
            Notification.error({
              message: '数据异常,在线产品说明可能已经被删除，请刷新后再操作'
            });
          }
        });
    }

    function setReadOnly() {
      if (vm.data.status === '105' || vm.data.status === '106' || (vm.data.result && vm.data.result != '[]')) {
        vm.readOnly = true;
      } else {
        vm.readOnly = false;
      }

    }
    /**
     * 保存
     */
    function save() {
      $rootScope.loading = true;
      var errorMsg = null;

      if (vm.data.status === '105') {
        errorMsg = '品名咨询已禁用,不能修改在线产品说明';
      } else if (vm.data.status === '106') {
        errorMsg = '品名咨询已可引用,不能修改在线产品说明';
      } else if (vm.data.result && vm.data.result != '[]') {
        errorMsg = '品名咨询已有结论,不能修改在线产品说明';
      }

      if (errorMsg) {
        Notification.warning({
          message: errorMsg
        });
        $rootScope.loading = false;
      } else {
        $rootScope.loading = true;
        restAPI.nameAdvice.addAdvice.save({}, {
          "goodsId": goodsId,
          "airLines": vm.airLines,
          "productDesc": JSON.stringify(vm.product),
          "productFlag": "PF1" // 对应的页面标识
        }).$promise.then(function (resp) {
          if (resp.ok) {
            Notification.success({
              message: '产品说明保存成功'
            });
          }
          vm.afterSave = true;
          $rootScope.loading = false;
        })
      }
    }
    /**
     * 返回
     */
    function back() {
      $state.go("agentAssist.reply", {
        'goodsId': goodsId
      });
    }
    /**
     * 电话号码
     */
    function onlyTel() {
      try {
        vm.product.contactsphone = vm.product.contactsphone.replace(/[^0-9\-]/g, '');
      } catch (error) {
        return;
      }
    }

    /**
     * 可引用的品名咨询，对所有代理都是公开的，但是其他代理不能查看该品名咨询的附件
     */
    function sameAgent() {
      if (vm.data) {
        if (+vm.data.agentSales === Auth.getMyUnitId()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }

    }

    function showButton(type) {
      var show = false;
      if (type === 'del') {
        if (vm.data.status !== '101') {
          show = false;
        } else {
          show = true;
        }
      } else if (type === 'save') {
        if (vm.data.status === '105' || vm.data.status === '106' || (vm.data.result && vm.data.result != '[]') || vm.product.isRead === '1') {
          show = false;
        } else {
          show = true;
        }
      }
      return show;
    }

    /**
     * 删除
     */
    function remove() {
      if (vm.data.status !== '101') {
        Notification.warning({
          message: '不是新建状态不允许删除'
        });
      } else {
        var delDialog = $modal.open({
          template: require('../../../remove/remove.html'),
          controller: require('../../../remove/remove.ctrl.js'),
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                title: '删除：' + goodsId + '产品说明',
                content: '你将要删除产品说明' + goodsId + '。此操作不能恢复。'
              };
            }
          }
        });
        delDialog.result.then(function () {
          restAPI.nameAdvice.addAdvice.save({}, {
            "goodsId": goodsId,
            "airLines": vm.airLines,
            "productDesc": '',
            "productFlag": '',
            "deleteProductDesc": 'true'
          }).$promise.then(function (resp) {
            if (resp.ok) {
              Notification.success({
                message: '删除产品说明成功'
              });
              $state.go("agentAssist.reply", {
                'goodsId': goodsId
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
        }, function () {

        });
      }
    }

  }
];

module.exports = angular.module('app.agentAssist.online', []).controller('onlineCtrl', online_fn);