'use strict';

angular.module('zstackUI.vminstance', ['zstackUI.services.api'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vminstance', {
    templateUrl: 'vminstance/vminstance.html',
    controller: 'VmInstanceCtrl'
  });
}])

.controller('VmInstanceCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  
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

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
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

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});;