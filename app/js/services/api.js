'use strict';

angular.module('zstackUI.services.api', ['zstackUI.services.util', 'ui.router', 'ngCookies'])

.factory('ZStackApi', ['$q', 'ZStackUtil', '$state', '$cookies', function($q, ZStackUtil, $state, $cookies) {
  var self = {}
  self.debugLogin = function(cb) {
    console.log("debugLogin")
    if (self.socket) {
      if (ZStackUtil.notNullnotUndefined(cb))
        cb();
      return;
    }
    self.login('admin',
       'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        cb);
  }

  self.cbList = []

  self.server_url = 'http://123.183.211.57:5000';

  self.connectWebsocket = function() {
    if (self.socket) return;

    self.socket = io.connect(self.server_url);
    // self.socket = io.connect('http://192.168.1.107:5000');
    // self.socket = io.connect('http://10.238.145.58:5000');


    self.socket.on('call_ret', function(data) {
      console.log(data)
      var ret = JSON.parse(data.msg);
      var msg = ZStackUtil.firstItem(ret);
      if (!window.msgList)
        window.msgList = [];
      window.msgList.push(JSON.stringify(msg));
      if (!msg.success && ZStackUtil.notNullnotUndefined(msg.error) && msg.error.code == 'ID.1001') {
        window.loggedin = false;
        $state.go('login');
        return;
      }
      if (ZStackUtil.notNullnotUndefined(self.cbList[msg.session.callid])) {
        self.cbList[msg.session.callid](msg);
        delete self.cbList[msg.session.callid];
      }
    });

    self.socket.on('admin_broadcast', function(data) {
      console.log(data)
    });

    self.socket.on('disconnect', function() {
      console.log("disconnect!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      self.socket = io.connect(self.server_url);
    })
  }

  self.isInitGlobalValue = false;
  self.initGlobalValue = function() {
    if (self.isInitGlobalValue) {
      return;
    }
    
    self.getSystemInfo(function() {
      self.isInitGlobalValue = true;
    });
  }

  self.login = function(userName, password, cb) {
    window.loggedin = false;
    console.log("login")
    var msg = {
      'org.zstack.header.identity.APILogInByAccountMsg': {
        accountName: userName,
        password: password
      }
    };

    var data = {'msg' : JSON.stringify(msg)};
    console.log(JSON.stringify(data, null, 2));
    $cookies.remove('sessionId');
    // self.socket = null;
    // self.connectWebsocket();
    self.socket.emit('login', data);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    self.socket.on('login_ret', function(ret) {
      window.loggedin = true;
      var retMsg = ZStackUtil.firstItem(JSON.parse(ret.msg));
      console.log(retMsg)
      // self.session = {};
      // self.session.uuid = retMsg.inventory.uuid;
      $cookies.put('sessionId', retMsg.inventory.uuid);
      console.log(retMsg.inventory.uuid);

      self.initGlobalValue();

      if (ZStackUtil.notNullnotUndefined(cb)) {
        cb();
      }
    });
  }

  self.call = function(msg, cb) {
    var sessionId = $cookies.get('sessionId');
    if (!sessionId) {
      $state.go('login');
      return;
    };
    
    var msgBody = ZStackUtil.firstItem(msg);
    msgBody.session = {};
    msgBody.session.uuid = sessionId;
    msgBody.session.callid = ZStackUtil.genUniqueId();
    if (!window.msgList)
      window.msgList = [];
    window.msgList.push(JSON.stringify(msg));
    var data = {'msg' : JSON.stringify(msg)};
    self.socket.emit('call', data);
    console.log(JSON.stringify(data, null, 2));
    self.cbList[msgBody.session.callid] = cb;
  }

  self.getSystemInfo = function(cb) {
    self.queryZone()
    .then(function(data) {
      if (data.inventories.length <= 0) {
        $state.go('init_wizard');
      } else {
        self.defaultZone = data.inventories[0];
        return self.queryCluster(
          {
            conditions: [{
              name: "zoneUuid",
              op: "=",
              value: data.inventories[0].uuid
            }]
          }
        );
      }
    })
    .then(function(data) {
      if (!data) return;
      self.defaultCluster = data.inventories[0];
      return self.queryL3Network();
    })
    .then(function(data) {
      if (!data) return;
      self.defaultL3Network = data.inventories[0];
      return self.getVolumeFormat();
    })
    .then(function(result) {
      if (!result) return;
      self.formatList = result.formats;
      return self.queryBackupStorage()
    }, function(reason) {
      console.log(reason)
    })
    .then(function(result) {
      if (!result) return;
      self.defaultBackupStorage = result.inventories[0]
      if (ZStackUtil.notNullnotUndefined(cb)) {
        cb();
      };
    }, function(reason) {
      console.log(reason)
    })

  }

  self.simpleCall = function(apiName, msgBody) {
    return $q(function(resolve, reject) {
      var msg = {};
      if (!ZStackUtil.notNullnotUndefined(msgBody))
        msgBody = {};
      msg[apiName] = msgBody;

      self.call(msg, function(data) {
        if (data.success)
          resolve(data);
        else
          reject(data);
      })
    });
  }

  self.simpleQuery = function(apiName, msgBody) {
    return $q(function(resolve, reject) {
      var msg = {};
      if (!ZStackUtil.notNullnotUndefined(msgBody))
        msgBody = {};
      msg[apiName] = msgBody;
      if (!ZStackUtil.notNullnotUndefined(msgBody.count))
        msgBody.count = false
      if (!ZStackUtil.notNullnotUndefined(msgBody.start))
        msgBody.start = 0
      if (!ZStackUtil.notNullnotUndefined(msgBody.replyWithCount))
        msgBody.replyWithCount = true
      if (!ZStackUtil.notNullnotUndefined(msgBody.conditions))
        msgBody.conditions = []

      self.call(msg, function(data) {
        if (data.success)
          resolve(data);
        else
          reject(data);
      })
    });
  }

  self.createZone = function (msgBody) {
    return self.simpleQuery('org.zstack.header.zone.APICreateZoneMsg', msgBody);
  }

  self.queryZone = function (msgBody) {
    return self.simpleQuery('org.zstack.header.zone.APIQueryZoneMsg', msgBody);
  }

  self.createCluster = function (msgBody) {
    return self.simpleQuery('org.zstack.header.cluster.APICreateClusterMsg', msgBody);
  }

  self.queryCluster = function (msgBody) {
    return self.simpleQuery('org.zstack.header.cluster.APIQueryClusterMsg', msgBody);
  }

  self.queryVmInstance = function(msgBody) {
    return self.simpleQuery('org.zstack.header.vm.APIQueryVmInstanceMsg', msgBody);
  }

  self.queryImage = function(msgBody) {
    return self.simpleQuery('org.zstack.header.image.APIQueryImageMsg', msgBody);
  }

  self.createL2NoVlanNetwork = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.l2.APICreateL2NoVlanNetworkMsg', msgBody);
  }

  self.createL2VlanNetwork = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.l2.APICreateL2VlanNetworkMsg', msgBody);
  }

  self.attachL2NetworkToCluster = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.l2.APIAttachL2NetworkToClusterMsg', msgBody);
  }

  self.createL3Network = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.l3.APICreateL3NetworkMsg', msgBody);
  }

  self.queryL3Network = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.l3.APIQueryL3NetworkMsg', msgBody);
  }

  self.queryInstanceOffering = function (msgBody) {
    return self.simpleQuery('org.zstack.header.configuration.APIQueryInstanceOfferingMsg', msgBody);
  }


  self.queryDiskOffering = function (msgBody) {
    return self.simpleQuery('org.zstack.header.configuration.APIQueryDiskOfferingMsg', msgBody);
  }

  self.queryVolume = function (msgBody) {
    return self.simpleQuery('org.zstack.header.volume.APIQueryVolumeMsg', msgBody);
  }

  self.queryHost = function (msgBody) {
    return self.simpleQuery('org.zstack.header.host.APIQueryHostMsg', msgBody);
  }

  self.queryBackupStorage = function (msgBody) {
    return self.simpleQuery('org.zstack.header.storage.backup.APIQueryBackupStorageMsg', msgBody);
  }

  self.addDns = function (msgBody) {
    return self.simpleCall('org.zstack.header.network.l3.APIAddDnsToL3NetworkMsg', msgBody);
  }

  self.attachNetworkService = function (msgBody) {
    return self.simpleCall('org.zstack.header.network.service.APIAttachNetworkServiceToL3NetworkMsg', msgBody);
  }

  self.queryNetworkServiceProvider = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.service.APIQueryNetworkServiceProviderMsg', msgBody);
  }

  self._getCapacityByAll = function(apiName) {
    return $q(function(resolve, reject) {
      var msg = {};
      msg[apiName] = {
          all: true
        }

      self.call(msg, function(data) {
        if (data.success)
          resolve(data);
        else
          reject(data);
      })
    });
  }

  self.getMemoryCpuCapacityByAll = function() {
    return self._getCapacityByAll("org.zstack.header.allocator.APIGetCpuMemoryCapacityMsg");
  }

  self.getPirmaryStorageCapacityByAll = function() {
    return self._getCapacityByAll("org.zstack.header.storage.primary.APIGetPrimaryStorageCapacityMsg");
  }

  self.getBackupStorageCapacityByAll = function() {
    return self._getCapacityByAll("org.zstack.header.storage.backup.APIGetBackupStorageCapacityMsg");
  }

  self.getIpAddressCapacityByAll = function() {
    return self._getCapacityByAll("org.zstack.header.network.l3.APIGetIpAddressCapacityMsg");
  }

  self.simpleMsg = function(msg) {
    return $q(function(resolve, reject) {
      self.call(msg, function(data) {
        if (data.success)
          resolve(data);
        else
          reject(data);
      })
    });
  }

  self.startVm = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.vm.APIStartVmInstanceMsg": {
        "uuid": uuid
      }
    });
  }

  self.stopVm = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.vm.APIStopVmInstanceMsg": {
        "uuid": uuid
      }
    });
  }

  self.rebootVm = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.vm.APIRebootVmInstanceMsg": {
        "uuid": uuid
      }
    });
  }

  self.destroyVm = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.vm.APIDestroyVmInstanceMsg": {
        "uuid": uuid
      }
    });
  }


  self.migrateVm = function(hostUuid, vmUuid) {
    return self.simpleMsg({
      "org.zstack.header.vm.APIRebootVmInstanceMsg": {
        "vmInstanceUuid": vmUuid,
        "hostUuid": hostUuid
      }
    });
  }

  self.changeInstanceOffering = function(instanceOfferingUuid, vmUuid) {
    return self.simpleMsg({
      "org.zstack.header.vm.APIChangeInstanceOfferingMsg": {
        "vmInstanceUuid": vmUuid,
        "instanceOfferingUuid": instanceOfferingUuid
      }
    });
  }

  self.attachVolume = function(volumeUuid, vmUuid) {
    return self.simpleMsg({
      "org.zstack.header.volume.APIAttachDataVolumeToVmMsg": {
        "volumeUuid": volumeUuid,
        "vmInstanceUuid": vmUuid
      }
    });
  }

  self.detachVolume = function(volumeUuid) {
    return self.simpleMsg({
      "org.zstack.header.volume.APIDetachDataVolumeFromVmMsg": {
        "uuid": volumeUuid
      }
    });
  }

  self.getVolumeFormat = function() {
    return self.simpleMsg({
      "org.zstack.header.volume.APIGetVolumeFormatMsg": {
      }
    });
  }

  self.addHost = function(msgBody) {
    return self.simpleCall('org.zstack.kvm.APIAddKVMHostMsg', msgBody);
  }

  self.enableHost = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.host.APIChangeHostStateMsg": {
        uuid: uuid,
        stateEvent: 'enable'
      }
    });
  }

  self.disableHost = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.host.APIChangeHostStateMsg": {
        uuid: uuid,
        stateEvent: 'disable'
      }
    });
  }

  self.reconnectHost = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.host.APIReconnectHostMsg": {
        uuid: uuid,
        status: 'Connecting'
      }
    });
  }

  self.maintainHost = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.host.APIChangeHostStateMsg": {
        uuid: uuid,
        status: 'maintain'
      }
    });
  }

  self.deleteHost = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.host.APIDeleteHostMsg": {
        uuid: uuid
      }
    });
  }

  self.addImage = function(msgBody) {
    return self.simpleCall('org.zstack.header.image.APIAddImageMsg', msgBody);
  }

  self.enableImage = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.image.APIChangeImageStateMsg": {
        uuid: uuid,
        stateEvent: 'enable'
      }
    });
  }

  self.disableImage = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.image.APIChangeImageStateMsg": {
        uuid: uuid,
        stateEvent: 'disable'
      }
    });
  }

  self.deleteImage = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.image.APIDeleteImageMsg": {
        uuid: uuid
      }
    });
  }

  self.addIpRange = function (msgBody) {
    return self.simpleQuery('org.zstack.header.network.l3.APIAddIpRangeMsg', msgBody);
  }

  self.deleteIpRange = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.network.l3.APIDeleteIpRangeMsg": {
        uuid: uuid
      }
    });
  }

  self.enableVolume = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.volume.APIChangeVolumeStateMsg": {
        uuid: uuid,
        stateEvent: 'enable'
      }
    });
  }

  self.disableVolume = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.volume.APIChangeVolumeStateMsg": {
        uuid: uuid,
        stateEvent: 'disable'
      }
    });
  }

  self.deleteVolume = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.volume.APIDeleteDataVolumeMsg": {
        uuid: uuid
      }
    });
  }

  self.addInstanceOffering = function(msgBody) {
    return self.simpleCall('org.zstack.header.configuration.APICreateInstanceOfferingMsg', msgBody);
  }

  self.enableInstanceOffering = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.configuration.APIChangeInstanceOfferingStateMsg": {
        uuid: uuid,
        stateEvent: 'enable'
      }
    });
  }

  self.disableInstanceOffering = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.configuration.APIChangeInstanceOfferingStateMsg": {
        uuid: uuid,
        stateEvent: 'disable'
      }
    });
  }

  self.deleteInstanceOffering = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.configuration.APIDeleteInstanceOfferingMsg": {
        uuid: uuid
      }
    });
  }

  self.enableDataOffering = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.configuration.APIChangeDiskOfferingStateMsg": {
        uuid: uuid,
        stateEvent: 'enable'
      }
    });
  }

  self.disableDataOffering = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.configuration.APIChangeDiskOfferingStateMsg": {
        uuid: uuid,
        stateEvent: 'disable'
      }
    });
  }

  self.deleteDataOffering = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.configuration.APIDeleteDiskOfferingMsg": {
        uuid: uuid
      }
    });
  }

  self.getConsole = function(uuid) {
    return self.simpleMsg({
      "org.zstack.header.console.APIRequestConsoleAccessMsg": {
        vmInstanceUuid: uuid
      }
    });
  }

  self.addLocalPrimaryStorage = function (msgBody) {
    return self.simpleCall('org.zstack.storage.primary.local.APIAddLocalPrimaryStorageMsg', msgBody);
  }

  self.attachPrimaryStorage = function (msgBody) {
    return self.simpleCall('org.zstack.header.storage.primary.APIAttachPrimaryStorageToClusterMsg', msgBody);
  }

  self.addSftpBackupStorage = function (msgBody) {
    return self.simpleCall('org.zstack.storage.backup.sftp.APIAddSftpBackupStorageMsg', msgBody);
  }

  self.attachBackupStorage = function (msgBody) {
    return self.simpleCall('org.zstack.header.storage.backup.APIAttachBackupStorageToZoneMsg', msgBody);
  }

  return self;
}])