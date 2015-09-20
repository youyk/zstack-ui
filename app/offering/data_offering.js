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
  $scope.ZStackUtil = ZStackUtil;
  ZStackApi.debugLogin(function() {
    ZStackApi.queryDiskOffering([{
        name: 'state',
        op: '=',
        value: 'Enabled'
      }], function(data) {
          $scope.$apply(function() {
          $scope.offeringList = data.inventories;
        });
      })
  });
}])