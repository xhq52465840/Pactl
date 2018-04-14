'use strict';

var printBattery_fn = ['$scope', 'restAPI', 'Auth', '$window', '$state', '$stateParams', '$timeout', '$resource', 'printHtml',
  function ($scope, restAPI, Auth, $window, $state, $stateParams, $timeout, $resource, printHtml) {
    var vm = $scope;
    vm.obj = {};
    vm.showObj = {};
    vm.lang = $stateParams.lang;

    search();

    /**
     * 获取数据
     */
    function search() {
      restAPI.declare.battaryDeclare.save({}, {
          awId: $stateParams.awId
        })
        .$promise.then(function (resp) {
          if (resp.ok) {
            vm.obj = resp.data || {};
            transformData();
          }
          vm.obj.waybillNo = $stateParams.waybillNo;
          $timeout(function () {
            printHtml.print({
              top: '0.2',
              bottom: '0.2',
              left: '0.2',
              right: '0.2'
            });
          }, 1000);
        });
    }

    function transformData() {
      vm.obj.overpack = (vm.obj.overpack === '1' || vm.obj.overpack === true) ? true : false;
      vm.obj.eliIiOnly = (vm.obj.eliIiOnly === '1' || vm.obj.eliIiOnly === true) ? true : false;
      vm.obj.eliIbOnly = (vm.obj.eliIbOnly === '1' || vm.obj.eliIbOnly === true) ? true : false;
      vm.obj.eliIiPack = (vm.obj.eliIiPack === '1' || vm.obj.eliIiPack === true) ? true : false;
      vm.obj.eliRelation = (vm.obj.eliRelation === '1' || vm.obj.eliRelation === true) ? true : false;
      vm.obj.eliButtonFlag = (vm.obj.eliButtonFlag === '1' || vm.obj.eliButtonFlag === true) ? true : false;
      vm.obj.noeli = (vm.obj.noeli === '1' || vm.obj.noeli === true) ? true : false;
      vm.obj.elmIiOnly = (vm.obj.elmIiOnly === '1' || vm.obj.elmIiOnly === true) ? true : false;
      vm.obj.elmIbOnly = (vm.obj.elmIbOnly === '1' || vm.obj.elmIbOnly === true) ? true : false;
      vm.obj.elmIiPack = (vm.obj.elmIiPack === '1' || vm.obj.elmIiPack === true) ? true : false;
      vm.obj.elmRelation = (vm.obj.elmRelation === '1' || vm.obj.elmRelation === true) ? true : false;
      vm.obj.elmButtonFlag = (vm.obj.elmButtonFlag === '1' || vm.obj.elmButtonFlag === true) ? true : false;
      vm.obj.noelm = (vm.obj.noelm === '1' || vm.obj.noelm === true) ? true : false;
      vm.obj.lessthen5kg = (vm.obj.lessthen5kg === '1' || vm.obj.lessthen5kg === true) ? true : false;
    }
    /**
     * PI967:ELI;PI970:ELM
     * 若noeli打钩，则noeli，若eliButtonFlag打钩，则eliButtonFlag打钩；
     * 若noeli没有打钩，则不管eliButtonFlag有没有打钩，noeli和eliButtonFlag都不打钩
     */
  }
];

module.exports = angular.module('app.agentPrejudice.printY8', []).controller('printBatteryDeclaractionY8Ctrl', printBattery_fn);