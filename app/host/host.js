'use strict';

angular.module('zstackUI.host',
  [
    'zstackUI.services.api',
    'zstackUI.host.modal.controller'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.host', {
    url: '/host',
    templateUrl: 'host/host.html',
    controller: 'HostCtrl'
  });
}])

.controller('HostCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
  $scope.queryList = function() {
    ZStackApi.queryHost()
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });
  }
  ZStackApi.debugLogin(function() {
    $scope.queryList();
  });

  $scope.$on("update:list", function() {
    $scope.queryList();
  })
}])