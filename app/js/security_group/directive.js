'use strict';

angular.module('zstackUI.security_group.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('securityGroupDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'js/security_group/directive.html',
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
      $scope.defaultConditions = [];
      $scope.searchFieldList = [
        'name',
        'uuid'
      ];
      $scope.searchField = $scope.searchFieldList[0];
      
      $scope.queryList = function() {
        var conditions = $scope.defaultConditions.concat($scope.conditions);
        ZStackApi.querySecurityGroup(
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
          console.log(data)
          $scope.safeApply(function() {
            $scope.pageCount = Math.ceil(data.total / $scope.pageItemCount);
            for (var i in data.inventories) {
              data.inventories[i].collapsed = true;
              data.inventories[i].selected = false;
            }
            $scope.itemList = data.inventories;
          });
        })
      }
      
      $scope.queryList();

      $scope.queryNics = function(item) {
        ZStackApi.queryVmNic({
          conditions: [{
            name: 'securityGroup.uuid',
            op: '=',
            value: item.uuid
          }]
        })
        .then(function(result) {
          console.log(result);
          item.nics = result.inventories;
        })
      }

      $scope.expand = function(item) {
        item.collapsed = !item.collapsed;
        $scope.queryNics(item);
      }

      function operationCb(result) {
        for (var i in $scope.itemList) {
          if (result.inventory.uuid == $scope.itemList[i].uuid)
            $scope.itemList[i].state = result.inventory.state;
        }
      }

      $scope.enable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.enableSecurityGroup($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Enabling";
        }
      }

      $scope.disable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.disableSecurityGroup($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Disabling";
        }
      }

      $scope.delete = function() {
        for (var i in $scope.selectList) {
          ZStackApi.deleteSecurityGroup($scope.selectList[i].uuid)
          .then(function(result) {
            $scope.queryList();
          })
        }
        $scope.selectList = [];
      }
    }]
  };
}])