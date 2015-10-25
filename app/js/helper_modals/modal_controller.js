'use strict';

angular.module('zstackUI.helper_modals',
    [
      'zstackUI.services.api',
      'zstackUI.image.directive',
    ])

.controller('InstanceModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/instance.html',
      controller: 'InstanceModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('InstanceModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    $modalInstance.close({
      name: "instance",
      data: $scope.selectList[0]
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('CurrentDataOfferingModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;

  $scope.open = function(allVolumes) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/current_data_offering.html',
      controller: 'CurrentDataOfferingModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        allVolumes: function () {
          return allVolumes;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('CurrentDataOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'allVolumes', function ($scope, ZStackApi, $modalInstance, allVolumes) {
  console.log(allVolumes)

  $scope.allVolumes = allVolumes;

  $scope.select = function(dataOffering) {
    console.log(dataOffering)
    $scope.dataOffering = dataOffering;
  }

  $scope.ok = function () {
    $modalInstance.close({
      name: "currentDataOffering",
      data: $scope.dataOffering
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('ImageModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/image.html',
      controller: 'ImageModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('ImageModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    $modalInstance.close({
      name: "image",
      data: $scope.selectList[0]
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('InstanceOfferingModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/instance_offering.html',
      controller: 'InstanceOfferingModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('InstanceOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    $modalInstance.close({
      name: "instanceOffering",
      data: $scope.selectList[0]
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('DataOfferingModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/data_offering.html',
      controller: 'DataOfferingModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('DataOfferingModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    $modalInstance.close({
      name: "dataOffering",
      data: $scope.selectList[0]
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('DataVolumeModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/data_volume.html',
      controller: 'DataVolumeModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('DataVolumeModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    $modalInstance.close({
      name: "dataVolume",
      data: $scope.selectList[0]
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('HostModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/host.html',
      controller: 'HostModalInstanceCtrl',
      backdrop: 'static',
      size: "lg",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('HostModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    $modalInstance.close({
      name: "host",
      data: $scope.selectList[0]
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('ConfirmModalCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  var self = $scope;
  $scope.data = {};

  $scope.open = function (cb) {

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'js/helper_modals/confirm.html',
      controller: 'ConfirmModalInstanceCtrl',
      backdrop: 'static',
      size: "sm",
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (msg) {
      $scope.$emit("child-dialog:close", msg);
      cb();
    }, function () {
      $scope.$emit("child-dialog:close");
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.$emit("child-dialog:open");
  };
}])

.controller('ConfirmModalInstanceCtrl', ['$scope', 'ZStackApi', '$modalInstance', 'data', function ($scope, ZStackApi, $modalInstance, data) {
  $scope.ok = function () {
    if ('ok' == $scope.confirm)
      $modalInstance.close({});
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);