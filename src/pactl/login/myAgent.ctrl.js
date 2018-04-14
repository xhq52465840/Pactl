'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
  function ($scope, $modalInstance, restAPI, items, $rootScope) {
    var vm = $scope;
    var allOrg = {};
    var myUnits = {};
    vm.cancel = cancel;
    vm.save = save;
    vm.orgData = [];
    vm.orgObj = {};

    getAgent();

    /**
     * 获取组织机构
     */
    function getAgent() {
      $rootScope.loading = true;
      restAPI.agent.myUnits.get({
          token: items.token
        })
        .$promise.then(function (resp) {
          $rootScope.loading = false;
          myUnits = resp.myUnit;
          angular.forEach(resp.units, function (v, k) {
            vm.orgData.push({
              id: v.id,
              code: v.code,
              name: v.name,
              unitType: v.unitType,
              description: v.description,
              type: getOpType(v.unitType),
              avatarUrl: v.avatarUrl
            });
          });
          if (vm.orgData.length === 1) {
            vm.orgObj.org = vm.orgData[0];
            save();
          }
        });
    }
    /**
     * 根据类型返回组织类型
     */
    function getOpType(type) {
      var name = '';
      switch (type) {
        case 'agency':
          name = '操作代理';
          break;
        case 'salesAgent':
          name = '子账户';
          break;
        case 'terminal':
          name = 'pactl用户';
          break;
        case 'security':
          name = '安检';
          break;
        case 'airline':
          name = '航空公司';
          break;
      }
      return name;
    }
    /**
     * 保存
     */
    function save() {
    	  $rootScope.lastTimeFlag=true;
      if (vm.orgObj.org) {
        vm.orgObj.org.myUnit = myUnits.id;
        vm.orgObj.org.myUnitCode = myUnits.code;
        $modalInstance.close(vm.orgObj.org);
      
      }
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
];