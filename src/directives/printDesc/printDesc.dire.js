module.exports = function ($parse, $timeout) {
  return {
    restrict: 'A',
    template: require('./printDesc.html'),
    link: function ($scope, element, attrs, ngModel) {

    }
  };
};