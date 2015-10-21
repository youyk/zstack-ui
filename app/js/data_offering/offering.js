'use strict';

angular.module('zstackUI.offering.data',
  [
    'zstackUI.offering.data.modal.controller',
    'zstackUI.data_offering.details_directive',
    'zstackUI.data_offering.directive',
    'zstackUI.data_offering.details',
    'zstackUI.services.api'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.data_offering', {
    url: '/data_offering',
    templateUrl: 'js/data_offering/offering.html',
    controller: 'DataOfferingCtrl'
  });
}])

.controller('DataOfferingCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
}])