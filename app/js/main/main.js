'use strict';

angular.module('zstackUI.main', [])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/main', '/main/dashboard');
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'js/main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$state', function($scope, $state) {
  // $state.go('main.dashboard')
}]);