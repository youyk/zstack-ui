'use strict';

angular.module('zstackUI.host.modal.controller',
    [
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.controller('AddHostModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/host/add_host.html',
      controller: 'AddHostModalInstanceCtrl',
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

.controller('AddHostModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.showDialog = true;

  $scope.name = "";
  $scope.description = "";
  $scope.hostIp = "";
  $scope.userName = "";
  $scope.password = "";

  $scope.action = function(cb) {
    var systemTags = [];
    var msg = {
      'org.zstack.kvm.APIAddKVMHostMsg': {
        name: self.name,
        description: self.description,
        managementIp: self.hostIp,
        clusterUuid: ZStackApi.defaultCluster.uuid,
        username: self.userName,
        password: self.password
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