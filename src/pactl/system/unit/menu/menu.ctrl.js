'use strict';

module.exports = ['$scope', 'restAPI', '$modal', 'Notification', '$rootScope',
  function ($scope, restAPI, $modal, Notification, $rootScope) {
    var vm = $scope;
    vm.add = add;
    vm.treeData = [];
    vm.treeToggle = treeToggle;
    search();
    /**
     * 查询菜单
     */
    function search() {
 
    }
    /**
     * 展开子节点
     * 
     * @param {any} scope
     */
    function treeToggle(scope) {
      scope.toggle();
    }
    /**
     * 根据维度增加明细
     * 
     */
    function add() {
      var addDialog = $modal.open({
        // template: require('./addMenu.html'),
        // controller: require('./addMenu.ctrl.js'),
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          items: function () {
            return {
              title: '添加菜单',
              obj: {

              }
            };
          }
        }
      });
      addDialog.result.then(function (data) {

      }, function (resp) {

      });      
    }
    /**
     * 增加子节点
     * 
     * @param {any} scope
     */
    function addSubItem(scope) {
 
    }
    /**
     * 编辑节点信息
     * 
     * @param {any} scope
     */
    function editItem(scope) {

    }
    /**
     * 删除节点
     * 
     * @param {any} scope
     */
    function removeItem(scope) {

    }
  }
];