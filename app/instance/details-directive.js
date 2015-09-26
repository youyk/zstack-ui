'use strict';

angular.module('zstackUI.instance.details-directive', ['zstackUI.services.api'])

.directive('detailsDirective', ['ZStackApi', function(ZStackApi) {
  return {
    scope: {
      vm: '=ngModel',
    },
    templateUrl: 'instance/details-directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      console.log("ZStackApi..........................")
      console.log(ZStackApi)

      $scope.$on("child-dialog:close", function(_, msg) {
        console.log(msg)
        // $scope.showDialog = true;
        // if (ZStackUtil.notNullnotUndefined(msg))
        //   $scope[msg.name] = msg.data;
      })
    }
  };
}])

.controller('CurrentDataOfferingModalCtrl', function ($scope, $modal, $log) {

  var self = $scope;

  $scope.open = function(allVolumes) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/current_data_offering.html',
      controller: 'CurrentDataOfferingModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        allVolumes: function () {
          return allVolumes;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
})

.controller('CurrentDataOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'allVolumes', function ($scope, ZStackApi, $modalInstance, allVolumes) {
  console.log(allVolumes)

  $scope.allVolumes = allVolumes;

  $scope.select = function(dataOffering) {
    console.log(dataOffering)
    $scope.dataOffering = dataOffering;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "currentDataOffering",
      data: $scope.dataOffering
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])