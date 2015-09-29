'use strict';

angular.module('zstackUI.instance.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util',
     'zstackUI.instance.modal.controller'])

.directive('instanceDetailsDirective', ['ZStackApi', 'ZStackUtil', '$window', function(ZStackApi, ZStackUtil, $window) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'instance/details_directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      $scope.console = function() {
        ZStackApi.getConsole($scope.data.uuid)
        .then(function(result) {
          console.log(result)
          $window.open("console/vnc_auto.html?host=" + result.inventory.hostname +
              "&port=" + result.inventory.port + 
              "&token=" + result.inventory.token)
        }, function(reason) {
          console.log(reason)
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
    }
  };
}])