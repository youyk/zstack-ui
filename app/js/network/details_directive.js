'use strict';

angular.module('zstackUI.network.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('networkDetailsDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/network/details_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      $scope.delete = function() {
        ZStackApi.deleteIpRange($scope.data.uuid)
        .then(function(result) {
          $scope.$emit("update:list");
        });
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