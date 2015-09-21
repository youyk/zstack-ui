'use strict';

angular.module('zstackUI.offering.instance', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance_offering', {
    url: '/instance_offering',
    templateUrl: 'offering/instance_offering.html',
    controller: 'InstanceOfferingCtrl'
  });
}])

.controller('InstanceOfferingCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  ZStackApi.debugLogin(function() {
    ZStackApi.queryInstanceOffering([{
        name: "type",
        op: "=",
        value: "UserVm"
      }])
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });
  });
}])