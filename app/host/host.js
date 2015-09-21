'use strict';

angular.module('zstackUI.host', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.host', {
    url: '/host',
    templateUrl: 'host/host.html',
    controller: 'HostCtrl'
  });
}])

.controller('HostCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
  ZStackApi.debugLogin(function() {
    ZStackApi.queryHost()
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });
  });
}])