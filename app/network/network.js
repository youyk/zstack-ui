'use strict';

angular.module('zstackUI.network', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.network', {
    url: '/network',
    templateUrl: 'network/network.html',
    controller: 'NetworkCtrl'
  });
}])

.controller('NetworkCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  ZStackApi.debugLogin(function() {
    ZStackApi.queryL3Network([])
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });
  });
}])