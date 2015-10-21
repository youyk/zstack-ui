'use strict';

angular.module('zstackUI.offering.instance',
  [
    'zstackUI.offering.instance.modal.controller',
    'zstackUI.instance_offering.details_directive',
    'zstackUI.instance_offering.directive',
    'zstackUI.instance_offering.details',
    'zstackUI.services.api',
    'zstackUI.services.util'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance_offering', {
    url: '/instance_offering',
    templateUrl: 'js/instance_offering/offering.html',
    controller: 'InstanceOfferingCtrl'
  });
}])

.controller('InstanceOfferingCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', function($scope, ZStackApi, ZStackUtil) {

}])