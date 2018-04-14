'use strict';

var retentCert_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope','ipCookie',
  function ($scope, Page, restAPI, $modal, Notification, $rootScope,ipCookie) {
    var vm = $scope;
    var selected = [];
    vm.add = add;
    //终极修改
    vm.page = Page.initPage();
    vm.pageChangedTest = pageChangedTest;
    vm.openDialog = openDialog;
    //终极修改
    vm.agentSalesData = [];
    vm.audit = audit;
    vm.certObj = {};
    vm.certData = [];
    vm.clean = clean;
    vm.remove = remove;
    vm.receive = receive;
    vm.receiveNo = receiveNo;
    vm.retent = retent;
    vm.openDialog = openDialog;
    vm.agentSales = {};
    vm.changeAgentSales = changeAgentSales;
    vm.allPages = [];
    vm.certData = [];
    vm.muchPage=0
    vm.allPagesLength=0
    vm.searchPages1=searchPages1
    getAgentData();
    vm.addArray=[];
    vm.pageChanged=pageChanged
    	/******
    	 * 根据页码跳转对应的页面
    	 * **/
    function pageChanged(){	
    	// console.log("qwqw")
    }
    /**
     * 翻页
     */
    function pageChangedTest() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 添加证书
     */
    function add() {
    	
      if (!vm.certObj.agentSales || !vm.certObj.bookNo) {
        Notification.error({
          message: '未填写操作代理或鉴定证书编号'
        });
        vm.certObj.bookNo = '';
        return false;
      }
      /**
       * @desc 查询之前做重复判断
       */
      /*if($.inArray(vm.certObj.bookNo,vm.addArray) != -1){
    	  return false;
      }else{
    	  vm.addArray.push(vm.certObj.bookNo);
      }*/
      
      $rootScope.loading = true;
      
      var obj = {};
      obj.bookNo = vm.certObj.bookNo;
      obj.agentOprnId = vm.certObj.agentSales.id;
      restAPI.book.recent.save({}, obj)
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.certObj.bookNo = '';
          if (resp.ok && resp.data) {
        	  resp.data.forEach( function(v,k) {
        		  var status = true;
        		  if(vm.allPages.length > 0){
        			  vm.allPages.forEach( function(item,index) {
        				  if(item.pAgentShareBook.bookId == v.pAgentShareBook.bookId){
        					  status = false;
        				  }
        			  })
        		  }else{
        			  //vm.allPages.push(v);
        		  }
        		  if(status){
        			  vm.allPages.unshift(v);
        		  }
        	  })
        	  searchPages1()
        	  vm.allPagesLength=vm.allPages.length
        	  vm.muchPage=Math.ceil(vm.allPages.length/ vm.page.length)        	
            angular.forEach( vm.allPages, function (v, k) {
              var index = selected.indexOf(v.pAgentShareBook.bookId);
              if (index < 0) {
                selected.push(v.pAgentShareBook.bookId);
                if(vm.page.length > k){
                	vm.certData.unshift(v);
                }
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
                  v.pAgentShareBook.authBookSerialNo = m.authBookSerialNo;
                  v.pAgentShareBook.startTime = m.startTime;
                  v.pAgentShareBook.endTime = m.endTime;
                });
              }
            });
          } else {
            Notification.error({
              message: '未查到数据,数据已操作或数据已禁用'
            });
          }
        });
     // debugger
    }
    
    /**
     * 手动分页
     * 
     * 
     * */
  //  searchPages(page.length)
    function searchPages1(){
    	 vm.certData = []
    	 vm.allPagesLength=vm.allPages.length
    	 vm.muchPage=Math.ceil(vm.allPagesLength/ vm.page.length) 
    	 vm.allPages.forEach( function(v,k){
    		 if(vm.page.length > k){
    			 vm.certData.push(v);
    		 }
    	 })
             angular.forEach( vm.certData, function (v, k) {
            	 
                 var index = selected.indexOf(v.pAgentShareBook.bookId);
                 if (index < 0) {
             
                   selected.push(v.pAgentShareBook.bookId);
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
                     v.pAgentShareBook.authBookSerialNo = m.authBookSerialNo;
                     v.pAgentShareBook.startTime = m.startTime;
                     v.pAgentShareBook.endTime = m.endTime;
                   });
                 }
               });
             
    } /**
     *点击分页
     */
    function pageChanged(){
   	 vm.certData = []
	 vm.muchPage=Math.ceil(vm.allPagesLength/ vm.page.length) 	
	 vm.allPages.forEach( function(v,k){
		 var start =(vm.page.currentPage-1)*vm.page.length ;
		 if(k>=(vm.page.currentPage-1)*vm.page.length &&k<vm.page.currentPage*vm.page.length ){
			 vm.certData.push(v);
		 }
		
	 })
	 angular.forEach( vm.certData, function (v, k) {
             var index = selected.indexOf(v.pAgentShareBook.bookId);
             if (index < 0) {
               selected.push(v.pAgentShareBook.bookId);
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
                 v.pAgentShareBook.authBookSerialNo = m.authBookSerialNo;
                 v.pAgentShareBook.startTime = m.startTime;
                 v.pAgentShareBook.endTime = m.endTime;
               });
             }
           });
    }
 //   function selectPage(){console.log("ssaaaaaaaa")}
    /**
     * 获取操作代理
     */
    function getAgentData() {
      $rootScope.loading = true;
      restAPI.agent.listOper.query({}, {})
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          vm.agentSalesData = resp;
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
        });
    }
    /**
     * 授权操作
     */
    function audit() {
      if (!selected.length) {
        Notification.error({
          message: '没有需要操作的数据'
        });
        return false;
      }
      var year1 = '';
      for (var index = 0; index < vm.certData.length; index++) {
        var element = vm.certData[index];
        if (!year1) {
          year1 = element.pAgentShareBook.validityYear;
        } else {
          if (year1 !== element.pAgentShareBook.validityYear) {
            Notification.error({
              message: '所选的证书年份不一样,不允许同时授权'
            });
            return false;
          }
        }
      }
      var auditDialog = $modal.open({
        template: require('./auditDialog.html'),
        controller: require('./auditDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              year: year1
            };
          }
        }
      });
      auditDialog.result.then(function (data) {
        var obj = {};
        obj.bookId = selected.join(';');
        /*  angular.forEach( vm.certData, function (v, k) {
            	 
                 var index = selected.indexOf(v.pAgentShareBook.bookId);
                 if (index < 0) {
             
                   selected.push(v.pAgentShareBook.bookId);*/
        console.log(selected)
        obj.startTime = data.validilyStart;
        obj.endTime = data.validilyEnd;
        obj.agentOprnId = vm.certObj.agentSales.id;
        obj.agentOprn = vm.certObj.agentSales.code;
        obj.authBookFlag = data.authBookFlag ? '1' : '0';
        $rootScope.loading = true;
        restAPI.book.accagentoprn.save({}, obj)
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              setData(resp.data);
              Notification.success({
                message: '授权操作成功!'
              });
            } else {
              Notification.error({
                message: resp.msg + '或部分证书已授权'
              });
            }
          });
      }, function () {

      });
    }
    /**
     * 显示授权后的信息
     * 
     * @param {any} data
     */
    function setData(data) {
      for (var i = 0; i < data.length; i++) {
        var v = data[i];
        if (i === 0) {
          showAuditInfo(v.authBookSerialNo);
        }
        for (var index = 0; index < vm.allPages.length; index++) {
          var k = vm.allPages[index];
          if (v.bookId === k.pAgentShareBook.bookId) {
            k.pAgentShareBook.startTime = v.startTime;
            k.pAgentShareBook.endTime = v.endTime;
            k.pAgentShareBook.authBookSerialNo = v.authBookSerialNo;
          }
        }
      }
    }
    /**
     * 
     */
    function showAuditInfo(data) {
      var auditInfoDialog = $modal.open({
        template: require('./auditInfo.html'),
        controller: require('./auditInfo.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              authBookSerialNo: data
            };
          }
        }
      });
    }
    /**
     * 清空操作列表
     */
    function clean() {
      if (vm.certData.length === 0) {
        return;
      }
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              content: '确定要清空操作列表?'
            };
          }
        }
      });
      delDialog.result.then(function () {
        selected.length = 0;
        vm.certData.length = 0;
      }, function () {});
    }

    /**
     * 更换操作代理
     */
    function changeAgentSales(isRemove) {
      if (vm.certData.length === 0) {
        vm.agentSales = vm.certObj.agentSales;
        return;
      }
      var oper = isRemove ? "删除" : "更换";
      if (vm.agentSales !== vm.certObj.agentSales) {
        var delDialog = $modal.open({
          template: require('../../../remove/remove.html'),
          controller: require('../../../remove/remove.ctrl.js'),
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            items: function () {
              return {
                content: '确定要' + oper + '操作代理吗？' + oper + '后会清空操作列表。'
              };
            }
          }
        });
        delDialog.result.then(function () {
        	vm.allPages=[];
        	vm.allPagesLength=0;
        	vm.muchPage=0
          vm.agentSales = vm.certObj.agentSales;
          selected.length = 0;
          vm.certData.length = 0;
        }, function () {
        
          vm.certObj.agentSales = vm.agentSales;
        });
      }
    }
    /**
     * 先校验
     * 
     * 返回false时，提示先做授权
     * 返回ok ,收正本
     */
    function receive(data) {
      $rootScope.loading = true;
      restAPI.book.checkBookByOprn.save({}, {
          bookId: data.bookId,
          agentOprnId: vm.certObj.agentSales ? vm.certObj.agentSales.id : ''
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            doReceive(data);
          } else {
            Notification.error({
              message: resp.msg
            });
          }
        });
    }
    /**
     * 收到正本
     * 
     * @param {any} data
     */
    function doReceive(data) {
      var receiveDialog = $modal.open({
        template: require('./receiveDialog.html'),
        controller: require('./receiveDialog.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              obj: {
                bookId: data.bookId,
                bookNo: data.bookNo,
                agentOprn: vm.certObj.agentSales.code,
                officeName: data.officeName
              }
            };
          }
        }
      });
      receiveDialog.result.then(function (resp) {
        data.bookSerialNumber = resp;
      }, function () {

      });
    }
    /**
     * 取消收到正本
     */
    function receiveNo(data) {
      var receiveNoDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '操作提示',
              content: '你将要取消收到正本。'
            };
          }
        }
      });
      receiveNoDialog.result.then(function () {
        $rootScope.loading = true;
        restAPI.book.receiveBook.save({}, {
            bookId: data.bookId,
            auditStatus: '102'
          })
          .$promise.then(function (resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              data.bookSerialNumber = '';
              Notification.success({
                message: '取消成功'
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
     * 留存完成
     */
    function retent(data) {
      $rootScope.loading = true;
      restAPI.book.recentBook.save({}, {
          bookId: data.bookId
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            data.auditStatus = resp.data.auditStatus;
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
    function remove(item) {
    	vm.allPages.forEach( function(v,k){
    		if(v.pAgentShareBook.bookId == item.pAgentShareBook.bookId){
    		vm.allPages.splice(k,1);
    		}
    		 
    	})
    	vm.certData=vm.allPages.slice(vm.page.length*(vm.page.currentPage-1),vm.page.length*vm.page.currentPage)
    	
      var index = selected.indexOf(item.pAgentShareBook.bookId);
      selected.splice(index, 1);
     vm.allPagesLength--
     if(vm.allPagesLength<=0){
    	 vm.muchPage=0
    	 vm.allPagesLength=0
     }else{
	  vm.muchPage=Math.ceil(vm.allPages.length/ vm.page.length) }
     /**var clearFlag =index-vm.page.length*(vm.page.currentPage-1);
     if(clearFlag<0){
    	 clearFlag=index
     }else{
    	 clearFlag=index-vm.page.length*(vm.page.currentPage-1);
     }
     
     vm.certData.splice(clearFlag, 1)
    **/
	 angular.forEach( vm.certData, function (v, k) {
         var index = selected.indexOf(v.pAgentShareBook.bookId);
         if (index < 0) {
           selected.push(v.pAgentShareBook.bookId);
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
             v.pAgentShareBook.authBookSerialNo = m.authBookSerialNo;
             v.pAgentShareBook.startTime = m.startTime;
             v.pAgentShareBook.endTime = m.endTime;
           });
         }
       });
    // debugger
    }
    /**
     * 显示pdf
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

module.exports = angular.module('app.pactlAssist.retentCert', []).controller('retentCertCtrl', retentCert_fn);