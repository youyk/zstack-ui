'use strict';

angular.module('zstackUI.host', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.host', {
    url: '/host',
    templateUrl: 'host/host.html',
    controller: 'HostCtrl'
  });
}])

.controller('HostCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
  var msg = {
    'org.zstack.header.host.APIQueryHostMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: []
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryHostMsgRet");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.hostList = data.inventories;
      });
    })
  });
}])