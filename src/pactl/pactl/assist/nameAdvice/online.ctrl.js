'use strict';

var online_fn = ['$scope', 'restAPI', 'Notification', '$rootScope', '$state', '$stateParams', '$modal',
  function ($scope, restAPI, Notification, $rootScope, $state, $stateParams, $modal) {
    var vm = $scope;
    vm.back = back;
    var goodsId = '';
    vm.goodsId = '';
    vm.product = [];
    vm.remove = remove;

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
          var data = resp.data.pGoodsAdvice;
          vm.dataStatus = data.status;
          // vm.dataResult = data.result;
          vm.airLines = data.airLines;
          if (resp.ok) {
            var product = resp.data.pGoodsAdvice.productDesc;
            if (product) {
              vm.product = JSON.parse(product);
              vm.product.dest = data.dest;
            } else {
              vm.product.namesCn = data.namesCn;
              vm.product.namesEn = data.namesEn;
            }
            vm.product.isRead = "1";
            setRead();
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }

    function setRead() {
      $rootScope.loading = true;
      restAPI.nameAdvice.addAdvice.save({}, {
        "goodsId": goodsId,
        "airLines": vm.airLines,
        "productDesc": JSON.stringify(vm.product),
        "productFlag": "PF1" // 对应的页面标识
      }).$promise.then(function (resp) {
        $rootScope.loading = false;
      })
    }

    /**
     * 删除
     */
    function remove() {
      if (vm.dataStatus === '106' || vm.dataStatus === '105') {
        Notification.warning({
          message: '有结论，或者禁用状态，不允许删除'
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
              $state.go("pactlAssist.reply", {
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
    /**
     * 返回
     */
    function back() {
      $state.go("pactlAssist.reply", {
        'goodsId': $stateParams.goodsId
      });
    }

    /**
     * 查看以后标为已阅
     */

    //pactl 咨询回复页面点击查看产品时 传 usrType，在此根据userType 判断用户类型，如果是Pactl用户，此页面只能查看，不可编辑
    // if ($stateParams.userType && $stateParams.userType == "PACTL") {
    //   $("input").attr("readOnly", true);
    //   $("textarea").attr("readOnly", true);
    //   $("button").css("display", "none");

    // }
  }
];

module.exports = angular.module('app.pactlAssist.online', []).controller('onlineCtrl', online_fn);