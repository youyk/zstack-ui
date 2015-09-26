'use strict';

angular.module('zstackUI.instance.details_directive',
    ['zstackUI.services.api', 'zstackUI.instance.modal.controller'])

.directive('detailsDirective', ['ZStackApi', function(ZStackApi) {
  return {
    scope: {
      vm: '=ngModel',
    },
    templateUrl: 'instance/details_directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      console.log("ZStackApi..........................")
      console.log(ZStackApi)

      $scope.$on("child-dialog:close", function(_, msg) {
        console.log(msg)
        // $scope.showDialog = true;
        // if (ZStackUtil.notNullnotUndefined(msg))
        //   $scope[msg.name] = msg.data;
      })
    }
  };
}])