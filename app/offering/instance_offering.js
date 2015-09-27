'use strict';

angular.module('zstackUI.offering.instance',
  [
    'zstackUI.offering.instance.modal.controller',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance_offering', {
    url: '/instance_offering',
    templateUrl: 'offering/instance_offering.html',
    controller: 'InstanceOfferingCtrl'
  });
}])

.controller('InstanceOfferingCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.queryList = function() {
    ZStackApi.queryInstanceOffering(
      {
        conditions: [{
        name: "type",
        op: "=",
        value: "UserVm"
        }]
      }
    )
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
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