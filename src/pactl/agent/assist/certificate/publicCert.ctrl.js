'use strict';

var publicCert_fn = ['$scope', 'Page', 'restAPI', 'Notification', '$rootScope', '$modal', 'Auth', '$state',
  function ($scope, Page, restAPI, Notification, $rootScope, $modal, Auth, $state) {
    var vm = $scope;
    var unitId = Auth.getUnitId() + '';
    var myUnitId = Auth.getMyUnitId() + '';
    vm.unitType = (unitId === myUnitId);
    vm.clear = clear;
    vm.concern = concern;
    vm.publicObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.availableBookNo = [];
    vm.search = search;
    vm.showDelayDialog = showDelayDialog;
    vm.printBarCode = printBarCode;
    vm.doAuthorize = doAuthorize;
    vm.allCheck = allCheck;
    vm.singleCheck = singleCheck;
    vm.selected = [];
    vm.idSelected = [];

    /**
     * 查询
     */
    function search() {
      if (vm.publicObj.bookNo && vm.publicObj.bookNo.length) {
        getCertData();
      } else {
        Notification.error({
          message: '请输入证书编号'
        });
      }
    }
    /**
     * 获取证书数据
     */
    function getCertData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.book.bookPublicList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.certData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      if (vm.sortObj && vm.sortObj.name) {
        obj.orderBy = vm.sortObj.name + ' ' + vm.sortObj.sort;
      }
      if (vm.publicObj.bookNo && vm.publicObj.bookNo.length) {
        obj.bookNo = vm.publicObj.bookNo.join(';').replace(/\s/g, '');
      }
      return obj;
    }
    /**
     * 关注
     */
    function concern(id) {
      var obj = {
        bookId: id
      };
      $rootScope.loading = true;
      restAPI.book.concernBook.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            search();
            Notification.success({
              message: '操作成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 清空数据
     */
    function clear() {
      if (vm.publicObj.bookNo && vm.publicObj.bookNo.length) {
        search();
      } else {
        vm.certData = [];
      }
    }
    /**
     * 显示延期信息
     */
    function showDelayDialog(params) {
      var delayDialog = $modal.open({
        template: require('./delayDialog.html'),
        controller: require('./delayDialog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              officeDelay: params.pOfficeInfoDelay,
              airDelay: params.pOfficeInfoAirDelay,
              officeInfo: {
                shortName: params.pAgentShareBook.officeName,
                officeCode: params.pAgentShareBook.officeCode
              }
            };
          }
        }
      });
    }

    function printBarCode() {
      if (!vm.idSelected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      var printCode = vm.idSelected.join(';');
      var urlHref = $state.href('agentAssist.certCode', {
        'printCode': printCode
      });
      window.open(urlHref);
    }

    function doAuthorize(type) {
      if (!vm.selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      if (validType()) {
        showValidResult();
        return;
      }
      var agentArr = [],
        arr = [],
        result = {
          authorize: {},
          fileList: []
        };
      // angular.forEach(vm.selected, function (v, m) {
      //   var officeCode = v.pAgentShareBook.officeCode;
      //   if (agentArr.indexOf(officeCode) < 0) {
      //     agentArr.push(officeCode);
      //   }
      // });
      // if (agentArr.length > 1) {
      //   Notification.error({
      //     message: '所选证书的鉴定机构不同'
      //   });
      //   return false;
      // }
      // angular.forEach(vm.selected, function (v, k) {
      //   if (k === 0) {
      //     result.authorize.authorizedToParty = Auth.getMyUnitName();
      //     result.authorize.authorizedToPartyCode = Auth.getMyUnitCode();
      //     result.authorize.accreditingAgency = v.pAgentShareBook.officeName;
      //   }
      //   result.fileList.push({
      //     number: v.pAgentShareBook.bookNo
      //   });
      // });

      angular.forEach(vm.selected, function (v, m) {
        for (var index = 0; index < vm.certData.length; index++) {
          var element = vm.certData[index],
            officeCode = element.pAgentShareBook.officeCode;
          if (v.pAgentShareBook.bookId === element.pAgentShareBook.bookId) {
            if (agentArr.indexOf(officeCode) < 0) {
              agentArr.push(officeCode);
            }
            arr.push(element);
            break;
          }
        }
      });
      // if (agentArr.length > 1) {
      //   Notification.error({
      //     message: '所选证书的鉴定机构不同'
      //   });
      //   return false;
      // }
      angular.forEach(arr, function (v, k) {
        if (k === 0) {
          result.authorize.authorizedToParty = Auth.getMyUnitName();
          result.authorize.authorizedToPartyCode = Auth.getMyUnitCode();
          if (agentArr.length === 1) {
            result.authorize.accreditingAgency = v.pAgentShareBook.officeName;
          }
        }
        result.fileList.push({
          number: v.pAgentShareBook.bookNo
        });
      });
      result.type = type;


      result.type = type;
      createAuthorize(result);      
    }
    /**
     * 
     * 制作
     * @param {any} params
    
     */
    function createAuthorize(params) {
      var form = $("<form>");
      form.attr('style', 'display:none');
      form.attr('target', '');
      form.attr('method', 'post');
      form.attr('action', restAPI.author.authorization+'/'+params.type);
      $('body').append(form);
      var input = $('<input>');
      input.attr('type', 'hidden');
      input.attr('name', 'authorize');
      input.attr('value', JSON.stringify(params.authorize));
      form.append(input);
      var input = $('<input>');
      input.attr('type', 'hidden');
      input.attr('name', 'fileList');
      input.attr('value', JSON.stringify(params.fileList));
      form.append(input);
      form.submit();
      form.remove();
    }    
    /**
     * 校验证书是否可用
     */
    function validType() {
      var result = false;
      for (var index = 0; index < vm.certData.length; index++) {
        var element = vm.certData[index];
        if (element.checked && element.pAgentShareBook.disableFlag === '1') {
          result = true;
          break;
        }
      }
      return result;
    }
    /**
     * 有证书停用
     * 
     */
    function showValidResult() {
      Notification.error({
        message: '有证书停用，不可进行操作'
      });
    }

    function allCheck($e) {
      var target = $e.target,
        checked = target.checked;
      vm.selected = [];
      vm.idSelected = [];
      angular.forEach(vm.certData, function (v, k) {
        v.checked = checked;
        if (checked) {
          vm.selected.push(v);
          vm.idSelected.push(v.pAgentShareBook.bookId);
        }
      });
    }

    function singleCheck($e, param) {
      var target = $e.target,
        id = param.pAgentShareBook.bookId,
        index = vm.idSelected.indexOf(id),
        checked = target.checked;
      param.checked = checked;
      if (checked && index < 0) {
        vm.idSelected.push(id);
        vm.selected.push(param);
      }
      if (!checked && index > -1) {
        vm.idSelected.splice(index, 1);
        vm.selected.splice(index, 1);
      }
    }
  }
];

module.exports = angular.module('app.agentAssist.publicCert', []).controller('publicCertCtrl', publicCert_fn);