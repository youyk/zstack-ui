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
  
  var msg = {
    'org.zstack.header.volume.APIQueryVolumeMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: []
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryVolumeMsgRet");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.volumeList = data.inventories;
      });
    })
  });
}])