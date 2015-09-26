'use strict';

// Declare app level module which depends on views, and components
angular.module('zstackUI', [
  'zstackUI.i18n',
  'ui.bootstrap',
  'ui.router',
  'pascalprecht.translate',
  'zstackUI.main',
  'zstackUI.login',
  'zstackUI.dashboard',
  'zstackUI.instance',
  'zstackUI.host',
  'zstackUI.image',
  'zstackUI.offering.instance',
  'zstackUI.offering.data',
  'zstackUI.network',
  'zstackUI.volume',
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
}]);

angular.module('ng').run(['$rootScope', '$translate', function($rootScope, $translate) {
    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.changeLanguage = function(langKey) {
      $translate.use(langKey);
    }
}]);