'use strict';

angular.module('zstackUI.volume',
  [
    'zstackUI.volume.modal.controller',
    'zstackUI.volume.details',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.volume', {
    url: '/volume',
    templateUrl: 'volume/volume.html',
    controller: 'VolumeCtrl'
  });
}])

.controller('VolumeCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.queryList = function() {
    ZStackApi.queryVolume()
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
        for (var i in $scope.itemList) {
          $scope.itemList[i].collapsed = true;
        }
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