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
      
      $scope.queryList = function() {
        ZStackApi.queryImage()
        .then(function(data) {
          $scope.safeApply(function() {
            for (var i in data.inventories) {
              data.inventories[i].collapsed = true;
              data.inventories[i].selected = false;
            }
            $scope.itemList = data.inventories;
          });
        })
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