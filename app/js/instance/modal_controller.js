'use strict';

angular.module('zstackUI.instance.modal.controller', ['zstackUI.services.api'])

.controller('CreateInstanceModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.data = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/instance/create_instance.html',
      controller: 'CreateInstanceModalInstanceCtrl',
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

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}])

.controller('CreateInstanceModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;
  $scope.name = "";
  $scope.hostname = "";
  $scope.image = null;
  $scope.instanceOffering = null;
  $scope.dataOffering = null;
  $scope.l3Network = [];
  $scope.ip = "";
  $scope.description

  $scope.$on("child-dialog:open", function() {
    $scope.showDialog = false;
  })

  $scope.$on("child-dialog:close", function(_, msg) {
    console.log(msg)
    $scope.showDialog = true;
    if (ZStackUtil.notNullnotUndefined(msg))
      $scope[msg.name] = msg.data;
  })

  $scope.create = function(cb) {
    var systemTags = [];
    var msgBody = {
      name: self.name,
      description: self.description,
      instanceOfferingUuid: self.instanceOffering.uuid,
      imageUuid: self.image.uuid,
      l3NetworkUuids: [ZStackApi.defaultL3Network.uuid],
      dataDiskOfferingUuids: ZStackUtil.notNullnotUndefined(self.dataOffering) ? [self.dataOffering.uuid] : [],
      zoneUuid: ZStackApi.defaultZone.uuid,
      clusterUuid: ZStackApi.defaultCluster.uuid,
      defaultL3NetworkUuid: ZStackApi.defaultL3Network.uuid,
      systemTags: systemTags
    }

    if (self.host) {
      msgBody.hostUuid = self.host.uuid;
    }

    var msg = {
      'org.zstack.header.vm.APICreateVmInstanceMsg': msgBody
    }

    if ($scope.ip) {
      systemTags.push('staticIp::' + ZStackApi.defaultL3Network.uuid + '::' + $scope.ip);
    }

    if ($scope.hostname) {
      systemTags.push('hostname::' + $scope.hostname);
    }

    ZStackApi.call(msg, function(data) {
      console.log(data)
      if (ZStackUtil.notNullnotUndefined(cb))
        cb(data);
    })
  }
  
  $scope.ok = function() {
    self.create(function(ret) {
      console.log(ret)
      modalScope.$emit("update:list");
    })
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])