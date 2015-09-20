'use strict';

// Declare app level module which depends on views, and components
angular.module('zstackUI', [
  'ui.bootstrap',
  'ui.router',
  'zstackUI.main',
  'zstackUI.login',
  'zstackUI.instance',
  'zstackUI.host',
  'zstackUI.image',
  'zstackUI.offering.instance',
  'zstackUI.offering.data',
  'zstackUI.network',
  'zstackUI.volume',
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main');
}]);
