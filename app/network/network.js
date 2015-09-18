'use strict';

angular.module('zstackUI.network', ['zstackUI.services.api'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/network', {
    templateUrl: 'network/network.html',
    controller: 'VmNetworkCtrl'
  });
}])

.controller('VmNetworkCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
  var msg = {
    'org.zstack.header.network.l3.APIQueryL3NetworkMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: []
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryIpRangeMsgRet");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.networkList = data.inventories;
      });
    })
  });
}])