'use strict';

angular.module('zstackUI.instance', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.instance', {
    url: '/instance',
    templateUrl: 'instance/instance.html',
    controller: 'InstanceCtrl'
  });
}])

.controller('InstanceCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
  var msg = {
    'org.zstack.header.vm.APIQueryVmInstanceMsg': {
      count: false,
      start: 0,
      replyWithCount: true,
      conditions: [{
        name: "type",
        op: "=",
        value: "UserVm"
      }]
    }
  }
  ZStackApi.debugLogin(function() {
    ZStackApi.call(msg, function(data) {
      console.log("APIQueryVmInstanceMsgRet");
      console.log(data.inventories);
      $scope.$apply(function() {
        $scope.vmList = data.inventories;
      });
    })
  });
}])

.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.data = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      backdrop: 'static',
      size: size,
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

})

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, data) {

  // $scope.data = data;
  // $scope.selected = {
  //   item: $scope.data[0]
  // };
  $scope.steps = [
    { number: 1, name: 'First Step' },
    { number: 2, name: 'Second Step' },
    { number: 3, name: 'Third Step' }
    ];
  
  $scope.currentStep = angular.copy($scope.steps[0]);
  
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.nextStep = function() {
    // Perform current step actions and show next step:
    // E.g. save form data
    
    var nextNumber = $scope.currentStep.number;
    if ($scope.steps.length == nextNumber){
      $modalInstance.dismiss('cancel');
    }
    $scope.currentStep = angular.copy($scope.steps[nextNumber]);
  };

  // $scope.ok = function () {
  //   $modalInstance.close($scope.selected.item);
  // };

  // $scope.cancel = function () {
  //   $modalInstance.dismiss('cancel');
  // };
});;