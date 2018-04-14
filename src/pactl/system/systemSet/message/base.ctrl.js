'use strict';

var msgbase_fn = ['$scope', 'Page', 'restAPI', '$modal', 'Notification', '$rootScope',
  function($scope, Page, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.addCatalogType = addType;
    vm.addFileType = addFileType;
    vm.addMsgType = addType;
    vm.addSendType = addType;
    vm.baseObj = {
      type: '1',
      catalogData: [],
      msgData: [],
      fileData: [],
      sendData: []
    };
    vm.editFile = editFile;
    vm.editType = editType;
    vm.page = Page.initPage();
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.removeFile = removeFile;
    vm.select = select;
    vm.typeData = [];

    getTypeData();
    /**
     * 获取目录类型
     */
    function getTypeData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryList.save({}, {
          flag: '1'
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.typeData = resp.rows;
          msgTypeData();
          search();
        });
    }
    /**
     * 获取报文类型
     */
    function msgTypeData() {
      $rootScope.loading = true;
      restAPI.msgBase.queryAll.save({}, {
          flag: '3'
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.msgTypeData = resp.data;
        });
    }
    /**
     * 查询
     */
    function search() {
      if (vm.baseObj.type === '1') {
        getCatalogData();
      } else if (vm.baseObj.type === '2') {
        getSendData();
      } else if (vm.baseObj.type === '3') {
        getMsgData();
      } else if (vm.baseObj.type === '4') {
        getFileData();
      }
    }
    /**
     * 获取目录类型
     */
    function getCatalogData(type) {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.msgBase.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.baseObj.catalogData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取发报类型
     */
    function getSendData(type) {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.msgBase.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.baseObj.sendData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取报文类型
     */
    function getMsgData(type) {
      $rootScope.loading = true;
      var obj = getCondition();
      restAPI.msgBase.queryList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.baseObj.msgData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取文件目录
     */
    function getFileData(type) {
      $rootScope.loading = true;
      var obj = getCondition2();
      restAPI.msgBase.queryCatalogList.save({}, obj)
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          vm.baseObj.fileData = resp.rows;
          Page.setPage(vm.page, resp);
        });
    }
    /**
     * 获取查询条件
     */
    function getCondition() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      obj.flag = vm.baseObj.type;
      return obj;
    }
    /**
     * 收发文件目录的查询条件
     */
    function getCondition2() {
      var obj = {
        rows: vm.page.length,
        page: vm.page.currentPage
      };
      return obj;
    }
    /**
     * 翻页
     */
    function pageChanged() {
      Page.pageChanged(vm.page, search);
    }
    /**
     * 切换
     */
    function select(type) {
      vm.baseObj.type = type;
      vm.page.currentPage = 1;
      search();
    }
    /**
     * 新增类型
     */
    function addType() {
      var title = getTitle();
      var addTypeDialog = $modal.open({
        template: require('./addBase.html'),
        controller: require('./addBase.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: title,
              obj: {}
            };
          }
        }
      });
      addTypeDialog.result.then(function(data) {
        var obj = {};
        obj.code = data.code;
        obj.name = data.name;
        obj.flag = vm.baseObj.type;
        $rootScope.loading = true;
        restAPI.msgBase.addMsg.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '新增成功'
              });
              search();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 获取title
     */
    function getTitle() {
      var title = '';
      switch (vm.baseObj.type) {
        case '1':
          title = '新增目录类型';
          break;
        case '2':
          title = '新增发报类型';
          break;
        case '3':
          title = '新增报文类型';
          break;
      }
      return title;
    }
    /**
     * 编辑
     */
    function editType(params) {
      var editTypeDialog = $modal.open({
        template: require('./addBase.html'),
        controller: require('./addBase.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑：' + params.name,
              obj: {
                name: params.name,
                code: params.code
              }
            };
          }
        }
      });
      editTypeDialog.result.then(function(data) {
        $rootScope.loading = true;
        restAPI.msgBase.addMsg.save({}, {
            name: data.name,
            code: data.code,
            flag: params.flag,
            id: params.id
          })
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 删除
     */
    function remove(id, name) {
      var delDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + name,
              content: '你将要删除' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delDialog.result.then(function() {
        restAPI.msgBase.delMsg.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {});
    }
    /**
     * 新增文件目录
     */
    function addFileType() {
      var addFileTypeDialog = $modal.open({
        template: require('./addFile.html'),
        controller: require('./addFile.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '新增文件目录',
              typeData: vm.typeData,
              obj: {}
            };
          }
        }
      });
      addFileTypeDialog.result.then(function(data) {
        var obj = getFileSaveData(data);
        $rootScope.loading = true;
        restAPI.msgBase.editCatalog.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              Notification.success({
                message: '新增成功'
              });
              search();
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 编辑文件目录
     */
    function editFile(params) {
      var editFileDialog = $modal.open({
        template: require('./addFile.html'),
        controller: require('./addFile.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '编辑',
              typeData: vm.typeData,
              obj: {
                catalogAddr: params.catalogAddr,
                catalogType: params.catalogType,
                remark: params.remark ? params.remark : '',
                ftp: params.ftp,
                port: params.port,
                username: params.username,
                password: params.password,
                folder: params.folder,
                folder2: params.folder2
              }
            };
          }
        }
      });
      editFileDialog.result.then(function(data) {
        var obj = getFileSaveData(data);
        obj.id = params.id;
        $rootScope.loading = true;
        restAPI.msgBase.editCatalog.save({}, obj)
          .$promise.then(function(resp) {
            $rootScope.loading = false;
            if (resp.ok) {
              search();
              Notification.success({
                message: '编辑成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {

      });
    }
    /**
     * 获取文件目录需要的数据
     */
    function getFileSaveData(params) {
      var obj = {};
      if (params.catalogType) {
        obj.catalogType = params.catalogType.code;
      }
      obj.catalogAddr = params.catalogAddr;
      obj.remark = params.remark;
      obj.ftp = params.ftp === true ? '1' : '0';
      obj.port = params.port ? params.port : '';
      obj.username = params.username ? params.username : '';
      obj.password = params.password ? params.password : '';
      obj.folder = params.folder ? params.folder : '';
      obj.folder2 = params.folder2 ? params.folder2 : '';
      return obj;
    }
    /**
     * 删除文件目录
     */
    function removeFile(id, name) {
      var delTagDialog = $modal.open({
        template: require('../../../remove/remove.html'),
        controller: require('../../../remove/remove.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function() {
            return {
              title: '删除：' + name,
              content: '你将要删除' + name + '。此操作不能恢复。'
            };
          }
        }
      });
      delTagDialog.result.then(function() {
        restAPI.msgBase.delCatalog.save({}, {
            id: id
          })
          .$promise.then(function(resp) {
            if (resp.ok) {
              search();
              Notification.success({
                message: '删除成功'
              });
            } else {
              Notification.error({
                message: resp.msg
              });
            }
          });
      }, function() {});
    }
  }
];

module.exports = angular.module('app.systemSet.msgbase', []).controller('msgbaseCtrl', msgbase_fn);