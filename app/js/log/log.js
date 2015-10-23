'use strict';

angular.module('zstackUI.log', ['zstackUI.services.api', 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('log', {
    url: '/log',
    templateUrl: 'js/log/log.html',
    controller: 'LogCtrl'
  });
}])

.controller('LogCtrl', ['$scope', 'ZStackApi', '$state', function($scope, ZStackApi, $state) {
  $scope.msgList = window.msgList;
}]);