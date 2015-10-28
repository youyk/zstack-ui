'use strict';

angular.module('zstackUI.settings', ['zstackUI.services.api', 'ui.router', 'angularInlineEdit'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'js/settings/settings.html',
    controller: 'SettingsCtrl'
  });
}])

.controller('SettingsCtrl', ['$scope', 'ZStackApi', '$state', function($scope, ZStackApi, $state) {
  $scope.gs = {};

  function updateLocalValue(result) {
    if (!$scope.gs[result.inventories[0].category])
      $scope.gs[result.inventories[0].category] = {};
    $scope.gs[result.inventories[0].category][result.inventories[0].name] = result.inventories[0].value;
  }

  ZStackApi.queryGlobalConfig('mevoco', 'overProvisioning.memory')
  .then(function(result) {
    console.log(result);
    updateLocalValue(result);
  })

  ZStackApi.queryGlobalConfig('mevoco', 'overProvisioning.primaryStorage')
  .then(function(result) {
    console.log(result);
    updateLocalValue(result);
  })


  $scope.update = function(category, name, newValue) {
    // console.log(name +"   "+ newValue + "  " + $scope.gs.overProvisioning.memory)

    ZStackApi.updateGlobalConfig(category, name, newValue)
    .then(function(result) {
      console.log(result);
    })
  }
}]);