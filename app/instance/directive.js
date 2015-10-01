'use strict';

angular.module('zstackUI.instance.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('instanceDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'instance/directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      if (!$scope.selectList) {
        $scope.selectList = [];
      };

      ZStackUtil.initListToolbar($scope);

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
            for (var i in data.inventories) {
              data.inventories[i].collapsed = true;
              data.inventories[i].selected = false;
            }
            $scope.itemList = data.inventories;
          });
        });
      }
      
      ZStackApi.debugLogin(function() {
        $scope.queryList();
      });

      $scope.$on("update:list", function() {
        $scope.queryList();
      })

      $scope.select = function(event, item) {
        if (event.ctrlKey) {

        } else {
          $scope.selectList.length = 0;
          $scope.selectList.push(item);
          for (var i in $scope.itemList) {
            $scope.itemList[i].selected = false;
          }
          item.selected = true;
        }
      }
    }
  };
}])