'use strict';

angular.module('zstackUI.offering.instance.modal.controller',
    [
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddInstanceModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/instance_offering/add_instance_offering.html',
      controller: 'AddInstanceModalInstanceCtrl',
      backdrop: 'static',
      size: size,
      resolve: {
        modalScope: function () {
          return $scope;
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

}])

.controller('AddInstanceModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;

  $scope.name = "";
  $scope.description = "";
  $scope.cpuNum = "";
  $scope.cpuSpeed = "";
  $scope.memorySize = "";

  $scope.action = function(cb) {
    var systemTags = [];
    var msg = {
      'org.zstack.header.configuration.APICreateInstanceOfferingMsg': {
        name: self.name,
        description: self.description,
        cpuNum : $scope.cpuNum,
        cpuSpeed : $scope.cpuSpeed,
        memorySize : ZStackUtil.parseSize($scope.memorySize)
      }
    }


    ZStackApi.call(msg, function(data) {
      console.log(data)
      if (ZStackUtil.notNullnotUndefined(cb))
        cb(data);
    })
  }
  
  $scope.ok = function() {
    self.action(function(ret) {
      console.log(ret)
      modalScope.$emit("update:list");
    })
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])