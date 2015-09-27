'use strict';

angular.module('zstackUI.host.details',
  [
    'zstackUI.services.api',
    'zstackUI.host.details_directive'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.host-details', {
    url: '/host/:uuid',
    templateUrl: 'host/details.html',
    controller: 'HostDetailsCtrl'
  });
}])

.controller('HostDetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.query = function() {
    ZStackApi.queryHost(
      {
        conditions: [{
          name: "uuid",
          op: "=",
          value: uuid
        }]
      }
    )
    .then(function(data) {
      console.log(data)
      $scope.safeApply(function() {
        $scope.host = data.inventories[0];
      });
    });
  }

  ZStackApi.debugLogin(function() {
    $scope.query();
  });
}]);