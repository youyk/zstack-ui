'use strict';

angular.module('zstackUI.volume', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.volume', {
    url: '/volume',
    templateUrl: 'volume/volume.html',
    controller: 'VolumeCtrl'
  });
}])

.controller('VolumeCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  ZStackApi.debugLogin(function() {
    ZStackApi.queryVolume([])
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });
  });
}])