'use strict';

var proxyCert_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope', 'Auth', '$state', '$filter',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope, Auth, $state, $filter) {
    var selected = [];
    var vm = $scope;
    var unitId = Auth.getUnitId() + '';
    var myUnitId = Auth.getMyUnitId() + '';
    vm.unitType = (unitId === myUnitId);
    vm.addAgent = addAgent;
    vm.addCert = addCert;
    vm.addTag = addTag;
    vm.addBatchTag = addBatchTag;
    vm.agentSalesData = [];
    vm.allCheck = allCheck;
    vm.auditFlagData = [];
    vm.authorize = authorize;
    vm.availableBookNo = [];
    vm.cancelAuthorize = cancelAuthorize;
    vm.classesData = [];
    vm.changeBatchTag = changeBatchTag;
    vm.disable = disable;
    vm.doAuthorize = doAuthorize;
    vm.goodTypeData = [];
    vm.isChecked = isChecked;
    vm.officeCodeData = [];
    vm.operate = operate;
    vm.proxyObj = {};
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.printBarCode = printBarCode;
    vm.remove = remove;
    vm.singleCheck = singleCheck;
    vm.search = search;
    vm.showPdfDialog = showPdfDialog;
    vm.showDelayDialog = showDelayDialog;
    vm.auditFlagData2 = [];
    initCondition();

    /**
     * 初始化查询条件
     */
    function initCondition() {
      getOffice();
    }
    /**
     * 获取鉴定机构
     */
    function getOffice() {
      $rootScope.loading = true;
      restAPI.officeInfo.queryAll.save({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.officeCodeData = resp.rows;
          getAuditFlag();
        });
    }
    /**
     * 获取所有的证书状态
     */
    function getAuditFlag() {
      vm.auditFlagData2.push({
        id: '108',
        name: '可引用/已过期'
      });
      vm.auditFlagData2.push({
        id: '109',
        name: '可引用/已停用'
      });
      vm.auditFlagData2.push({
        id: '110',
        name: '可引用/未生效'
      });
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476351912155583'
        })
        .$promise.then(function (resp) {
          angular.forEach(resp.rows, function (v, k) {
            v.auditType = 'F';
            if(v.id !== '106') {
              vm.auditFlagData.push(v);
            }
            vm.auditFlagData2.push(v);
          });
          restAPI.baseData.queryAll.save({}, {
              type: '1476351925540465'
            })
            .$promise.then(function (resp) {
              $rootScope.loading = false;
              angular.forEach(resp.rows, function (v, k) {
                v.auditType = 'S';
                vm.auditFlagData.push(v);
                vm.auditFlagData2.push(v);
              });
              getLabel();
            });
        });
    }
    /**
     * 获取所有的标签
     */
    function getLabel() {
      $rootScope.loading = true;
      restAPI.tag.tagList.save({}, {
          status: '0'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.classesData = resp.rows;
          getCargoType();
        });
    }
    /**
     * 获取所有货物类型
     */
    function getCargoType() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476593774523444'
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.goodTypeData = resp.rows;
          getAgentSales();
        });
    }
    /**
     * 获取所有的销售代理
     */
    function getAgentSales() {
      $rootScope.loading = true;
      restAPI.agent.saleAgents.query({
          id: Auth.getUnitId()
        }, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.salesData = [];
          if (unitId !== myUnitId) {
            angular.forEach(resp || [], function (v, k) {
              if (v.id === +unitId) {
                vm.salesData.push({
                  id: v.id,
                  code: v.code,
                  description: v.description
                });
              }
            });
          } else {
            angular.forEach(resp || [], function (v, k) {
              vm.salesData.push({
                id: v.id,
                code: v.code,
                description: v.description
              });
            });
          }
          search();
        });
    }
    /**
     * 查询
     */
    function search() {
      getCertData();
    }
    /**
     * 获取证书数据
     */
    function getCertData() {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.book.bookList.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.proxyObj.allselected = false;
          selected = [];
          angular.forEach(resp.rows || [], function (v, k) {
            var data1 = []; //已授权销售代理	
            var data2 = {}; //有效期
            v.srcArr = [];
            var showName = 'page0';
            var screenshotPage = v.pOfficeInfo.screenshotPage
            if(screenshotPage<(v.pFileRelations.length)){
            	showName = "page"+(screenshotPage-1)
            };
            angular.forEach(v.pFileRelations, function (m, n) {
              if (!/[pP][dD][fF]/.test(m.suffix)) {
                if (m.oldName === showName) {
                  v.filePath = m.fileHttpPath;
                  v.imgShow = false;
                  v.style1 = {
                    width: (v.pOfficeInfo && v.pOfficeInfo.wides || 0) + 'px',
                    height: (v.pOfficeInfo && v.pOfficeInfo.lengths || 0) + 'px',
                    position: 'absolute',
                    zoom: 1,
                    'z-index': 1001,
                    top: '55px',
										left: '-340px',
                    overflow: 'hidden'
                  };
                  v.style2 = {
                    position: 'absolute',
                    'z-index': 1000,
                    width: '879px',
										height: '1242px',
                    top: (v.pOfficeInfo && v.pOfficeInfo.yAxle || 0) + 'px',
                    left: (v.pOfficeInfo && v.pOfficeInfo.xAxle || 0) + 'px'
                  };
                }
                v.srcArr.push(m.fileHttpPath);
              } else {
                v.pdfPath = m.fileHttpPath;
              }
            });
            angular.forEach(v.pAgentShareBookAccredits, function (m, n) {
              if (m.agentOprnId !== m.agentSalesId) {
                data1.push(m);
              }
              if (m.agentOprnId === m.agentSalesId) {
                data2 = m;
              }
            });
            //1.判断是否在有效期内
            //2.判断是否有流水号
            //3.判断状态是否有效
            v.pAgentShareBookAccredits = data1;
            v.validTime = data2;
            angular.forEach(v.pAgentLabelInfos, function (v, k) {
              v.styleObj = {
                'background-color': v.style
              };
            });
          });
          vm.certData = resp.rows || [];
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 翻页
     */
    function pageChanged() {
      vm.proxyObj.allselected = false;
      selected = [];
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
      if (vm.proxyObj.bookNo && vm.proxyObj.bookNo.length) {
        obj.bookNo = vm.proxyObj.bookNo.join(';').replace(/\s/g, '');
      }
      if (vm.proxyObj.officeCode && vm.proxyObj.officeCode.ocId) {
        obj.ocId = vm.proxyObj.officeCode.ocId;
      }
      /**
       * auditStatus 为 101 ,accreditFlag 为 0
       *  已提交   授权状态=0
          在线审核通过  授权状态=0
          已收正本  授权状态=已授权
          留存完成 授权状态=已授权
          已授权   证书状态=在线审核通过
          可引用   证书状态为空
       * 
       */
      if (vm.proxyObj.auditFlag && vm.proxyObj.auditFlag.auditType) {
        var auditStatus = '',
          accreditFlag = '';
        if (vm.proxyObj.auditFlag.auditType === 'F') {
          auditStatus = vm.proxyObj.auditFlag.id;
          if (auditStatus === '101' || auditStatus === '102') {
            accreditFlag = '0';
          } else if (auditStatus === '104' || auditStatus === '105') {
            accreditFlag = '103';
          }
        } else if (vm.proxyObj.auditFlag.auditType === 'S') {
          accreditFlag = vm.proxyObj.auditFlag.id;
          if (accreditFlag === '103') {
            auditStatus = '102';
          }
        }
        obj.auditStatus = auditStatus;
        obj.accreditFlag = accreditFlag;
      }
      if (vm.proxyObj.classes && vm.proxyObj.classes.length) {
        var labels = [];
        angular.forEach(vm.proxyObj.classes, function (v, k) {
          labels.push(v.id);
        });
        obj.alId = labels.join(';');
      }
      if (vm.proxyObj.agentSales && vm.proxyObj.agentSales.id) {
        obj.agentSalesId = vm.proxyObj.agentSales.id + '';
      }
      if (vm.proxyObj.validityYear) {
        obj.validityYear = vm.proxyObj.validityYear;
      }
      if (vm.proxyObj.goodType && vm.proxyObj.goodType.id) {
        obj.goodsType = vm.proxyObj.goodType.id;
      }
      return obj;
    }
    /**
     * 全选事件
     */
    function allCheck($e) {
      var checkbox = $e.target,
        checked = checkbox.checked;
      selected = [];
      angular.forEach(vm.certData, function (v, k) {
        if (v.pAgentShareBook.disableFlag !== '1') {
          v.checked = checked;
          if (checked) {
            selected.push(v.pAgentShareBook.bookId);
          }
        }
      });
      vm.proxyObj.allselected = checked;
    }
    /**
     * 检测是否选中
     */
    function isChecked(id) {
      return selected.indexOf(id) != -1;
    }
    /**
     * 单选
     */
    function singleCheck($e, data) {
      var checkbox = $e.target,
        id = data.bookId,
        index = selected.indexOf(id);
      data.checked = checkbox.checked;
      data.checked ? selected.push(id) : selected.splice(index, 1);
      vm.proxyObj.allselected = (selected.length === vm.certData.length);
    }
    /**
     * 添加证书共享
     */
    function addCert() {
      var addCertDialog = $modal.open({
        template: require('./addCertificate.html'),
        controller: require('./addCertificate.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加鉴定证书',
              officeCodeData: vm.officeCodeData,
              obj: {}
            };
          }
        }
      });
      addCertDialog.result.then(function (data) {
        search();
      }, function (resp) {

      });
    }
    /**
     * 授权子账户
     * 
     * 
     */
    function addAgent(params) {
      var id = params.pAgentShareBook.bookId;
      var addAgentDialog = $modal.open({
        template: require('./addBatchAgent.html'),
        controller: require('./addBatchAgent.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '授权子账户',
              oldAgent: params.pAgentShareBookAccredits,
              agent: vm.salesData,
              batch: false
            };
          }
        }
      });
      addAgentDialog.result.then(function (data) {
        var ids = [],
          code = [];
        angular.forEach(data.agentSales, function (v, k) {
          ids.push(v.id);
          code.push(v.code);
        });
        $rootScope.loading = true;
        restAPI.book.addAgent.save({}, {
            agentSalesId: ids.join(';'),
            agentSales: code.join(';'),
            bookId: id
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '授权成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 校验证书是否可用
     */
    function validType() {
      var result = false;
      for (var index = 0; index < vm.certData.length; index++) {
        var element = vm.certData[index];
        if (element.pAgentShareBook.checked && element.pAgentShareBook.disableFlag === '1') {
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
    /**
     * 授权
     */
    function authorize() {
      if (!selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      if (validType()) {
        showValidResult();
        return;
      }
      var addBatchAgentDialog = $modal.open({
        template: require('./addBatchAgent.html'),
        controller: require('./addBatchAgent.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '授权',
              agent: vm.salesData,
              batch: true,
              cancel: false
            };
          }
        }
      });
      addBatchAgentDialog.result.then(function (data) {
        var ids = [],
          code = [];
        angular.forEach(data.agentSales, function (v, k) {
          ids.push(v.id);
          code.push(v.code);
        });
        $rootScope.loading = true;
        restAPI.book.addAgent2.save({}, {
            agentSalesId: ids.join(';'),
            agentSales: code.join(';'),
            bookId: selected.join(';')
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '授权成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 取消授权
     */
    function cancelAuthorize() {
      if (!selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      if (validType()) {
        showValidResult();
        return;
      }
      var addBatchAgentDialog = $modal.open({
        template: require('./addBatchAgent.html'),
        controller: require('./addBatchAgent.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '取消授权',
              agent: vm.salesData,
              batch: true,
              cancel: true
            };
          }
        }
      });
      addBatchAgentDialog.result.then(function (data) {
        var ids = [];
        angular.forEach(data.agentSales, function (v, k) {
          ids.push(v.id);
        });
        $rootScope.loading = true;
        restAPI.book.cancelAgent.save({}, {
            agentSalesId: ids.join(';'),
            bookId: selected.join(';')
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '取消授权成功'
              });
            } else {
              Notification.error({
                message: '请选择授权销售代理'
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 添加标签
     */
    function addTag(params) {
      var id = params.pAgentShareBook.bookId;
      var addTagDialog = $modal.open({
        template: require('../tag/addBatchTag.html'),
        controller: require('../tag/addBatchTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加标签',
              labels: params.pAgentLabelInfos || [],
              type: '0'
            };
          }
        }
      });
      addTagDialog.result.then(function (data) {
        var alIds = [];
        angular.forEach(data.tag, function (v, k) {
          alIds.push(v.id);
        });
        $rootScope.loading = true;
        restAPI.book.addLabels.save({}, {
            alId: alIds.join(';'),
            bookId: id
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加标签成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 批量添加标签
     */
    function addBatchTag() {
      if (!selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      if (validType()) {
        showValidResult();
        return;
      }
      var addBatchTagDialog = $modal.open({
        template: require('../tag/addBatchTag.html'),
        controller: require('../tag/addBatchTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加标签',
              type: '2'
            };
          }
        }
      });
      addBatchTagDialog.result.then(function (data) {
        var alIds = [];
        angular.forEach(data.tag, function (v, k) {
          alIds.push(v.id);
        });
        $rootScope.loading = true;
        restAPI.book.addLabels2.save({}, {
            alId: alIds.join(';'),
            bookId: selected.join(';')
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '添加标签成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 更改标签
     */
    function changeBatchTag() {
      if (!selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      if (validType()) {
        showValidResult();
        return;
      }
      var changeBatchTagDialog = $modal.open({
        template: require('../tag/addBatchTag.html'),
        controller: require('../tag/addBatchTag.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '更换标签',
              type: '1'
            };
          }
        }
      });
      changeBatchTagDialog.result.then(function (data) {
        var alIds = [];
        angular.forEach(data.tag, function (v, k) {
          alIds.push(v.id);
        });
        $rootScope.loading = true;
        restAPI.book.changeTag.save({}, {
            alId: alIds.join(';'),
            bookId: selected.join(';')
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '更换标签成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function (resp) {

      });
    }
    /**
     * 打印条形码
     */
    function printBarCode() {
      if (!selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      var printCode = selected.join(';');
      var urlHref = $state.href('agentAssist.certCode', {
        'printCode': printCode
      });
      window.open(urlHref);
    }
    /**
     * 启用/禁用
     * 
     * @param {obj} params
     */
    function disable(param) {
      var id = param.pAgentShareBook.bookId,
        status = param.pAgentShareBook.disable === '0' ? '禁用' : '启用';
      $rootScope.loading = true;
      restAPI.book.disableBook.save({}, {
          bookId: id
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            search();
            Notification.success({
              message: status + '证书成功'
            });
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 删除
     */
    function remove(param) {
      var id = param.pAgentShareBook.bookId,
        name = param.pAgentShareBook.bookNo;
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '删除：' + name,
              content: '你将要删除证书' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.book.removeBook.save({}, {
            bookId: id
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除证书成功'
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
    /**
     * 制作授权书
     */
    function doAuthorize(type) {
      if (!selected.length) {
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
      angular.forEach(selected, function (v, m) {
        for (var index = 0; index < vm.certData.length; index++) {
          var element = vm.certData[index],
            officeCode = element.pAgentShareBook.officeCode;
          if (v === element.pAgentShareBook.bookId) {
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
            result.authorize.accreditingAgency = v.pOfficeInfo.officeName;
          }
        }
        result.fileList.push({
          number: v.pAgentShareBook.bookNo
        });
      });
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
     * 显示pdf
     */
    function showPdfDialog(params) {
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
    /**
     * 证书操作日志
     */
    function operate() {
      if (!selected.length) {
        Notification.error({
          message: '请先选择证书'
        });
        return false;
      }
      if (selected.length !== 1) {
        Notification.error({
          message: '只能查看一本证书的操作日志'
        });
        return false;
      }
      var operateDialog = $modal.open({
        template: require('../../../operateLog/operateLog.html'),
        controller: require('../../../operateLog/operateLog.ctrl.js'),
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              obj: {
                sourceKey: selected[0],
                model: 'BOOKHIS'
              }
            };
          }
        }
      });
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
              bookAirDelay: params.pBookAirDelay,
              officeInfo: params.pOfficeInfo,
              goodsType: params.pAgentShareBook.goodsType
            };
          }
        }
      });
    }
  }
];

module.exports = angular.module('app.agentAssist.proxyCert', []).controller('proxyCertCtrl', proxyCert_fn);