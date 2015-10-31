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
  $scope.description = "";
  $scope.multiHost = false;
  $scope.name1 = "";

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

    if ($scope.hostname && $scope.hostname.length > 0) {
      systemTags.push('hostname::' + $scope.hostname);
    }

    ZStackApi.createVm(msgBody).then(cb)

    // ZStackApi.call(msg, function(data) {
    //   console.log(data)
    //   if (ZStackUtil.notNullnotUndefined(cb))
    //     cb(data);
    // })
  }

  $scope.createMultipleInstances =  function() {
    var msgBody = {
      instanceOfferingUuid: self.instanceOffering.uuid,
      imageUuid: self.image.uuid,
      l3NetworkUuids: [ZStackApi.defaultL3Network.uuid],
      dataDiskOfferingUuids: ZStackUtil.notNullnotUndefined(self.dataOffering) ? [self.dataOffering.uuid] : [],
      zoneUuid: ZStackApi.defaultZone.uuid,
      clusterUuid: ZStackApi.defaultCluster.uuid,
      defaultL3NetworkUuid: ZStackApi.defaultL3Network.uuid,
    };

    ZStackApi.queryHost({
      count: true,
      replyWithCount: true
    })
    .then(function(result) {
      var hostCount = result.total;
      var curreCount = 0;
      var errorCount = 0;
      var terminateCreate = false;
      function _createVm() {
        if (curreCount < self.createCount && !terminateCreate) {
          var index = curreCount+1;
          msgBody.name = self.name + "-" + index;
          msgBody.systemTags = [];
          if (self.hostname && self.hostname.length > 0) {
            msgBody.systemTags.push('hostname::' + self.hostname + "-" + index);
          }
          curreCount++;
          return ZStackApi.createVm(msgBody)
          .then(_createVm,  function(reason) {
            errorCount++;
            if (errorCount >= hostCount)
              terminateCreate = true;
          });
        } else {
          modalScope.$emit("update:list");
          return;
        }
      }
      for (var i = 0; i < hostCount*10; i++) {
        _createVm();
      }
    })
  }
  
  $scope.ok = function() {
    if (!self.multiHost) {
      self.create(function(ret) {
        console.log(ret)
        modalScope.$emit("update:list");
      })
    } else {
      self.createMultipleInstances();
    }
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])