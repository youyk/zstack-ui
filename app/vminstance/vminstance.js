'use strict';

angular.module('zstackUI.vminstance', ['zstackUI.services.api'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vminstance/', {
    templateUrl: 'vminstance/vminstance.html',
    controller: 'VmInstanceCtrl'
  });
}])

.controller('VmInstanceCtrl', ['$scope', 'ZStackApi', function($scope, ZStackApi) {
  console.log("VmInstanceCtrl")
  var msg = {
    'org.zstack.header.vm.APIQueryVmInstanceMsg': {
      count: false,
      start: 0,
      limit: 20,
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
      console.log(data);
    })
  });
}]);