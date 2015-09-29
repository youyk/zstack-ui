'use strict';

angular.module('zstackUI.offering.instance',
  [
    'zstackUI.offering.instance.modal.controller',
    'zstackUI.instance_offering.details_directive',
    'zstackUI.instance_offering.details',
    'zstackUI.services.api',
    'zstackUI.services.util'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance_offering', {
    url: '/instance_offering',
    templateUrl: 'instance_offering/offering.html',
    controller: 'InstanceOfferingCtrl'
  });
}])

.controller('InstanceOfferingCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', function($scope, ZStackApi, ZStackUtil) {
  $scope.ZStackUtil = ZStackUtil;
  
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
        for (var i in $scope.itemList) {
          $scope.itemList[i].collapsed = true;
        }
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