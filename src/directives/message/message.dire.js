'use strict';

module.exports = ['$document', '$rootScope', 'Page', 'Auth', 'restAPI', '$interval', 'Notification', '$modal','ipCookie',
  function ($document, $rootScope, Page, Auth, restAPI, $interval, Notification, $modal,ipCookie) {
    return {
      restrict: 'EA',
      template: require('./message.html'),
      controller: ['$scope','$rootScope',function ($scope,$rootScope) {
        var vm = $scope;
        vm.allMsg = {};
        vm.backToList = backToList;
        vm.closeMsg = closeMsg;
        vm.contentDetail = {};
        vm.displayContent = displayContent;
        vm.listMsg = listMsg;
        vm.page = Page.initPage();
        vm.page.length = 5;
        vm.pageChanged = pageChanged;
        vm.search = search;
        vm.showMsg = showMsg;
        vm.showContent = false;
        vm.totalMsg = 0;
        vm.id = '';
        vm.delMessage = delMessage;
        vm.delAllMsg = delAllMsg;
        listMsg();
        search();
        vm.showThis = true
        //显示小铃铛
        xiaoLD();
      function xiaoLD(){
      	if(Auth.getUnitType()=='agency'){
        	if(ipCookie("xiaoLD")=='0'){        		
        			vm.showThis=Number(ipCookie("xiaoLD"))
        	}
        }      
        }
       /* getD();
	    function getD(){
	    	restAPI.UIdisplay.beSubmitted.save().$promise.then(function(resp){
	    	
	    	
	    		if(resp.data.eWaybill){
	    			vm.showThis=false;
	    			//console.log(resp.data.eWaybill)
	    			//vm.listNumber=resp.data.eWaybill
	    			localStorage.setItem("ewWaybillNumber",resp.data.eWaybill) 
	    		}
	    	})
	    };*/
        /**
         * 所有未读信息
         */
        function listMsg() {
          restAPI.msgTemp.getMsg.save({}, {
              recId: Auth.getId() + ''
            })
            .$promise.then(function (resp) {
              vm.totalMsg = resp.total;
            });
        }
        /**
         * 查询
         */
        function search() {
          var obj = getCondition();
          restAPI.msgTemp.getMsgList.save({}, obj)
            .$promise.then(function (resp) {
              vm.allMsg = [];
              angular.forEach(resp.rows, function (v, k) {
                v.titleContent = String(v.content).replace(/<[^>]+>/gm, '')
                if (v.titleContent.length > 26) {
                  v.titleContent = v.titleContent.substr(0, 26) + '...';
                } else {
                  v.titleContent = v.titleContent;
                }
                vm.allMsg.push(v);
              });
              Page.setPage(vm.page, resp);
            });
        }
        /**
         * 获取查询条件
         */
        function getCondition() {
          var obj = {
            rows: vm.page.length,
            page: vm.page.currentPage,
            recId: Auth.getId() + ''
          };
          return obj;
        }
        /**
         * 消息
         */
        function showMsg() {
          vm.showDownMsg = true;
        }
        /**
         * 消息
         */
        function closeMsg() {
          vm.showDownMsg = false;
        }
        /**
         * 翻页
         */
        function pageChanged() {
          Page.pageChanged(vm.page, search);
        }
        /**
         * 显示具体内容
         */
        function displayContent(params) {
          restAPI.msgTemp.readMsg.save({}, {
              id: params.id
            })
            .$promise.then(function (resp) {
              listMsg();
              params.isRead = '1';
              vm.showContent = true;
              vm.contentDetail = angular.copy(params);
              vm.id = params.id;
            });
        }
        /**
         * 返回列表
         */
        function backToList() {
          vm.showContent = false;
        }
        /**
         * 删除消息
         */
        function delMessage() {
          restAPI.msgTemp.delMsg.save({}, {
              id: vm.id
            })
            .$promise.then(function (resp) {
              if (resp.ok) {
                backToList();
                search();
              } else {
                Notification.warning({
                  message: resp.msg
                });
              }
            });
        }
        /**
         * 删除消息
         */
        function delAllMsg() {
          var delDialog = $modal.open({
            template: require('../../pactl/remove/remove.html'),
            controller: require('../../pactl/remove/remove.ctrl.js'),
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              items: function () {
                return {
                  title: '删除全部消息',
                  content: '你将要删除全部消息。此操作不能恢复。'
                };
              }
            }
          });
          delDialog.result.then(function () {
            restAPI.msgTemp.delAllMsg.save()
              .$promise.then(function (resp) {
                if (resp.ok) {
                  vm.allMsg = [];
                  vm.totalMsg = 0;
                } else {
                  Notification.warning({
                    message: resp.msg
                  });
                }
              });
          }, function () {

          });
        }
      }],
      link: function (scope, element, attrs) {
        scope.timer = $interval(function () {
          scope.search();
          scope.listMsg();
        }, 60 * 1000);
        scope.$on('$destroy', function () {
          $interval.cancel(scope.timer);
        });
      }
    }
  }
];