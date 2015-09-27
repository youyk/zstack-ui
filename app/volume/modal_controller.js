'use strict';

angular.module('zstackUI.volume.modal.controller',
    [
      'zstackUI.instance.modal.controller',
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddVolumeModalCtrl', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'volume/add_volume.html',
      controller: 'AddVolumeModalInstanceCtrl',
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

})

.controller('AddVolumeModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;
  $scope.name = "";
  $scope.description = "";

  $scope.$on("child-dialog:open", function() {
    $scope.showDialog = false;
  })

  $scope.$on("child-dialog:close", function(_, msg) {
    console.log(msg)
    $scope.showDialog = true;
    if (ZStackUtil.notNullnotUndefined(msg))
      $scope[msg.name] = msg.data;
  })

  $scope.action = function(cb) {
    var systemTags = [];
    var msg = {
      'org.zstack.header.volume.APICreateDataVolumeMsg': {
        name: self.name,
        description: self.description,
        diskOfferingUuid: self.dataOffering.uuid,
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