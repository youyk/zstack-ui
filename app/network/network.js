'use strict';

angular.module('zstackUI.network',
  [
    'zstackUI.network.modal.controller',
    'zstackUI.network.details_directive',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.network', {
    url: '/network',
    templateUrl: 'network/network.html',
    controller: 'NetworkCtrl'
  });
}])

.controller('NetworkCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.queryList = function() {
    ZStackApi.queryL3Network()
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
        for (var i in $scope.itemList[0].ipRanges) {
          $scope.itemList[0].ipRanges[i].collapsed = true;
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