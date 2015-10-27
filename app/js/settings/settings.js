'use strict';

angular.module('zstackUI.settings', ['zstackUI.services.api', 'ui.router', 'xeditable'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'js/settings/settings.html',
    controller: 'SettingsCtrl'
  });
}])

.controller('SettingsCtrl', ['$scope', 'ZStackApi', '$state', function($scope, ZStackApi, $state) {
  $scope.gs = {
    overProvisioning: {
      memory: '1.2',
      primaryStorage: '1.2'
    }
  }
}]);