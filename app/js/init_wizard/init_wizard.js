'use strict';

angular.module('zstackUI.init_wizard', 
  [
    'zstackUI.services.api',
    'zstackUI.services.util',
    'ui.router'
  ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('init_wizard', {
    url: '/init_wizard',
    templateUrl: 'js/init_wizard/init_wizard.html',
    controller: 'InitWizardCtrl'
  });
}])

.controller('InitWizardCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$state', function($scope, ZStackApi, ZStackUtil, $state) {

  $scope.stepCount = 7;
  $scope.currentStep = 0;
  $scope.realStep = 0;
  $scope.realStepCount = 16;

  $scope.zone = {};
  $scope.zone.name = "ZONE-1";
  $scope.cluster = {};
  $scope.cluster.name = "CLUSTER-1";
  $scope.host = {};
  $scope.host.name = "HOST-1";
  $scope.host.description = "";
  $scope.host.hostIp = "";
  $scope.host.username = "root";
  $scope.host.password = "";
  $scope.instance_offering = {};
  $scope.instance_offering.name = "INSTANCE-OFFERING-1";
  $scope.instance_offering.description = "";
  $scope.instance_offering.cpuNum = "1";
  $scope.instance_offering.cpuSpeed = "512";
  $scope.instance_offering.memorySize = "512M";
  $scope.image = {};
  $scope.image.name = "IMAGE-1";
  $scope.image.description = "";
  $scope.image.url = "http://download.zstack.org/templates/ttylinux.qcow2"
  $scope.image.mediaTypeList = ["ISO", "Image"];
  $scope.image.mediaType = $scope.image.mediaTypeList[0];
  $scope.image.platformList = [
      'Linux',
      'Windows',
      'Other',
      'Paravirtualization'
    ];
  $scope.image.platform = $scope.image.platformList[0];
  $scope.primaryStorage = {};
  $scope.primaryStorage.name = "PS-1";
  $scope.primaryStorage.path = "/zstack_ps";
  $scope.backupStorage = {};
  $scope.backupStorage.name = "BS-1";
  $scope.backupStorage.path = "/zstack_bs";
  $scope.backupStorage.hostname = "";
  $scope.backupStorage.username = "root";
  $scope.backupStorage.password = "";
  $scope.l2Network = {};
  $scope.l2Network.name = "PUBLIC-L2-1";
  $scope.l2Network.typeList = ["L2VlanNetwork", "L2NoVlanNetwork"];
  $scope.l2Network.type = $scope.l2Network.typeList[1];
  $scope.l2Network.vlan = "";
  $scope.l2Network.physicalInterface = "eno1";
  $scope.l3Network = {};
  $scope.l3Network.name = "PUBLIC-L3-1";
  $scope.l3Network.dnsDomain = "my.zstack.org";
  $scope.l3Network.dns = "8.8.8.8";
  $scope.ipRange = {};
  $scope.ipRange.name = "PUBLIC-L3-IPRANGE-1";
  $scope.ipRange.description = "";
  $scope.ipRange.startIp = "192.168.0.2";
  $scope.ipRange.endIp = "192.168.0.100";
  $scope.ipRange.netmask = "255.255.255.0";
  $scope.ipRange.gateway = "192.168.0.1";


  $scope.next = function() {
    if ($scope.currentStep < $scope.stepCount-1 ) {
      $scope.currentStep++;
    };
  }

  $scope.prev = function() {
    if ($scope.currentStep > 0 ) {
      $scope.currentStep--;
    };
  }

  $scope.finish = function() {
    ZStackApi.queryZone()
    .then(function(result) {
      $scope.realStep++;
      if (result.inventories.length > 0)
        return ZStackApi.deleteZone(result.inventories[0].uuid);
      else 
        return ZStackApi.dummyPromise({});
    })
    .then(function(result) {
      $scope.realStep++;
      return ZStackApi.createZone({
        name: $scope.zone.name
      })
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.zone.uuid = result.inventory.uuid;
      return ZStackApi.createCluster(
          {
             name: $scope.cluster.name,
             hypervisorType: "KVM",
             zoneUuid: $scope.zone.uuid
          }
        );
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.cluster.uuid = result.inventory.uuid;
      return ZStackApi.addHost({
        name: $scope.host.name,
        managementIp: $scope.host.hostIp,
        clusterUuid: $scope.cluster.uuid,
        username: $scope.host.username,
        password: $scope.host.password
      });
    })
    .then(function(result) {
      $scope.realStep++;
      return ZStackApi.addLocalPrimaryStorage({
        name: $scope.primaryStorage.name,
        zoneUuid: $scope.zone.uuid,
        url: $scope.primaryStorage.path
      });
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.primaryStorage.uuid = result.inventory.uuid;
      return ZStackApi.attachPrimaryStorage({
        clusterUuid: $scope.cluster.uuid,
        primaryStorageUuid: $scope.primaryStorage.uuid
      });
    })
    .then(function(result) {
      $scope.realStep++;
      return ZStackApi.addSftpBackupStorage({
        name: $scope.backupStorage.name,
        hostname: $scope.backupStorage.hostname,
        username: $scope.backupStorage.username,
        password: $scope.backupStorage.password,
        type: 'SftpBackupStorage',
        url: $scope.backupStorage.path
      });
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.backupStorage.uuid = result.inventory.uuid;
      return ZStackApi.attachBackupStorage({
        zoneUuid: $scope.zone.uuid,
        backupStorageUuid: $scope.backupStorage.uuid
      });
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.backupStorage.uuid = result.inventory.uuid;
      return ZStackApi.addInstanceOffering({
        name: $scope.instance_offering.name,
        cpuNum: $scope.instance_offering.cpuNum,
        cpuSpeed: $scope.instance_offering.cpuSpeed,
        memorySize: ZStackUtil.parseSize($scope.instance_offering.memorySize)
      });
    })
    .then(function(result) {
      $scope.realStep++;
      var msg = {
        name: $scope.image.name,
        url: $scope.image.url,
        backupStorageUuids: [$scope.backupStorage.uuid],
        platform: $scope.image.platform,
        system: false
      };
      if ("ISO" == $scope.image.meidaType) {
        msg.format = "iso";
        msg.mediaType = "ISO";
      } else {
        msg.format = "qcow2";
        msg.meidaType = "RootVolumeTemplate";
      }
      
      return ZStackApi.addImage(msg);
    })
    .then(function(result) {
      $scope.realStep++;
      var msg = {
        name: $scope.l2Network.name,
        type: $scope.l2Network.type,
        zoneUuid: $scope.zone.uuid,
        physicalInterface: $scope.l2Network.physicalInterface
      }
      if ($scope.l2Network.type == 'L2VlanNetwork') {
        msg.vlan = $scope.l2Network.vlan;
        return ZStackApi.createL2VlanNetwork(msg);
      }
      return ZStackApi.createL2NoVlanNetwork(msg);
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.l2Network.uuid = result.inventory.uuid;
      return ZStackApi.attachL2NetworkToCluster({
        clusterUuid: $scope.cluster.uuid,
        l2NetworkUuid: $scope.l2Network.uuid
      })
    })
    .then(function(result) {
      $scope.realStep++;
      return ZStackApi.createL3Network({
        name: $scope.l3Network.name,
        type: "L3BasicNetwork",
        l2NetworkUuid: $scope.l2Network.uuid,
        system: false,
        dnsDomain: $scope.dnsDomain
      })
    })
    .then(function(result) {
      $scope.realStep++;
      $scope.l3Network.uuid = result.inventory.uuid;
      return ZStackApi.addDns({
        dns: $scope.l3Network.dns,
        l3NetworkUuid: $scope.l3Network.uuid
      })
    })
    .then(function(result) {
      $scope.realStep++;
      return ZStackApi.addIpRange({
        l3NetworkUuid: $scope.l3Network.uuid,
        name: $scope.ipRange.name,
        startIp: $scope.ipRange.startIp,
        endIp: $scope.ipRange.endIp,
        gateway: $scope.ipRange.gateway,
        netmask: $scope.ipRange.netmask,
      })
    })
    .then(function(result) {
      $scope.realStep++;
      return ZStackApi.queryNetworkServiceProvider();
    })
    .then(function(result) {
      $scope.realStep++;
      var networkServiceProviderUuid = "";
      for (var i in result.inventories) {
        if (result.inventories[i].name == "Flat Network Service Provider") {
          networkServiceProviderUuid = result.inventories[i].uuid;
          break;
        }
      }
      var networkServices = {};
      var serviceList = ["DHCP"]
      networkServices[networkServiceProviderUuid] = serviceList;
      return ZStackApi.attachNetworkService({
        l3NetworkUuid: $scope.l3Network.uuid,
        networkServices: networkServices
      })
    })
    .then(function(result) {
      $scope.realStep++;
      $state.go('main.dashboard')
    });
  }
}]);