'use strict';

angular.module('zstackUI.image',
    [
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.image', {
    url: '/image',
    templateUrl: 'image/image.html',
    controller: 'ImageCtrl'
  });
}])
.controller('ImageCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', 
                                 function($scope, ZStackApi, ZStackUtil) {
  $scope.ZStackUtil = ZStackUtil;

  ZStackApi.debugLogin(function() {
    ZStackApi.queryImage([])
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.imageList = data.inventories;
      });
    })
  });
}])