'use strict';

angular.module('zstackUI.volume.directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('volumeDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'js/volume/directive.html',
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
        ZStackApi.queryVolume({
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

      function operationCb(result) {
        for (var i in $scope.itemList) {
          if (result.inventory.uuid == $scope.itemList[i].uuid)
            $scope.itemList[i].state = result.inventory.state;
            $scope.itemList[i].status = result.inventory.status; 
        } 
      }

      $scope.enable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.enableVolume($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].state = "Enabling";
        }
      }

      $scope.disable = function() {
        for (var i in $scope.selectList) {
          ZStackApi.disableVolume($scope.selectList[i].uuid)
          .then(function() {
            $scope.selectList[i].state = 'Disabled'
          });
          $scope.selectList[i].state = "Disabling";
        }
      }

      $scope.detach = function() {
        for (var i in $scope.selectList) {
          ZStackApi.detachVolume($scope.selectList[i].uuid)
          .then(operationCb);
          $scope.selectList[i].status = "Detaching";
        }
      }

      $scope.delete = function() {
        for (var i in $scope.selectList) {
          ZStackApi.deleteVolume($scope.selectList[i].uuid)
          .then(function(result) {
            $scope.queryList();
          })
        }
        $scope.selectList = [];
      }
    }]
  };
}])