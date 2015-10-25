'use strict';

angular.module('zstackUI.instance.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('instanceDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'js/instance/directive.html',
    link: function (scope, element, attrs) {
      scope.simple = !!attrs.simple;
    },
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      if (!$scope.selectList) {
        $scope.selectList = [];
      };

      ZStackUtil.initListScope($scope);

      $scope.sortByFieldList = [
        'name',
        'createDate',
        'lastOpDate',
        'memorySize',
        'platform',
        'state'
      ];
      $scope.sortByField = $scope.sortByFieldList[0];
      $scope.defaultConditions = [{
          name: "type",
          op: "=",
          value: "UserVm"
        }];
      $scope.searchFieldList = [
        'name',
        'uuid'
      ];
      $scope.searchField = $scope.searchFieldList[0];

      $scope.queryList = function() {
        var conditions = $scope.defaultConditions.concat($scope.conditions);
        ZStackApi.queryVmInstance(
          {
            start: $scope.pageItemCount * ($scope.pageIndex - 1),
            limit: $scope.pageItemCount,
            replyWithCount: true,
            sortBy: $scope.sortByField,
            sortDirection: $scope.sortDirection,
            conditions: conditions
          }
        )
        .then(function(data) {
          $scope.safeApply(function() {
            $scope.pageCount = Math.ceil(data.total / $scope.pageItemCount);
            var hostUuids = [];
            for (var i in data.inventories) {
              data.inventories[i].collapsed = true;
              data.inventories[i].selected = false;
              if (data.inventories[i].state = "Running")
                hostUuids.push(data.inventories[i].hostUuid)
            }

            ZStackApi.queryHost({
                start: 0,
                replyWithCount: true,
                conditions: [{name: 'uuid', op: 'in', value: hostUuids.join()}]
              })
            .then(function(result) {
              var vms = $scope.itemList;
              var hosts = result.inventories;
              for(var i in vms) {
                for (var j in hosts) {
                  if (vms[i].hostUuid == hosts[j].uuid) {
                    vms[i].managementIp = hosts[j].managementIp;
                  }
                }
              }
            })
            $scope.itemList = data.inventories;
          });
        });
      }
      
      $scope.queryList();

      function operationCb(result) {
        for (var i in $scope.itemList) {
          if (result.inventory.uuid == $scope.itemList[i].uuid)
            $scope.itemList[i].state = result.inventory.state;
        } 
      }

      $scope.start = function() {
        for (var i in $scope.selectList) {
          if ($scope.selectList[i].state != "Stopped")
            continue;
          ZStackApi.startVm($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Starting";
        }
      }

      $scope.stop = function() {
        for (var i in $scope.selectList) {
          if ($scope.selectList[i].state != "Running")
            continue;
          ZStackApi.stopVm($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Stopping";
        }
      }

      $scope.reboot = function() {
        for (var i in $scope.selectList) {
          if ($scope.selectList[i].state != "Running")
            continue;
          ZStackApi.rebootVm($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Rebooting";
        }
      }

      $scope.destroy = function() {
        for (var i in $scope.selectList) {
          ZStackApi.destroyVm($scope.selectList[i].uuid)
          .then(function(result) {
            $scope.queryList();
          })
        }
      }
    }]
  };
}])