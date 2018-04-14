'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'restAPI', '$rootScope', 'Notification', 'Auth', 'Download',
  function($scope, $modalInstance, items, restAPI, $rootScope, Notification, Auth, Download) {
    var vm = $scope;
    vm.airData = [];
    vm.airportData = [];
    vm.cancel = cancel;
    var goodsId = items.goodsId;
    vm.isSonBill = items.isSonBill;
    vm.records = [];
    vm.refer = {};
    vm.title = items.title;
    vm.save = save;
    vm.downloadFile = downloadFile;

    getAirData();
    getStatus();
    /**
     * 获取状态
     */
    function getStatus() {
      $rootScope.loading = true;
      restAPI.baseData.queryAll.save({}, {
          type: '1476067968303634'
        })
        .$promise.then(function(resp) {
          vm.statusData = resp.rows;
        });
    }
    /**
     * 获取航空公司
     */
    function getAirData() {
      $rootScope.loading = true;
      restAPI.airData.queryAll.save({}, {})
        .$promise.then(function(resp) {
          angular.forEach(resp.data, function(v, k) {
            vm.airData.push({
              airCode: v.airCode,
              airName: v.airName
            });
          });
          searchGoodId();
        });
    }
    /**
     * 获取数据
     */
    function searchGoodId() {
      restAPI.goodsId.goodsIdSet.save({}, {
          goodsId: goodsId
        })
        .$promise.then(function(resp) {
          $rootScope.loading = false;
          if (resp.ok) {
            var data = resp.data.pGoodsAdvice;
            getAirportData(resp);
          } else {
            Notification.error({
              message: '未查到数据'
            });
          }
        });
    }
    /**
     * 获取目的港（机场）
     */
    function getAirportData(resp) {
      var data = resp.data.pGoodsAdvice;
      if (data.dest) {
        restAPI.airData.getDataByCode.save({}, data.dest)
          .$promise.then(function(resp2) {
            if (resp2.data) {
              vm.refer.dest = resp2.data;
            }
            setLeftData(resp);
            setRightData(resp);
          });
      } else {
        setLeftData(resp);
        setRightData(resp);
      }

    }
    /**
     * 显示左边数据
     */
    function setLeftData(resp) {
      var data = resp.data.pGoodsAdvice,
        files = resp.data.fileRelation;
      vm.refer.status = data.status;
      vm.refer.airLines = [];
      angular.forEach(data.airLines && data.airLines.split(';'), function(v, k) {
        if (v !== '') {
          for (var i = 0; i < vm.airData.length; i++) {
            if (v === vm.airData[i].airCode) {
              if (k === 0) {
                vm.refer.airLine1 = vm.airData[i];
              } else if (k === 1) {
                vm.refer.airLine2 = vm.airData[i];
              } else if (k === 2) {
                vm.refer.airLine3 = vm.airData[i];
              }
              return false;
            }
          }
        }
      });
      vm.refer.namesEn = data.namesEn;
      vm.refer.namesCn = data.namesCn;
      vm.refer.agentSales = data.agentSales;
      vm.refer.goodsId = goodsId;

      try {
        vm.refer.productDesc = JSON.parse(data.productDesc);
      } catch (error) {
        vm.refer.productDesc = '';
      }

      for (var i = 0; i < files.length; i++) {
        if (files[i].type == 'type') {
          vm.refer.remoteFilename1 = {
            name: files[i].oldName,
            id: files[i].fileId,
          };
          vm.refer.showRemoteFilename1 = true;
        } else {
          vm.refer.remoteFilename2 = {
            name: files[i].oldName,
            id: files[i].fileId,
          };
          vm.refer.showRemoteFilename2 = true;
        }
      }

      try {
        vm.results = data.result ? JSON.parse(data.result) : [];
      } catch (e) {
        vm.results = [];
      }
    }
    /**
     * 显示右边数据
     */
    function setRightData(resp) {
      var records = resp.data.pGoodsKnowsAnswers,
        data = [],
        j = 0,
        index = false;
      for (var i = 0; i < records.length; i++) {
        data[j] = data[j] || [];
        if (records[i].type === '1') {
          if (index) {
            j++;
            data[j] = [];
            index = false;
          }
          data[j].push(records[i]);
        } else {
          if (!index) {
            index = true;
          }
          data[j].push(records[i]);
        }
      }
      vm.records = data;
    }
    /**
     * 继续退回
     */
    function save() {
      $modalInstance.close();
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }
    /**
     * 下载文件
     */
    function downloadFile(id) {
      Download.downloadFile(id, restAPI.file.downloadFile);
    }
  }
];