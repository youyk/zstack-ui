'use strict';

angular.module('zstackUI.instance_offering.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('instanceOfferingDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'instance_offering/directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;
      if (!$scope.selectList) {
        $scope.selectList = [];
      };
      
      $scope.queryList = function() {
        ZStackApi.queryInstanceOffering(
          {
            conditions: [{
              name: "type",
              op: "=",
              value: "UserVm"
            }]
          }
        )
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