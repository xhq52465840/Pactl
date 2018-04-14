'use strict';

module.exports = ['$scope', '$modalInstance', 'restAPI', 'items', '$rootScope',
    function($scope, $modalInstance, restAPI, items, $rootScope) {
        var vm = $scope;
        vm.cancel = cancel;

        /**
         * 关闭二维码窗口
         */
        function cancel(promise) {
            $modalInstance.close(promise);
        }
        /**
         * 请求成功时向后台发送sceneId
         */
        var requestSceneId = function(sceneId) {
            if (sceneId) {
                restAPI.requestSceneId.get({
                    sceneId: sceneId
                }).$promise.then(function(resp) {
                    if (resp.ok) {
                        cancel(resp);
                    } else {
                        cancel();
                    }
                });
            } else {
                cancel();
                alert('请求异常');
            }
        };
        /**
         * 超时关闭二维码
         */
        $rootScope.$on('someEvent', function(event, data) {
            if (data == '504') {
                cancel();
            }
        });
        /**
         * 获取二维码
         */
        function createQrCode() {
            restAPI.createQrCode.get({}).$promise.then(function(resp) {
                if (resp.success) {
                    $scope.wechatUrl = resp.url;
                    requestSceneId(resp.scene_id);
                } else {
                    alert('二维码请求异常，请重试');
                }
            });
        };
        createQrCode();
    }
];
