'use strict';

angular.module('zstackUI.image.details',
  [
    'zstackUI.services.api',
    'zstackUI.image.details_directive'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.image-details', {
    url: '/image/:uuid',
    templateUrl: 'js/image/details.html',
    controller: 'imageDetailsCtrl'
  });
}])

.controller('imageDetailsCtrl', ['$scope', '$stateParams', 'ZStackApi', function($scope, $stateParams, ZStackApi) {
  var uuid = $stateParams.uuid
  $scope.query = function() {
    ZStackApi.queryImage(
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