'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', '$modal',
  function($scope, $modalInstance, items, restAPI, $rootScope, $modal) {
    var vm = $scope;
    vm.items = items;
    vm.cancel = cancel;
    vm.hisData = [];
    vm.showPdfDialog = showPdfDialog;

    setData();
    /**
     * 
     */
    function setData() {
      $rootScope.loading = true;
      restAPI.hislog.hislogs.save({}, items.obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          var data = resp.rows || [];
          angular.forEach(data, function(v, k) {
            if (v.oprnType === '证书修改') {
              angular.forEach(angular.fromJson(v.remarks) || [], function(m, n) {
                (m.suffix && /[pP][dD][fF]/.test(m.suffix)) && (v.pdfObj = m);
              });
            }
          });
          vm.hisData = data;
        });
    }
    /**
     * 显示pdf
     */
    function showPdfDialog(params) {
      var pdfDialog = $modal.open({
        template: require('../showPDF/showPDF.html'),
        controller: require('../showPDF/showPDF.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              src: params
            };
          }
        }
      });
    }
    // 取消
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];