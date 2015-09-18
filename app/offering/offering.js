'use strict';

angular.module('zstackUI.offering', ['zstackUI.services.api'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/offering', {
    templateUrl: 'offering/offering.html',
    controller: 'VmOfferingCtrl'
  });
}])

.controller('VmOfferingCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
  var msg = {
    'org.zstack.header.configuration.APIQueryInstanceOfferingMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: [{
        name: "type",
        op: "=",
        value: "UserVm"
      }]
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryInstanceOfferingMsg");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.offeringList = data.inventories;
      });
    })
  });
}])