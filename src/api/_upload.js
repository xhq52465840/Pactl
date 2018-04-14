'use strict';

module.exports = ['Upload', '$rootScope', 'Notification',
  function (Upload, $rootScope, Notification) {
    return {
      _upload: function (file, callback, url, type) {
        $rootScope.loading = true;
        Upload.upload({
          url: url,
          data: {
            file: file,
            type: type
          }
        }).then(function (resp) {
          $rootScope.loading = false;
          if (resp.data.avatarId || resp.data.ok) {
            callback(resp);
            Notification.success({
              message: '文件上传成功'
            });
          } else {
            Notification.error({
              message: '文件上传失败'
            });
          }
        }, function (resp) {
          Notification.error({
            message: '文件上传失败'
          });
        });
      }
    }
  }
];