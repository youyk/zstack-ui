'use strict';

angular.module('zstackUI.list_toolbar_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('listToolbarDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'list_toolbar_directive/directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.templateUrl = 'list_toolbar_directive/morePopoverTemplate.html';

      $scope.prev = function() {
        if ($scope.pageIndex > 1) {
          $scope.pageIndex--;
          $scope.queryList();
        }
      }

      $scope.next = function() {
        if ($scope.pageIndex < $scope.pageCount) {
          $scope.pageIndex++;
          $scope.queryList();
        }
      }

      $scope.pageChanged = function() {
        $scope.queryList();
      }

      $scope.go = function() {
        $scope.queryList();
      }

      $scope.selectPageItemCount = function(item) {
        $scope.pageItemCount = item;
        $scope.queryList();
      }

      $scope.selectSortBy = function(item) {
        $scope.sortByField = item;
        $scope.queryList();
      }

      $scope.selectSortDirection = function(item) {
        $scope.sortDirection = item;
        $scope.queryList();
      }

      $scope.selectSearchField = function(item) {
        $scope.searchField = item;
      }

      $scope.search = function() {
        if (0 == $scope.searchString.length) {
          $scope.conditions = [];
        } else {
          $scope.conditions = [{
            name: $scope.searchField,
            op: "like",
            value: '%'+$scope.searchString+'%'
          }]
        }
        $scope.pageIndex = 1;
        $scope.queryList();
      }
    }
  };
}])