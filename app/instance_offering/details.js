'use strict';

angular.module('zstackUI.instance_offering.details',
  [
    'zstackUI.services.api',
    'zstackUI.instance_offering.details_directive'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance-offering-details', {
    url: '/instance_offering/:uuid',
    templateUrl: 'instance_offering/details.html',
    controller: 'instanceOfferingDetailsCtrl'
  });
}])

.controller('instanceOfferingDetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.query = function() {
    ZStackApi.queryInstanceOffering(
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