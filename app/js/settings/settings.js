'use strict';

angular.module('zstackUI.settings', ['zstackUI.services.api', 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'js/settings/settings.html',
    controller: 'SettingsCtrl'
  });
}])

.controller('SettingsCtrl', ['$scope', 'ZStackApi', '$state', function($scope, ZStackApi, $state) {

}]);