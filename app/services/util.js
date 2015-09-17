'use strict';

angular.module('zstackUI.services.util', [])

.factory('ZStackUtil', function() {
  var self = {}

  self.notUndefined = function(arg) {
    return typeof arg !== 'undefined';
  }

  self.notNullnotUndefined = function(arg) {
    return this.notUndefined(arg) && arg != null;
  }

  self.notNullnotUndefinedNotEmptyString = function(arg) {
    return this.notNullnotUndefined(arg) && arg != "";
  }

  self.firstItem = function(obj) {
    return obj[Object.keys(obj)[0]];
  }

  self.isEmptyObject = function(obj) {
    if (!this.notNullnotUndefined(obj)) {
        return true;
    }

    for(var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  self.genUniqueId = function() {
    function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    }
    return "zs-" + randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  self.bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  return self;
})