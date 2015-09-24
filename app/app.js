'use strict';

// Declare app level module which depends on views, and components
angular.module('zstackUI', [
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
config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {
  $urlRouterProvider.otherwise('/main');

  $translateProvider.translations('en', {
    DASHBOARD: 'Dashboard',
    INSTANCE: 'Instance',
    HOST: 'Host',
    IMAGE: 'Image',
    NETWORK: 'Network',
    VOLUME: 'Volume',
    INSTANCE_OFFERING: 'Instance Offering',
    DATA_OFFERING: 'Data Offering'
  })
  .translations('zh-CN', {
    DASHBOARD: '首页',
    INSTANCE: '虚拟机',
    HOST: '物理机',
    IMAGE: '镜像',
    NETWORK: '网络',
    VOLUME: '存储',
    INSTANCE_OFFERING: '系统模板',
    DATA_OFFERING: '存储模板'
  })

  $translateProvider.preferredLanguage('en');
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