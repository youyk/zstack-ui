'use strict';

// Declare app level module which depends on views, and components
angular.module('zstackUI', [
  'zstackUI.i18n',
  'zstackUI.helper_modals',
  'ui.bootstrap',
  'ui.router',
  'ngCookies',
  'pascalprecht.translate',
  'xeditable',
  'templates',
  'zstackUI.main',
  'zstackUI.login',
  'zstackUI.init_wizard',
  'zstackUI.pagination_directive',
  'zstackUI.search_directive',
  'zstackUI.dashboard',
  'zstackUI.instance',
  'zstackUI.host',
  'zstackUI.image',
  'zstackUI.offering.instance',
  'zstackUI.offering.data',
  'zstackUI.network',
  'zstackUI.volume',
  'zstackUI.services.api',
  'zstackUI.settings',
  'zstackUI.log'
])
.run(['ZStackApi', '$cookies', '$http', 'editableOptions', function(ZStackApi, $cookies, $http, editableOptions) {
  editableOptions.theme = 'bs3';
  $http({
    method: 'GET',
    url: '/config.json'
  })
  .then(function successCallback(response) {
    ZStackApi.server_url = response.data.server_url;
    ZStackApi.connectWebsocket();
    ZStackApi.initGlobalValue();
  }, function errorCallback(response) {
    console.log(response)
    ZStackApi.server_url = window.location.protocol + '//' + window.location.host;
    ZStackApi.connectWebsocket();
    ZStackApi.initGlobalValue();
  });
}])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
}]);

angular.module("templates", []);

angular.module('ng').run(['$rootScope', '$translate', '$state', '$cookies', function($rootScope, $translate, $state, $cookies) {
  $rootScope.$window = window;
  window.loggedin = !!$cookies.get('sessionId');
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

  $rootScope.logout = function() {
    window.loggedin = false;
    $cookies.remove('sessionId');
    $state.go('login');
  }

  $state.go('main.dashboard')
}]);