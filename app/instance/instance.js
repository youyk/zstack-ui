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

.controller('CreateInstanceModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'data', function ($scope, ZStackApi, ZStackUtil, $modalInstance, data) {
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
  ZStackApi.queryImage([], function(data) {
    console.log("APIQueryImageMsg");
    console.log(data.inventories);
    $scope.$apply(function() {
      $scope.imageList = data.inventories;
    });
  })

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
  ZStackApi.queryInstanceOffering([], function(data) {
    $scope.$apply(function() {
      $scope.offeringList = data.inventories;
    });
  })

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
  ZStackApi.queryDiskOffering([], function(data) {
    $scope.$apply(function() {
      $scope.offeringList = data.inventories;
    });
  })

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
  ZStackApi.queryHost([], function(data) {
    $scope.$apply(function() {
      $scope.hostList = data.inventories;
    });
  })

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