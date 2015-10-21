'use strict';

angular.module('zstackUI.image',
    [
    'zstackUI.image.modal.controller',
    'zstackUI.image.directive',
    'zstackUI.image.details',
    'zstackUI.services.api',
    'zstackUI.services.util'
    ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main.image', {
    url: '/image',
    templateUrl: 'js/image/image.html',
    controller: 'ImageCtrl'
  });
}])
.controller('ImageCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', 
                                 function($scope, ZStackApi, ZStackUtil) {

}])