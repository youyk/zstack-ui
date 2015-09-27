'use strict';

angular.module('zstackUI.data_offering.details',
  [
    'zstackUI.services.api',
    'zstackUI.data_offering.details_directive'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.data_offering-details', {
    url: '/data_offering/:uuid',
    templateUrl: 'data_offering/details.html',
    controller: 'aaaOfferingDetailsCtrl'
  });
}])

.controller('aaaOfferingDetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.query = function() {
    ZStackApi.queryDiskOffering(
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

  ZStackApi.debugLogin(function() {
    $scope.query();
  });
}]);