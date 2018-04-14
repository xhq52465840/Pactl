'use strict';

var remark_fn = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope', '$state', '$stateParams',
  function ($scope, restAPI, $modal, Notification, $rootScope, $state, $stateParams) {
    var vm = $scope;
    var id = '';
    var type = '';
    var airCode = '';
    vm.addBook = addBook;
    vm.back = back;
    vm.remarkData = [];
    vm.removeBook = removeBook;
    vm.search = search;
    vm.showBook = showBook;
    vm.showRemark = showRemark;
    vm.aStatus = '';

    check();

    /**
     * 校验
     */
    function check() {
      id = $stateParams.id;
      type = $stateParams.type;
      if (id) {
        getStatus();
      } else {
        back();
      }
    }
    /**
     * 查询
     */
    function search() {
      getReamrkData();
    }

    function getStatus() {
      $rootScope.loading = true;
      restAPI.waybill.statusdetail.save({}, {
				awId: id
			}).$promise.then(function (resp) {
				$rootScope.loading = false;
				if (resp.ok) {
					var data = resp.data;
          vm.aStatus = data.aStatus;
          getReamrkData();
				} else {
					Notification.error({
						message: resp.msg
					});
				}
			});
    }
    /**
     * 获取运单备注数据
     */
    function getReamrkData() {
      $rootScope.loading = true;
      restAPI.reCheck.remarks.save({}, {
          awId: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp && resp.data) {
            angular.forEach(resp.data, function (v, k) {
              v.type === '0' && (airCode = v.airCode);
            });
          }
          vm.remarkData = resp.data;
        });
    }
    /**
     * 返回
     */
    function back() {
      if (type === '1') {
        $state.go('securityItem.reCheck');
      } else if (type === '2') {
        $state.go('securityItem.operate');
      } else {
        $state.go('index');
      }
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
              waybillNo: param.waybill_no
            };
          }
        }
      });
      remarkDialog.result.then(function () {

      }, function (data) {
        param.count_remark = data+"";
      });
    }
    /**
     * 显示证书
     */
    function showBook(param, oprn) {
      $rootScope.loading = true;
      restAPI.reCheck.getBookPDF.save({}, {
          bookId: param.bookId || param.id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.msg === 'ok') {
            var srcArr = [];
            angular.forEach(resp.data, function (m, n) {
              if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                m.src = m.fileHttpPath
              } else {
                srcArr.push(m.fileHttpPath);
              }
            });
            openDialog({
              srcArr: srcArr
            });
          } else {
            Notification.error({
              message: '获取证书数据失败'
            });
          }
        });
    }
    /**
     * 删除证书
     */
    function removeBook(bookNo, awId,id) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + bookNo,
              content: '你将要删除证书' + bookNo + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.reCheck.removeBook.save({}, {
            bookNo: bookNo,
            awId: awId,
            id: id
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '删除证书成功'
              });
              search();
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
     * 增加证书
     */
    function addBook(param) {
      var bookDialog = $modal.open({
        template: require('./addCert.html'),
        controller: require('./addCert.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              waybillNo: param.waybill_no,
              agentOprnId: param.agent_oprn_id,
              awId: param.awId,
              airCode: airCode
            };
          }
        }
      });
      bookDialog.result.then(function () {
        search();
      }, function () {
        search();
      });
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

module.exports = angular.module('app.securityItem.remark', []).controller('remarkCtrl', remark_fn);