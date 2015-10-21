'use strict';

angular.module('zstackUI.host',
  [
    'zstackUI.services.api',
    'zstackUI.host.modal.controller',
    'zstackUI.host.directive',
    'zstackUI.host.details'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.host', {
    url: '/host',
    templateUrl: 'js/host/host.html',
    controller: 'HostCtrl'
  });
}])

.controller('HostCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {

}])