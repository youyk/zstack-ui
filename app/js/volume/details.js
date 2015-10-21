'use strict';

angular.module('zstackUI.volume.details',
  [
    'zstackUI.services.api',
    'zstackUI.volume.details_directive'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.volume-details', {
    url: '/volume/:uuid',
    templateUrl: 'js/volume/details.html',
    controller: 'volumeDetailsCtrl'
  });
}])

.controller('volumeDetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.query = function() {
    ZStackApi.queryVolume(
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
        $scope.data = data.inventories[0];
      });
    });
  }

  $scope.query();
}]);