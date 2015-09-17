'use strict';

// Declare app level module which depends on views, and components
angular.module('zstackUI', [
  'ngRoute',
  'zstackUI.login',
  'zstackUI.vminstance',
  'zstackUI.vmdetails',
  'zstackUI.view1',
  'zstackUI.view2',
  'zstackUI.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
