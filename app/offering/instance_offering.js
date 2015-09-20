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