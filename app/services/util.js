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

  self.toFixed = function( num, precision ) {
      var multiplier = Math.pow( 10, precision + 1 ),
          wholeNumber = Math.floor( num * multiplier );
      return Math.round( wholeNumber / 10 ) * 10 / multiplier;
  }

  self.sizeRoundToString = function(size) {
    var K = 1024;
    var M = K * K;
    var G = M * K;
    var T = G * K;
    var P = T * K;

    var sizeMap = {
        'K': K,
        'M': M,
        'G': G,
        'T': T,
        'P': P
    };

    var suffixes = ['P', 'T', 'G', 'M', 'K'];
    function round() {
      var s = suffixes.shift();
      if (!self.notNullnotUndefined(size)) {
          return size+ ' Bytes';
      }

      var q = sizeMap[s];
      var ret = size / q;
      if (ret >= 1) {
          return self.toFixed(ret, 2) + ' ' + s;
      } else {
          return round()
      }
    }

    return round();
  }

  self.toSizeString = function(input) {
    try {
      return self.sizeRoundToString(parseInt(input));
    } catch (e) {
      return input;
    }
  }

  self.toPercentageString = function(input) {
    var per = parseFloat(input) * 100;
    var perStr = per.toString();
    if (perStr.length > 5) {
      perStr = perStr.slice(0, 5);
    }
    return perStr+'%';
  }

  self.toMHZString = function(input) {
    return input + ' MHZ';
  }

  self.parseSize = function(sizeStr) {
    var K = 1024;
    var M = K * K;
    var G = M * K;
    var T = G * K;
    var P = T * K;

    var sizeMap = {
        'K': K,
        'M': M,
        'G': G,
        'T': T,
        'P': P
    };
    var quantity = sizeStr.substr(sizeStr.length-1, 1);
    var size = parseInt(sizeStr);
    if (quantity == 'K' || quantity == 'k') {
      return size * K;
    } else if (quantity == 'M' || quantity == 'm') {
      return size * M;
    } else if (quantity == 'G' || quantity == 'g') {
      return size * G;
    } else if (quantity == 'T' || quantity == 't') {
      return size * T;
    } else if (quantity == 'P' || quantity == 'p') {
      return size * P;
    } else {
      return parseInt(sizeStr);
    }
  }

  self.initListScope = function(scope) {
      scope.pageIndex = 1;
      scope.pageItemCountList = [5, 10, 20, 50];
      scope.pageItemCount = scope.pageItemCountList[2];
      scope.pageCount = 0;
      scope.sortDirectionList = [
        'asc',
        'desc'
      ];
      scope.sortDirection = scope.sortDirectionList[0];
      scope.conditions = [];

      scope.$on("update:list", function() {
        scope.queryList();
      })

      scope.select = function(event, item) {
        if (event.ctrlKey) {
          item.selected = !item.selected;
        } else {
          for (var i in scope.itemList) {
            scope.itemList[i].selected = false;
          }
          item.selected = true;
        }
        scope.selectList.length = 0;
        for (var i in scope.itemList) {
          if (scope.itemList[i].selected) {
            scope.selectList.push(scope.itemList[i]);
          }
        }
      }
  }



  return self;
})