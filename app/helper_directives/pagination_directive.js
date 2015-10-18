'use strict';

angular.module('zstackUI.pagination_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('paginationDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    templateUrl: 'helper_directives/pagination_directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.selectPageItemCount = function(item) {
        $scope.pageItemCount = item;
        $scope.queryList();
      }

      $scope.pageChanged = function() {
        $scope.queryList();
      }
    }
  };
}])