'use strict';

angular.module('zstackUI.services.api', ['zstackUI.services.util'])

.factory('ZStackApi', ['ZStackUtil', function(ZStackUtil) {
  console.log(ZStackUtil)
  var self = {}
  self.debugLogin = function(cb) {
    console.log("debugLogin")
    if (self.socket) {
      cb();
      return;
    }
    self.login('admin',
       'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        cb);
  }

  self.cbList = []

  self.connectWebsocket = function() {
    if (self.socket) return;

    self.socket = io.connect('http://123.183.211.57:5000');
    // self.socket = io.connect('http://192.168.1.107:5000');
    // self.socket = io.connect('http://10.238.145.58:5000');

    self.socket.on('disconnect', function() {
      self.socket = null;
    })
  }

  self.login = function(userName, password, cb) {
    console.log("login")
    var msg = {
      'org.zstack.header.identity.APILogInByAccountMsg': {
        accountName: userName,
        password: password
      }
    };

    var data = {'msg' : JSON.stringify(msg)};
    console.log(JSON.stringify(data, null, 2));
    self.connectWebsocket();
    self.socket.emit('login', data);
    self.socket.on('login_ret', function(ret) {
      var retMsg = ZStackUtil.firstItem(JSON.parse(ret.msg));
      console.log(retMsg)
      self.session = {};
      self.session.uuid = retMsg.inventory.uuid;
      console.log(JSON.stringify(self.session));
      self.socket.on('call_ret', function(data) {
        var ret = JSON.parse(data.msg);
        var msg = ZStackUtil.firstItem(ret);
        self.cbList[msg.session.callid](msg);
        delete self.cbList[msg.session.callid];
      });
      if (ZStackUtil.notNullnotUndefined(cb)) {
        cb();
      }
    });
  }

  self.call = function(msg, cb) {
    var msgBody = ZStackUtil.firstItem(msg);
    msgBody.session = {};
    msgBody.session.uuid = self.session.uuid;
    msgBody.session.callid = ZStackUtil.genUniqueId();
    var data = {'msg' : JSON.stringify(msg)};
    self.socket.emit('call', data);
    console.log(JSON.stringify(data, null, 2));
    self.cbList[msgBody.session.callid] = cb;
  }
  return self;
}])