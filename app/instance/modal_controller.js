'use strict';

angular.module('zstackUI.instance.modal.controller', ['zstackUI.services.api'])

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

.controller('CreateInstanceModalCtrl', function ($scope, $modal, $log) {

  $scope.data = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/create_instance.html',
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

})

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
    var msg = {
      'org.zstack.header.vm.APICreateVmInstanceMsg': {
        name: self.name,
        instanceOfferingUuid: self.instanceOffering.uuid,
        imageUuid: self.image.uuid,
        l3NetworkUuids: [ZStackApi.defaultL3Network.uuid],
        dataDiskOfferingUuids: [self.dataOffering.uuid],
        zoneUuid: ZStackApi.defaultZone.uuid,
        clusterUuid: ZStackApi.defaultCluster.uuid,
        hostUuid: self.host.uuid,
        defaultL3NetworkUuid: ZStackApi.defaultL3Network.uuid,
        systemTags: systemTags
      }
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
      modalScope.$emit("update:vmlist");
    })
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('ImageModalCtrl', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/image.html',
      controller: 'ImageModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
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

.controller('ImageModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  ZStackApi.queryImage()
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });

  $scope.select = function(image) {
    console.log(image)
    $scope.image = image;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "image",
      data: $scope.image
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('InstanceOfferingModalCtrl', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/instance_offering.html',
      controller: 'InstanceOfferingModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
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

.controller('InstanceOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  ZStackApi.queryInstanceOffering(
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
        $scope.itemList = data.inventories;
      });
    });

  $scope.select = function(instanceOffering) {
    console.log(instanceOffering)
    $scope.instanceOffering = instanceOffering;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "instanceOffering",
      data: $scope.instanceOffering
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('DataOfferingModalCtrl', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/data_offering.html',
      controller: 'DataOfferingModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
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

.controller('DataOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  ZStackApi.queryDiskOffering(
      {
        conditions: [{
          name: 'state',
          op: '=',
          value: 'Enabled'
        }]
      }
    )
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });

  $scope.select = function(dataOffering) {
    console.log(dataOffering)
    $scope.dataOffering = dataOffering;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "dataOffering",
      data: $scope.dataOffering
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('DataVolumeModalCtrl', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/data_volume.html',
      controller: 'DataVolumeModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
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

.controller('DataVolumeModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  ZStackApi.queryVolume(
      {
        // conditions: [{
        //   name: 'state',
        //   op: '=',
        //   value: 'Enabled'
        // }]
      }
    )
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });

  $scope.select = function(selectedItem) {
    console.log(selectedItem)
    $scope.selectedItem = selectedItem;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "dataVolume",
      data: $scope.selectedItem
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('HostModalCtrl', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'instance/host.html',
      controller: 'HostModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
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

.controller('HostModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  ZStackApi.queryHost()
    .then(function(data) {
      $scope.safeApply(function() {
        $scope.itemList = data.inventories;
      });
    });

  $scope.select = function(host) {
    console.log(host)
    $scope.host = host;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "host",
      data: $scope.host
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);