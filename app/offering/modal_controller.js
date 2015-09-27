'use strict';

angular.module('zstackUI.offering.data.modal.controller',
    [
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddDataOfferingModalCtrl', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'offering/add_data_offering.html',
      controller: 'AddDataOfferingModalInstanceCtrl',
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

.controller('AddDataOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;

  $scope.name = "";
  $scope.description = "";
  $scope.diskSize = "";

  $scope.action = function(cb) {
    var systemTags = [];
    var msg = {
      'org.zstack.header.configuration.APICreateDiskOfferingMsg': {
        name: self.name,
        description: self.description,
        diskSize: ZStackUtil.parseSize($scope.diskSize),
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



angular.module('zstackUI.offering.instance.modal.controller',
    [
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddInstanceModalCtrl', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'offering/add_instance_offering.html',
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

})

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