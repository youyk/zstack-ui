'use strict';

angular.module('zstackUI.security_group.details',
  [
    'zstackUI.services.api',
    'zstackUI.security_group.details_directive'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.security_group-details', {
    url: '/security_group/:uuid',
    templateUrl: 'js/security_group/details.html',
    controller: 'SecurityGroupDetailsCtrl'
  });
}])

.controller('SecurityGroupDetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.query = function() {
    ZStackApi.querySecurityGroup(
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