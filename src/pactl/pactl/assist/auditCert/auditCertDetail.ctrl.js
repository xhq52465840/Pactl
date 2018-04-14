'use strict';

var auditCertDetail_fn = ['$scope', 'restAPI', 'Notification', '$rootScope', '$stateParams', '$sce', '$state', '$timeout', 'Year', 'IsIe', '$modal',
  function ($scope, restAPI, Notification, $rootScope, $stateParams, $sce, $state, $timeout, Year, IsIe, $modal) {
    var id = '';
    var vm = $scope;
    vm.certObj = {};
    vm.certData = {};
    vm.clipComplete = clipComplete;
    vm.clipError = clipError;
    vm.getNextAuditInfo = getNextAuditInfo;
    vm.afterSave = false;
    vm.goodTypeData = [];
    vm.reasonData = [];
    vm.save = save;
    vm.selectGoodsType = selectGoodsType;
    vm.selectAuditStatus = selectAuditStatus;
    vm.searchNextAuditInfo = searchNextAuditInfo;
    vm.tagTransform = tagTransform;
    vm.trustSrc = trustSrc;
    vm.yearData = Year.getThreeYear();
    vm.showCopy = IsIe.ieNum() == 8 ? false : true;
    vm.srcArr = [];
    vm.name='';
    check();
    function tagTransform(tag) {
        try {
          tag = tag.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          if (tag.length === 3) {
            return {
              code: tag
            };
          } else {
            return;
          }
        } catch (error) {
          return;
        }
      }
    /**
     * 检测id
     */
    function check() {
      id = $stateParams.id;
      getReason();
    }
    /**
     * 获取退回原因
     */
    function getReason() {
      restAPI.baseData.queryAll.save({}, {
          type: '1478056570840928'
        })
        .$promise.then(function (resp) {
        	//console.log(resp)
          vm.reasonData = resp.rows;
          getCargoType();
        });
    }
    /**
     * 获取所有货物类型
     */
    function getCargoType() {
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function (resp) {
          vm.goodTypeData = resp.rows;
          search();
        });
    }
    /**
     * 查询证书
     */
    function search() {
      if (id) {
        getAuditInfoById();
      } else {
        getNextAuditInfo();
      }
    }
    /**
     * 根据id获取证书详情
     */
    function getAuditInfoById() {
      $rootScope.loading = true;
      restAPI.book.auditInfo.save({}, {
          bookId: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            setData(resp);
          } else {
            vm.certData = {};
            Notification.error({
              message: '查询证书失败'
            });
          }
        });
    }
    /**
     * 下一个
     */
    function getNextAuditInfo() {
      $rootScope.loading = true;
      restAPI.book.next.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (resp.data && resp.data.pAgentShareBook && resp.data.pAgentShareBook.bookId) {
              setData(resp);
            } else {
              Notification.error({
                message: '没有可操作的证书或证书正在审核中'
              });
              $state.go('pactlAssist.auditCert');
            }
          } else {
            vm.certData = {};
            Notification.error({
              message: '查询证书失败'
            });
          }
        });
    }
    /**
     * 下一个证书事件
     */
    function checkNext() {
      if ((vm.afterSave && vm.certData.goodsType && vm.certData.auditStatus === '102') || (vm.afterSave && vm.certData.auditStatus === '100' && vm.certData.reReason)) {
        return false;
      } else {
        return true;
      }
    }

    function searchNextAuditInfo() {
      if (!checkNext()) {
        $state.go('pactlAssist.auditCertDetail', {
          id: ''
        }, {
          reload: true
        });
      } else {
        Notification.error({
          message: '请完成当前证书审核操作,并保存当前审核结论！'
        });
      }

    }
    /**
     * 显示数据
     */
    function setData(resp) {
      isCheck(resp.data.pAgentShareBook.bookId);
      vm.pdfPath = '';
      vm.srcArr = [];
      angular.forEach(resp.data && resp.data.pFileRelations || [], function (m, n) {
        if (m.suffix && /[pP][dD][fF]/.test(m.suffix)) {
          vm.pdfPath = m.fileHttpPath;
        } else {
          vm.srcArr.push(m.fileHttpPath);
        }
      });
      vm.certData = resp.data && resp.data.pAgentShareBook || {};
    //  console.log(vm.certData.reReason)
      vm.certData.pOfficeInfo = resp.data.pOfficeInfo;
      for (var index = 0; index < vm.yearData.length; index++) {
        var element = vm.yearData[index];
        if (resp.data.pAgentShareBook.validityYear == element.id) {
          vm.certData.year = element;
          break;
        }
      }
      if (vm.certData.reReason) {
    	 //debugger
    	  var reReason =vm.certData.reReason.split(';')
    	 //console.log(vm.certData.reReason)
    	 vm.certData.reReason = [];
        for (var index = 0; index < reReason.length; index++) {
        
         // debuggervm.reasonData
          for(var i in  vm.reasonData){
        	  
        	  var element = vm.reasonData[i];
        	  if (element.name === reReason[index]) {
        		  vm.certData.reReason.push(element);
                 break;
                }
          }
         
        }
        
      }
    }
    /**
     * 是否正在审核
     */
    function isCheck(id) {
      $rootScope.loading = true;
      restAPI.book.isAudit.save({}, {
          bookId: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            if (resp.data.status === '1') {
              dialog()
            }
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }

    function dialog() {
      var confirmDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '确认',
              content: '当前证书正在审核;',
              content1: '点击确认,可继续操作该证书;点击取消，将回到证书共享在线审核界面'
            };
          }
        }
      });
      confirmDialog.result.then(function () {

      }, function () {
        $state.go('pactlAssist.auditCert');
      });
    }
    /**
     * 保存结果
     */
    function save() {
      var obj = checkIput();
      if (!obj) {
        return false;
      }
      $rootScope.loading = true;
      restAPI.book.audit.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            Notification.success({
              message: '证书审核成功'
            });
            vm.afterSave = true;
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 校验必填
     * 
     * @returns
     */
    function checkIput() {
      if (!vm.certData.bookId) {
        Notification.error({
          message: '没有鉴定证书编号'
        });
        return false;
      }
      if (vm.certData.auditStatus !== '102' && vm.certData.auditStatus !== '100') {
        Notification.error({
          message: '未填写在线申请结果'
        });
        return false;
      }
      if (vm.certData.year) {
        if (vm.certData.year.id < Year.getNowYear().id) {
          Notification.error({
            message: '使用年份填写不正确'
          });
          return false;
        }
        if (vm.certData.auditStatus === '102') {
          if (!vm.certData.goodsType) {
            Notification.error({
              message: '没有选择货物类型'
            });
            return false;
          }
          return {
            bookId: vm.certData.bookId,
            goodsType: vm.certData.goodsType,
            auditStatus: vm.certData.auditStatus,
            validityYear: vm.certData.year.id.toString(),
            reReason: ''
          };
        }
        if (vm.certData.auditStatus === '100') {
        	
          if (vm.certData.reReason) {
        	 var names=[]
          	for(var i in vm.certData.reReason){
          	vm.name += vm.certData.reReason[i].name+';'
          	
          	}
        	 vm.name=vm.name.slice(0,vm.name.length-1)
            return {
              bookId: vm.certData.bookId,
              goodsType: vm.certData.goodsType,
              auditStatus: vm.certData.auditStatus,
              validityYear: vm.certData.year.id.toString(),
              reReason: vm.name
            };
          } else {
            Notification.error({
              message: '未填写退回原因'
            });
            return false;
          }
        }
      } else {
        Notification.error({
          message: '未填写使用年份'
        });
        return false;
      }
    }
    /**
     * 选择货物类型,单选
     */
    function selectGoodsType(data) {
      vm.certData.goodsType = vm.certData.goodsType !== data.id ? data.id : '';
    }
    /**
     * 审核结论：通过、退回（需要选择退回原因）
     */
    function selectAuditStatus(data) {
      vm.certData.auditStatus = data;
    }
    /**
     * 
     */
    function trustSrc(src) {
      return $sce.trustAsResourceUrl(src);
    }

    function clipComplete(e) {
      Notification.success({
        message: '复制成功'
      });
    }

    function clipError(e) {
      Notification.error({
        message: '复制失败'
      });
    }
  }
];

module.exports = angular.module('app.pactlAssist.auditCertDetail', []).controller('auditCertDetailCtrl', auditCertDetail_fn);