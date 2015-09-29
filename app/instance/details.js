'use strict';

angular.module('zstackUI.instance.details', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  // There should be 'instance-details'. 'instance.details' will get error.
  $stateProvider.state('main.instance-details', {
    url: '/instance/:uuid',
    templateUrl: 'instance/details.html',
    controller: 'DetailsCtrl'
  });
}])

.controller('DetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.queryVm = function() {
    ZStackApi.queryVmInstance(
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

  $scope.queryVm();
}]);