'use strict';

angular.module('zstackUI.image.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('imageDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'image/directive.html',
    controller: function($scope) {
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
        ZStackApi.queryImage({
            start: $scope.pageItemCount * ($scope.pageIndex - 1),
            limit: $scope.pageItemCount,
            replyWithCount: true,
            sortBy: $scope.sortByField,
            sortDirection: $scope.sortDirection,
            conditions: conditions
          })
        .then(function(data) {
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

      $scope.enable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.enableImage($scope.selectList[i].uuid)
        }
      }

      $scope.disable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.disableImage($scope.selectList[i].uuid)
        }
      }

      $scope.delete = function() {
        for (var i in $scope.selectList) {
          ZStackApi.deleteImage($scope.selectList[i].uuid)
        }
      }
    }
  };
}])