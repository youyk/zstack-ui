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
    templateUrl: 'js/instance/details_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      $scope.console = function() {
        ZStackApi.getConsole($scope.data.uuid)
        .then(function(result) {
          console.log(result)
          $window.open("vendor/console/vnc_auto.html?host=" + result.inventory.hostname +
              "&port=" + result.inventory.port + 
              "&token=" + result.inventory.token)
        }, function(reason) {
          console.log(reason)
        })
      }

      function operationCb(result) {
        $scope.data.state = result.inventory.state;
      }

      $scope.start = function() {
        ZStackApi.startVm($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Starting";
      }

      $scope.stop = function() {
        ZStackApi.stopVm($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Stopping";
      }

      $scope.reboot = function() {
        ZStackApi.rebootVm($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Rebooting";
      }

      $scope.destroy = function() {
        ZStackApi.destroyVm($scope.data.uuid)
        .then(function(result) {
          $scope.$emit("update:list");
        });
        $scope.data.state = "Removing";
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