'use strict';

angular.module('zstackUI.volume.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('volumeDetailsDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/volume/details_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.treeOptions = {
        nodeChildren: "children",
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "zs-tree-branch-head-expanded",
            iCollapsed: "zs-tree-branch-head-collapsed",
            iLeaf: "zs-tree-leaf-head",
            label: "zs-tree-node",
            labelSelected: "zs-tree-node-selected"
        }
      };

      $scope.querySnapshotTree = function(item) {
        ZStackApi.queryVolumeSnapshotTree({
          conditions: [{
            name: 'volumeUuid',
            op: '=',
            value: item.uuid
          }]
        })
        .then(function(result) {
          console.log(result);
          item.snapshotTreeRoot = result.inventories[0].tree;
        })
      }

      $scope.$on("update:snapshot", function() {
        $scope.querySnapshotTree($scope.data);
      })

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      function operationCb(result) {
        $scope.data.state = result.inventory.state;
        $scope.data.status = result.inventory.status;
      }

      $scope.enable = function() {
        ZStackApi.enableVolume($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Enabling";
      }

      $scope.disable = function() {
        ZStackApi.disableVolume($scope.data.uuid)
        .then(operationCb)
        $scope.data.state = "Disabling";
      }

      $scope.detach = function() {
        ZStackApi.detachVolume($scope.data.uuid)
        .then(function() {
          $scope.data.vmInstanceUuid = undefined;
        });
      }

      $scope.delete = function() {
        ZStackApi.deleteVolume($scope.data.uuid)
        .then(function() {
          $scope.$emit("update:list");
        })
      }

      $scope.revertSnapshot = function(item) {
        ZStackApi.revertVolumeFromSnapshot(item.uuid)
        .then(function() {
          $scope.querySnapshotTree($scope.data);
        })
      }

      $scope.backupSnapshot = function(item) {
        ZStackApi.backupVolumeFromSnapshot(item.uuid)
        .then(function() {
          $scope.querySnapshotTree($scope.data);
        })
      }

      $scope.deleteSnapshot = function(item) {
        ZStackApi.deleteVolumeSnapshot(item.uuid)
        .then(function() {
          $scope.querySnapshotTree($scope.data);
        })
      }

      $scope.$on("child-dialog:close", function(_, msg) {
        console.log(msg)
        if (!ZStackUtil.notNullnotUndefined(msg))
          return;
        ZStackApi.attachVolume($scope.data.uuid, msg.data.uuid);

      })
    }]
  };
}])