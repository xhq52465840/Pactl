'use strict';

module.exports = [
  function () {
    return {
      exp: function (object, url) {
        var form = $("<form>");
        form.attr('style', 'display:none');
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', url);
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            var element = object[key];
            var input = $('<input>');
            input.attr('type', 'hidden');
            input.attr('name', key);
            input.attr('value', element);
            form.append(input);
          }
        }
        $('body').append(form);
        form.submit();
        form.remove();
      }
    }
  }
];