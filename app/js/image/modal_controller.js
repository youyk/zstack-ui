'use strict';

angular.module('zstackUI.image.modal.controller',
    [
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.controller('AddImageModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.data = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/image/add_image.html',
      controller: 'AddImageModalInstanceCtrl',
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

.controller('AddImageModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;

  $scope.formatList = [];
  for (var i in ZStackApi.formatList) {
    $scope.formatList.push(ZStackApi.formatList[i].format);
  }
  $scope.mediaTypeList = ["Image", "ISO"];
  $scope.mediaType = $scope.mediaTypeList[0];
  $scope.platformList = [
                          'Linux',
                          'Windows',
                          'Other',
                          'Paravirtualization'
                        ];
  $scope.system = false;
  $scope.name = "";
  $scope.description = "";
  $scope.url = "";
  $scope.mediaType = $scope.mediaTypeList[0];
  $scope.guestOsType = "";
  $scope.format = $scope.formatList[0];
  $scope.platform = $scope.platformList[0];
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
    var msgBody = {
      name: self.name,
      description: self.description,
      url: self.url,
      backupStorageUuids: self.backupStorageList,
      system: self.system,
      platform: self.platform,
    };
    var msg = {
      'org.zstack.header.image.APIAddImageMsg': msgBody
    }

    if ("ISO" == self.mediaType) {
      msgBody.format = "iso";
      msgBody.mediaType = "ISO";
    } else {
      msgBody.format = "qcow2";
      msgBody.meidaType = "RootVolumeTemplate";
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