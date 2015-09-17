'use strict';

angular.module('zstackUI.login', ['zstackUI.services.api'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.login = function() {
    ZStackApi.debugLogin();
  }
}]);