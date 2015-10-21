'use strict';

angular.module('zstackUI.search_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('searchDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'js/helper_directives/search_directive.html',
    controller: ['$scope', function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;


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
    }]
  };
}])