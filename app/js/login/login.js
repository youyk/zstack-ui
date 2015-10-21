'use strict';

angular.module('zstackUI.login', ['zstackUI.services.api', 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'js/login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', 'ZStackApi', '$state', function($scope, ZStackApi, $state) {
  $scope.login = function() {
    ZStackApi.login($scope.username, CryptoJS.SHA512($scope.password).toString(), function() {
      $state.go('main.dashboard');
    });
  }
}]);