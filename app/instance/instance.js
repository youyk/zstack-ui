'use strict';

angular.module('zstackUI.instance',
    ['zstackUI.services.api',
     'zstackUI.instance.details',
     'zstackUI.instance.directive',
     'zstackUI.instance.details_directive',
     'zstackUI.instance.modal.controller'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance', {
    url: '/instance',
    templateUrl: 'instance/instance.html',
    controller: 'InstanceCtrl'
  });
}])

.controller('InstanceCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {

}]);