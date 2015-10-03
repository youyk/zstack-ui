'use strict';

angular.module('zstackUI.init_wizard', ['zstackUI.services.api', 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('init_wizard', {
    url: '/init_wizard',
    templateUrl: 'init_wizard/init_wizard.html',
    controller: 'InitWizardCtrl'
  });
}])

.controller('InitWizardCtrl', ['$scope', 'ZStackApi', '$state', function($scope, ZStackApi, $state) {

  $scope.steps = [
    { number: 1, name: 'First Step' },
    { number: 2, name: 'Second Step' },
    { number: 3, name: 'Third Step' }
  ];

  $scope.currentStep = angular.copy($scope.steps[0]);

  $scope.nextStep = function() {
    var nextNumber = $scope.currentStep.number;
    if ($scope.steps.length == nextNumber){
      return;
    }
    $scope.currentStep = angular.copy($scope.steps[nextNumber]);
  }
}]);