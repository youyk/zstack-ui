'use strict';

angular.module('zstackUI.volume',
  [
    'zstackUI.volume.modal.controller',
    'zstackUI.volume.directive',
    'zstackUI.volume.details',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.volume', {
    url: '/volume',
    templateUrl: 'js/volume/volume.html',
    controller: 'VolumeCtrl'
  });
}])

.controller('VolumeCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
}])