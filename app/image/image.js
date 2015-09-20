'use strict';

angular.module('zstackUI.image',
    [
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/image', {
    templateUrl: 'image/image.html',
    controller: 'ImageCtrl'
  });
}])

.controller('ImageCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', 
                                 function($scope, ZStackApi, ZStackUtil) {
  $scope.ZStackUtil = ZStackUtil;

  var msg = {
    'org.zstack.header.image.APIQueryImageMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: []
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryImageMsg");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.imageList = data.inventories;
      });
    })
  });
}])