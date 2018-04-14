'use strict';

var officialWeb_fn = ['restAPI','$scope', 'Notification', '$stateParams', '$sce', '$timeout', 'IsIe','$rootScope','Notification',
  function(restAPI,$scope, Notificati, $stateParams, $sce, $timeout, IsIe,$rootScope,Notification) {
    var vm = $scope;
    vm.cerData = {
      officeName: '',
      bookNo: '',
      classUrl: '',
      fileHttpPath: '',
      accredit: '',
      srcArr: ''
    }
    vm.clipComplete = clipComplete;
    vm.clipError = clipError;
    vm.trustSrc = trustSrc;
    vm.showCopy = IsIe.ieNum() == 8 ? false : true;
    vm.officeinfo = {};
    vm.wayBillBook = {};
    search();
    /**
		 * 查询证书列表
		 */
		function search() {
			vm.loading = true;
			restAPI.preJudice.bookCheck.save({}, {
					awId: $stateParams.awId,
          bookType: $stateParams.bookType,
          id: $stateParams.id,
          diffId: $stateParams.diffId
				})
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
						angular.forEach(vm.rows, function (v, k) {
							v.srcArr = [];
							angular.forEach(v.files, function (m, n) {
								if (!/[pP][dD][fF]/.test(m.suffix)) {
									v.srcArr.push(m.fileHttpPath);
								} else {
									v.pdfPath = m.fileHttpPath;
								}
							});
            });
            if(vm.rows.length>0) {
              vm.wayBillBook = vm.rows[0];
              check();
            } else {
              Notification.error({
                message: '未查到数据'
              });
            }
					}
				});
		}

   

    /**
     * 检测id
     */
    function check() {
      vm.cerData.officeName = vm.wayBillBook.book.officeName;
      vm.cerData.bookNo = vm.wayBillBook.book.bookNo;
      vm.cerData.classUrl = vm.wayBillBook.officeUrl;
      vm.cerData.accredit = vm.wayBillBook.officeInfo.accredit;
      vm.cerData.srcArr = vm.wayBillBook.srcArr;
    }

    function trustSrc(src) {
      return $sce.trustAsResourceUrl(src);
    }

    function clipComplete(e) {
      Notification.success({
        message: '复制成功'
      });
    };

    function clipError(e) {
      Notification.error({
        message: '复制失败'
      });
    };
  }
];

module.exports = angular.module('app.pactlReceive.officialWeb', []).controller('officialWebCtrl', officialWeb_fn);