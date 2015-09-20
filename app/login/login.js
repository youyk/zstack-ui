'use strict';

angular.module('zstackUI.login', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.login = function() {
    ZStackApi.debugLogin();
  }
}]);