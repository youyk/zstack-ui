'use strict';

angular.module('zstackUI.offering.data',
    [
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/data_offering', {
    templateUrl: 'offering/data_offering.html',
    controller: 'DataOfferingCtrl'
  });
}])

.controller('DataOfferingCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', 
                                 function($scope, ZStackApi, ZStackUtil) {
  $scope.ZStackUtil = ZStackUtil;

  var msg = {
    'org.zstack.header.configuration.APIQueryDiskOfferingMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: [{
            name: 'state',
            op: '=',
            value: 'Enabled'
          }]
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryDiskOfferingMsg");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.offeringList = data.inventories;
      });
    })
  });
}])