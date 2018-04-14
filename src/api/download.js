'use strict';

module.exports = [
  function () {
    return {
      downloadFile: function (fileId, url) {
        var form = $("<form>");
        form.attr('style', 'display:none');
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', url);
        var input = $('<input>');
        input.attr('type', 'hidden');
        input.attr('name', 'fileId');
        input.attr('value', fileId);
        $('body').append(form);
        form.append(input);
        form.submit();
        form.remove();
      }
    }
  }
];