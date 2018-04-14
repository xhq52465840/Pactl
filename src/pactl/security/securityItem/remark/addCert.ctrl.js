'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', 'Notification', '$rootScope', '$modal',
  function ($scope, $modalInstance, items, restAPI, Notification, $rootScope, $modal) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.addBook = addBook;
    vm.bookData = [];
    vm.certObj = {
      waybillNo: items.waybillNo
    };
    vm.cancel = cancel;
    vm.search = search;
    vm.openDialog = openDialog;
    vm.showBook = showBook;

    /**
     * 查询
     */
    function search() {
      if (!vm.certObj.bookNo) {
        Notification.error({
          message: '请输入证书编号'
        });
        return false;
      }
      searchData();
    }
    /**
     * 查询数据
     */
    function searchData() {
      $rootScope.loading = true;
      restAPI.reCheck.getBookByBookID.save({}, {
        bookNo: vm.certObj.bookNo,
        agentOprnId: items.agentOprnId,
        airCode: items.airCode,
        awId: obj.awId
      })
        .$promise.then(function (resp) {
        	console.log(resp.data)
          $rootScope.loading = false;
          vm.bookData = [];
          if (resp && resp.ok) {
            if (resp && resp.data) {
              angular.forEach(resp.data, function (v, k) {
                if (v.returnStatus !== '102') {
                  vm.bookData.push(v);
                  angular.forEach(v.pFileRelations || [], function (m, n) {
                    if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
                      v.pdfPath = m.fileHttpPath;
                    }
                  });
                }
              });
            }
          } else {
            Notification.error({
              message: resp.msg || '查询失败'
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
    /**
     * 添加关联
     */
    function addBook(param) {
      var arr = [];
      arr.push({
        book: {
          awId: obj.awId,
          bookType: 'sharing',
          bookCheckType: 'book',
          bookNo: param.pAgentShareBook.bookNo,
          ocId: param.pAgentShareBook.ocId,
          officeCode: param.pAgentShareBook.officeCode,
          officeName: param.pAgentShareBook.shortName || param.pAgentShareBook.officeName,
          bookId: param.pAgentShareBook.bookId,
          deviceId: '1',
          id:param.pAgentShareBook.id
        }
      });
      $rootScope.loading = true;
      restAPI.reCheck.addBookPDF.save({}, arr)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '关联成功'
            });
            $modalInstance.close();
          } else {
            Notification.error({
              message: resp.msg || '关联失败'
            });
          }
        });
    }

     /**
     * 显示证书
     */
    function showBook(param) {
      var srcArr = [];
      angular.forEach(param.pFileRelations, function (m, n) {
        if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
          m.src = m.fileHttpPath
        } else {
          srcArr.push(m.fileHttpPath);
        }
      });
      openDialog({
        srcArr: srcArr
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