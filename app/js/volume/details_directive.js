'use strict';

angular.module('zstackUI.volume.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('volumeDetailsDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/volume/details_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      $scope.$on("child-dialog:close", function(_, msg) {
        console.log(msg)
        if (!ZStackUtil.notNullnotUndefined(msg))
          return;
        ZStackApi.attachVolume($scope.data.uuid, msg.data.uuid);

      })
    }]
  };
}])