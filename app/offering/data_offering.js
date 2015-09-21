'use strict';

angular.module('zstackUI.offering.data',
    [
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
  ZStackApi.debugLogin(function() {
    ZStackApi.queryDiskOffering([{
        name: 'state',
        op: '=',
        value: 'Enabled'
      }])
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });
  });
}])