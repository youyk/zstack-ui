'use strict';

angular.module('zstackUI.host.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('hostDetailsDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/host/details_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      function operationCb(result) {
        $scope.data.state = result.inventory.state;
        $scope.data.status = result.inventory.status;
      }

      $scope.enable = function() {
        ZStackApi.enableHost($scope.data.uuid)
        .then(operationCb);
        $scope.data.state = "Enabling";
      }

      $scope.disable = function() {
        ZStackApi.disableHost($scope.data.uuid)
        .then(operationCb);
        $scope.data.state = "Disabling";
      }

      $scope.reconnect = function() {
        ZStackApi.reconnectHost($scope.data.uuid)
        .then(function() {
          $scope.data.status = "Connected";
        })
        $scope.data.status = "Reconnecting";
      }

      $scope.maintain = function() {
        ZStackApi.maintainHost($scope.data.uuid)
        .then(operationCb);
        $scope.data.state = "PreMaintenance";
      }

      $scope.delete = function() {
        ZStackApi.deleteHost($scope.data.uuid)
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