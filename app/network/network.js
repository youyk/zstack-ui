'use strict';

angular.module('zstackUI.network',
  [
    'zstackUI.network.modal.controller',
    'zstackUI.network.directive',
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
}])