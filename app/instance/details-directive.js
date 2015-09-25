'use strict';

angular.module('zstackUI.instance.details-directive', [])

.directive('detailsDirective', function() {
  return {
    scope: {
      vm: '=ngModel',
    },
    templateUrl: 'instance/details-directive.html',
    controller: function($scope) {
    }
  };
});