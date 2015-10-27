'use strict';

angular.module('zstackUI.network.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('networkDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'js/network/directive.html',
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

      $scope.select = function(item) {
        $scope.selectList.length = 0;
        for (var i in $scope.itemList[0].ipRanges) {
          if ($scope.itemList[0].ipRanges[i].selected) {
            $scope.selectList.push($scope.itemList[0].ipRanges[i]);
          }
        }
        if ($scope.selectList.length == $scope.itemList[0].ipRanges.length) {
          $scope.selectAllItems = true;
        } else {
          $scope.selectAllItems = false;
        }
      }

      $scope.selectAll = function() {
        $scope.selectList.length = 0;
        for (var i in $scope.itemList[0].ipRanges) {
          $scope.itemList[0].ipRanges[i].selected = $scope.selectAllItems
          if ($scope.itemList[0].ipRanges[i].selected) {
            $scope.selectList.push($scope.itemList[0].ipRanges[i]);
          }
        }
      }

      $scope.delete = function() {
        for (var i in $scope.selectList) {
          ZStackApi.deleteIpRange($scope.selectList[i].uuid)
          .then(function(result) {
            $scope.queryList();
          })
        }
        $scope.selectList = [];
      }
      
      $scope.queryList = function() {
        ZStackApi.queryL3Network()
        .then(function(data) {
          if (data.inventories.length <= 0)
            return;
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
    }]
  };
}])