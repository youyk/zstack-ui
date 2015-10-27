'use strict';

angular.module('zstackUI.instance_offering.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('instanceOfferingDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'js/instance_offering/directive.html',
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
        'state',
        'status'
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
        ZStackApi.queryInstanceOffering(
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
            for (var i in data.inventories) {
              data.inventories[i].collapsed = true;
              data.inventories[i].selected = false;
              data.inventories[i].volumeTotalIops = "";
              data.inventories[i].volumeTotalBandwidth = "";
              data.inventories[i].networkOutboundBandwidth = "";
              ZStackApi.querySystemTag('InstanceOfferingVO', data.inventories[i].uuid)
              .then(function(result) {
                console.log(result);
                for (var j in result.inventories) {
                  var values = result.inventories[j].tag.split('::');
                  for (var k in data.inventories) {
                    if (data.inventories[k].uuid == result.inventories[j].resourceUuid) {
                      data.inventories[k][values[0]] = values[1];
                      break;
                    }
                  }
                }
              })
            }
            $scope.itemList = data.inventories;
          });
        })
      }
      
      $scope.queryList();

      function operationCb(result) {
        for (var i in $scope.itemList) {
          if (result.inventory.uuid == $scope.itemList[i].uuid)
            $scope.itemList[i].state = result.inventory.state;
        }
      }

      $scope.enable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.enableInstanceOffering($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Enabling";
        }
      }

      $scope.disable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.disableInstanceOffering($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Disabling";
        }
      }

      $scope.delete = function() {
        for (var i in $scope.selectList) {
          ZStackApi.deleteInstanceOffering($scope.selectList[i].uuid)
          .then(function(result) {
            $scope.queryList();
          });
        }
        $scope.selectList = [];
      }
    }]
  };
}])