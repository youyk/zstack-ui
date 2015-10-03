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
              data.inventories[0].ipRanges[i].selected = false;
            }
            $scope.itemList = data.inventories;
          });
        });
      }
      
      $scope.queryList();

      $scope.$on("update:list", function() {
        $scope.queryList();
      })

      $scope.select = function(event, item) {
        if (event.ctrlKey) {
          item.selected = !item.selected;
        } else {
          for (var i in $scope.itemList[0].ipRanges) {
            $scope.itemList[0].ipRanges[i].selected = false;
          }
          item.selected = true;
        }
        $scope.selectList.length = 0;
        for (var i in $scope.itemList[0].ipRanges) {
          if ($scope.itemList[0].ipRanges[i].selected) {
            $scope.selectList.push($scope.itemList[0].ipRanges[i]);
          }
        }
      }

      $scope.delete = function() {
        for (var i in $scope.selectList) {
          ZStackApi.deleteIpRange($scope.selectList[i].uuid)
        }
      }
    }
  };
}])