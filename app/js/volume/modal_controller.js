'use strict';

angular.module('zstackUI.volume.modal.controller',
    [
      'zstackUI.instance.modal.controller',
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddVolumeModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/volume/add_volume.html',
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

}])

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
      if (data.success) {
        var msg = {
          'org.zstack.header.volume.APIAttachDataVolumeToVmMsg': {
            vmInstanceUuid: $scope.instance.uuid,
            volumeUuid: data.inventory.uuid
          }
        }

        ZStackApi.call(msg, function(data) {
          console.log(data)
          if (ZStackUtil.notNullnotUndefined(cb))
          cb(data);
        });
      };

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

.controller('CreateImageModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/volume/create_image.html',
      controller: 'CreateImageModalInstanceCtrl',
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

.controller('CreateImageModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;

  $scope.platformList = [
                          'Linux',
                          'Windows',
                          'Other',
                          'Paravirtualization'
                        ];
  $scope.bitsList = ['32', '64'];

  $scope.system = "";
  $scope.name = "";
  $scope.description = "";
  $scope.guestOsType = "";
  $scope.platform = $scope.platformList[0];
  $scope.bits = $scope.bitsList[0];
  $scope.backupStorageList = [ZStackApi.defaultBackupStorage.uuid];

  $scope.$on("child-dialog:open", function() {
    $scope.showDialog = false;
  })

  $scope.$on("child-dialog:close", function(_, msg) {
    console.log(msg)
    $scope.showDialog = true;
    if (ZStackUtil.notNullnotUndefined(msg))
      $scope[msg.name] = msg.data;
  })

  $scope.select = function(name, value) {
    console.log("select:"+name+":"+value)
    $scope.safeApply(function() {
      $scope[name] = value;
    });
  }

  $scope.action = function(cb) {
    var systemTags = [];
    var msg = {
      'org.zstack.header.image.APICreateRootVolumeTemplateFromRootVolumeMsg': {
        name: self.name,
        description: self.description,
        guestOsType: self.guestOsType,
        platform: self.platform,
        backupStorageUuids: self.backupStorageList,
        rootVolumeUuid: modalScope.$parent.data.uuid
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

.controller('CreateSnapshotModalCtrl', ['$scope', '$modal', 'ZStackUtil', function ($scope, $modal, ZStackUtil) {

  ZStackUtil.initLaunchModalScope($scope, $modal, 'js/volume/create_snapshot.html', 'CreateSnapshotModalInstanceCtrl');

}])

.controller('CreateSnapshotModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  ZStackUtil.initModalScope($scope, $modalInstance, modalScope);
  var self = $scope;
  

  $scope.name = "";
  $scope.description = "";

  $scope.createSnapShot = function(name, description, cb) {
    ZStackApi.createVolumeSnapshot({
      name: name,
      description: description,
      volumeUuid: modalScope.data.uuid
    })
    .then(function(result) {
      if (ZStackUtil.notNullnotUndefined(cb))
        cb(result);
    })
  }

  $scope.action = function(cb) {
    self.createSnapShot($scope.name, $scope.description, cb);
  }

  $scope.ok = function() {
    self.action(function(ret) {
      console.log(ret)
      modalScope.$emit("update:snapshot");
    })
    $modalInstance.close('ok');
  };
}])