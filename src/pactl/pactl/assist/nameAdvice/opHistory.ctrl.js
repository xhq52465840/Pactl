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
            // 和后台确认，没有remarks是因为用户新增时没有附加文件，这时直接return出去
            if (!vm.historys[i].remarks) {
                return
            };
            if (vm.historys[i].oprnType == '删除') {
                var remarkArray = angular.fromJson(vm.historys[i].remarks);
                var sourceObj = angular.fromJson(vm.historys[i].source);
                var temp = [];
                if (sourceObj.namesEn && sourceObj.namesEn) {
                    var productName = '英文品名:' + sourceObj.namesEn + ',中文品名:' + sourceObj.namesCn;
                    temp.push(productName);
                };
                // 和后台确认，没有remarks是因为用户新增时没有附加文件，这时remarkArray设置为空数组
                if (!remarkArray) {
                    remarkArray = [];
                };
                for (var j = 0; j < remarkArray.length; j++) {
                    if (remarkArray[j].type == 'type') {
                        // temp.push("产品说明:" + remarkArray[j].oldName);
                        temp.push("产品说明:" +
                            "<a target='_blank' href=" + remarkArray[j].fileHttpPath + ">" + remarkArray[j].oldName + "</a>");
                    } else if (remarkArray[j].type == 'othertype') {
                        temp.push("补充文档:" +
                            "<a target='_blank' href=" + remarkArray[j].fileHttpPath + ">" + remarkArray[j].oldName + "</a>");
                    }
                };
                vm.historys[i].remarkTxt = temp.join();
            } else if (vm.historys[i].oprnType == '咨询结果确认') {
                vm.historys[i].remarks = vm.historys[i].remarks.substring(3, vm.historys[i].remarks.length);
                var remarksArray = angular.fromJson(vm.historys[i].remarks);
                if (!remarksArray) {
                    remarksArray = [];
                };
                var temp = [];
                for (var j = 0; j < remarksArray.length; j++) {
                    temp.push(remarksArray[j].name);
                };
                if (temp.length === 0) {
                    vm.historys[i].remarkString = "结论:无";
                } else {
                    vm.historys[i].remarkString = "结论:" + temp.join();
                }
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
