'use strict';

angular.module('zstackUI.offering.data',
  [
    'zstackUI.offering.data.modal.controller',
    'zstackUI.data_offering.details_directive',
    'zstackUI.data_offering.details',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.data_offering', {
    url: '/data_offering',
    templateUrl: 'data_offering/offering.html',
    controller: 'DataOfferingCtrl'
  });
}])

.controller('DataOfferingCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.queryList = function() {
    ZStackApi.queryDiskOffering(
      {
        conditions: [{
          name: 'state',
          op: '=',
          value: 'Enabled'
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