'use strict';

angular.module('zstackUI.offering.data',
    [
    'zstackUI.offering.data.modal.controller',
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.data_offering', {
    url: '/data_offering',
    templateUrl: 'offering/data_offering.html',
    controller: 'DataOfferingCtrl'
  });
}])


.controller('DataOfferingCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', 
                                 function($scope, ZStackApi, ZStackUtil) {
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