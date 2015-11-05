'use strict';

angular.module('zstackUI.security_group',
  [
    'zstackUI.security_group.modal.controller',
    'zstackUI.security_group.details_directive',
    'zstackUI.security_group.directive',
    'zstackUI.security_group.details',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.security_group', {
    url: '/security_group',
    templateUrl: 'js/security_group/security_group.html',
    controller: 'SecurityGroupCtrl'
  });
}])

.controller('SecurityGroupCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
}])