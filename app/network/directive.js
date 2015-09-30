'use strict';

angular.module('zstackUI.network.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('networkDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'network/directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;
      if (!$scope.selectList) {
        $scope.selectList = [];
      };
      
      $scope.queryList = function() {
        ZStackApi.queryL3Network()
        .then(function(data) {
          $scope.safeApply(function() {
            for (var i in data.inventories[0].ipRanges) {
              data.inventories[0].ipRanges[i].collapsed = true;
              data.inventories[0].ipRanges[i].selected = true;
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