'use strict';

angular.module('zstackUI.dashboard', ['zstackUI.services.api'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.dashboard', {
    url: '/dashboard',
    templateUrl: 'dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', function($scope, ZStackApi, ZStackUtil) {
  $scope.capList = [
      {name: "CPU"},
      {name: "Primary Storage"},
      {name: "Backup Storage"},
      {name: "IP Address"}];

  ZStackApi.getMemoryCpuCapacityByAll()
  .then(function(data){
    $scope.safeApply(function() {
      for(var i in $scope.capList) {
        if ($scope.capList[i].name == "CPU") {
          $scope.capList[i].total = ZStackUtil.toMHZString(data.totalCpu);
          $scope.capList[i].available = ZStackUtil.toMHZString(data.availableCpu);
          $scope.capList[i].percent = ZStackUtil.toPercentageString(data.totalCpu == 0 ? 0 : data.availableCpu / data.totalCpu);
          break;
        }
      };
    });
  });

  ZStackApi.getPirmaryStorageCapacityByAll()
  .then(function(data){
    $scope.safeApply(function() {
      for(var i in $scope.capList) {
        if ($scope.capList[i].name == "Primary Storage") {
          $scope.capList[i].total = ZStackUtil.toSizeString(data.totalCapacity);
          $scope.capList[i].available = ZStackUtil.toSizeString(data.availableCapacity);
          $scope.capList[i].percent = ZStackUtil.toPercentageString(data.totalCapacity == 0 ? 0 : data.availableCapacity / data.totalCapacity);
          break;
        }
      };
    });
  });

  ZStackApi.getBackupStorageCapacityByAll()
  .then(function(data){
    $scope.safeApply(function() {
      for(var i in $scope.capList) {
        if ($scope.capList[i].name == "Backup Storage") {
          $scope.capList[i].total = ZStackUtil.toSizeString(data.totalCapacity);
          $scope.capList[i].available = ZStackUtil.toSizeString(data.availableCapacity);
          $scope.capList[i].percent = ZStackUtil.toPercentageString(data.totalCapacity == 0 ? 0 : data.availableCapacity / data.totalCapacity);
          break;
        }
      };
    });
  });

  ZStackApi.getIpAddressCapacityByAll()
  .then(function(data){
    $scope.safeApply(function() {
      for(var i in $scope.capList) {
        if ($scope.capList[i].name == "IP Address") {
          $scope.capList[i].total = data.totalCapacity;
          $scope.capList[i].available = data.availableCapacity;
          $scope.capList[i].percent = ZStackUtil.toPercentageString(data.totalCapacity == 0 ? 0 : data.availableCapacity / data.totalCapacity);
          break;
        }
      };
    });
  });

  $scope.resList = [
    {name: "VM Instance"},
    {name: "Volume"},
    {name: "Zone"},
    {name: "Cluster"},
    {name: "Host"},
    {name: "Image"},
    {name: "Instance Offering"},
    {name: "Disk Offering"},
  ]
  ZStackApi.queryVmInstance(
    {
      count: true,
      conditions: [{
        name: "type",
        op: "=",
        value: "UserVm"
      }]
    }
  )
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "VM Instance") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryVolume()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Volume") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryZone()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Zone") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryCluster()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Cluster") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryHost()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Host") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryImage()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Image") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryInstanceOffering()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Instance Offering") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });

  ZStackApi.queryDiskOffering()
  .then(function(data) {
    $scope.safeApply(function() {
      for(var i in $scope.resList) {
        if ($scope.resList[i].name == "Disk Offering") {
          $scope.resList[i].count = data.total;
          break;
        }
      }
    });
  });
}])