'use strict';



(function() {
    // Declare app level module which depends on views, and components
  var zstackUI = angular.module('zstackUI', [
    'zstackUI.helper_modals',
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'pascalprecht.translate',
    'angularInlineEdit',
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
  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {
    $urlRouterProvider.when('', '/main');
    $urlRouterProvider.when('/', '/main');
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/locale-',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh-CN');
  }])
  .run(['$rootScope', '$translate', '$state', '$cookies', 'ZStackApi', '$http', function($rootScope, $translate, $state, $cookies, ZStackApi, $http) {
    ZStackApi.rootScope = $rootScope;
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

    $rootScope.alert = null;

    $rootScope.closeAlert = function() {
      $rootScope.alert = null
    };

    ZStackApi.getSystemInfo();
  }])
  .controller('ZStackUIControl', function(config) {
    console.log(config);
  })

  angular.module("templates", []);

  fetchData().then(bootstrapApplication);

  function fetchData() {
      var initInjector = angular.injector(["ng"]);
      var $http = initInjector.get("$http");

      return $http.get("/config.json").then(function(response) {
          zstackUI.constant("config", response.data);
      }, function(errorResponse) {
        zstackUI.constant("config", {
          "server_url": window.location.protocol + '//' + window.location.host
        });
      });
  }

  function bootstrapApplication() {
      angular.element(document).ready(function() {
          angular.bootstrap(document, ["zstackUI"]);
      });
  }
}());