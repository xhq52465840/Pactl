'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items',
    function($scope, $modalInstance, restAPI, items) {
        var vm = $scope;
        vm.cancel = cancel;
        vm.historys = items.historys;
        vm.title = items.title;
        /**
         * 只有是新增和修改的时候才转换为数组
         */
        for (var i = 0; i < vm.historys.length; i++) {
            if (vm.historys[i].oprnType == '新增' || vm.historys[i].oprnType == '修改') {
                var remarkArray = angular.fromJson(vm.historys[i].remarks);
                var sourceObj = angular.fromJson(vm.historys[i].source);
               debugger
                var temp = [];
                if (sourceObj.namesEn && sourceObj.namesEn) {
                    var productName = '英文品名:' + sourceObj.namesEn;
                    if(sourceObj.namesCn) {
                        productName += ',中文品名:' + sourceObj.namesCn;
                    }
                    if(sourceObj.dest) {
                        productName += ',目的港:' + sourceObj.dest;
                    }
                    temp.push(productName);
                };
                // 和后台确认，没有remarks是因为用户新增时没有附加文件，这时remarkArray设置为空数组
                if (!remarkArray) {
                    remarkArray = [];
                };
                for (var j = 0; j < remarkArray.length; j++) {
                    if (remarkArray[j].type == 'type') {
                        // temp.push("产品说明:" + remarkArray[j].oldName);
                        temp.push("<a target='_blank' href=" + remarkArray[j].fileHttpPath + ">" + "产品说明:" + remarkArray[j].oldName + "</a>");
                    } else if (remarkArray[j].type == 'othertype') {
                        // temp.push("补充文档:" + remarkArray[j].oldName);
                        temp.push("<a target='_blank' href=" + remarkArray[j].fileHttpPath + ">" + "补充文档:" + remarkArray[j].oldName + "</a>");
                    }
                };
                vm.historys[i].remarkTxt = temp.join();
            }
        };
        /**
         * 取消
         */
        function cancel() {
            $modalInstance.close();
        }
    }
];
