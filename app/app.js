'use strict';

// Declare app level module which depends on views, and components
angular.module('zstackUI', [
  'ngRoute',
  'ui.bootstrap',
  'zstackUI.login',
  'zstackUI.vminstance',
  'zstackUI.vmdetails',
  'zstackUI.host',
  'zstackUI.image',
  'zstackUI.offering.instance',
  'zstackUI.offering.data',
  'zstackUI.network',
  'zstackUI.volume',
  'zstackUI.view1',
  'zstackUI.view2',
  'zstackUI.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
