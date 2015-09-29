'use strict';

angular.module('zstackUI.instance',
    ['zstackUI.services.api',
     'zstackUI.instance.details',
     'zstackUI.instance.details_directive',
     'zstackUI.instance.modal.controller'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance', {
    url: '/instance',
    templateUrl: 'instance/instance.html',
    controller: 'InstanceCtrl'
  });
}])

.controller('InstanceCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  $scope.queryVmList = function() {
    ZStackApi.queryVmInstance(
      {
        conditions: [{
          name: "type",
          op: "=",
          value: "UserVm"
        }]
      }
    )
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.vmList = data.inventories;
        console.log(data)
        for (var i in $scope.vmList) {
          $scope.vmList[i].collapsed = true;
        }
      });
    });
  }

  $scope.queryVmList();

  $scope.$on("update:vmlist", function() {
    $scope.queryVmList();
  })

  $scope.onClickRow = function(vm) {
    vm.collapsed = !vm.collapsed;
  }

}]);