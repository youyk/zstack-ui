'use strict';

angular.module('zstackUI.image.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('imageDetailsDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/image/details_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      function operationCb(result) {
        $scope.data.state = result.inventory.state;
      }

      $scope.enable = function() {
        ZStackApi.enableImage($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Enabling";
      }

      $scope.disable = function() {
        ZStackApi.disableImage($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Disabling";
      }

      $scope.delete = function() {
        ZStackApi.deleteImage($scope.data.uuid)
        .then(function() {
          $scope.$emit("update:list");
        })
      }

      $scope.$on("child-dialog:close", function(_, msg) {
        console.log(msg)
        if (!ZStackUtil.notNullnotUndefined(msg))
          return;
        switch (msg.name) {
          case "host":
            ZStackApi.migrateVm(msg.data.uuid, $scope.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });;
            break;
          case "instanceOffering":
            ZStackApi.changeInstanceOffering(msg.data.uuid, $scope.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });;
            break;
          case "dataVolume":
            ZStackApi.attachVolume(msg.data.uuid, $scope.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });
            break;
          case "currentDataOffering":
            ZStackApi.detachVolume(msg.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });;
            break;
          default:
            break;
        }

        $scope.showDialog = true;
      })
    }]
  };
}])