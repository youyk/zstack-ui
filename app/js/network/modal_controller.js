'use strict';

angular.module('zstackUI.network.modal.controller',
    [
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddIpRangeModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/network/add_ip_range.html',
      controller: 'AddIpRangeModalInstanceCtrl',
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

}])

.controller('AddIpRangeModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;

  $scope.name = "";
  $scope.description = "";
  $scope.start = "";
  $scope.endIp = "";
  $scope.netmask = "";
  $scope.gateway = "";

  $scope.action = function(cb) {
    var systemTags = [];
    var msg = {
      'org.zstack.header.network.l3.APIAddIpRangeMsg': {
        name: self.name,
        description: self.description,
        l3NetworkUuid: ZStackApi.defaultL3Network.uuid,
        startIp: self.startIp,
        endIp: self.endIp,
        netmask: self.netmask,
        gateway: self.gateway
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