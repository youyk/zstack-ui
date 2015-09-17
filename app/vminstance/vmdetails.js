'use strict';

angular.module('zstackUI.vmdetails', ['zstackUI.services.api'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vminstance/:id', {
    templateUrl: 'vminstance/vmdetails.html',
    controller: 'VmDetailsCtrl'
  });
}])

.controller('VmDetailsCtrl', ['$scope', '$routeParams', 'ZStackApi', function($scope, $routeParams, ZStackApi) {
  console.log($routeParams)
}]);