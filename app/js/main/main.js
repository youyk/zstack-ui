'use strict';

angular.module('zstackUI.main', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'js/main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', function($scope) {
}]);