'use strict';

angular.module('zstackUI.security_group.details_directive',
    ['zstackUI.services.api',
     'zstackUI.services.util'])

.directive('securityGroupDetailsDirective', ['ZStackApi', 'ZStackUtil', function(ZStackApi, ZStackUtil) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/security_group/details_directive.html',
    controller: function($scope) {
      $scope.ZStackApi = ZStackApi;
      $scope.ZStackUtil = ZStackUtil;

      $scope.selectAllRuleItems = false
      $scope.selectRuleList = [];
      $scope.selectAllNicItems = false
      $scope.selectNicList = [];

      $scope.collapse = function() {
        $scope.data.collapsed = !$scope.data.collapsed
      }

      function operationCb(result) {
        $scope.data.state = result.inventory.state;
      }

      $scope.enable = function() {
        ZStackApi.enableSecurityGroup($scope.data.uuid)
        .then(operationCb);
        $scope.data.state = "Enabling";
      }

      $scope.disable = function() {
        ZStackApi.disableSecurityGroup($scope.data.uuid)
        .then(operationCb);
        $scope.data.state = "Disabling";
      }

      $scope.delete = function() {
        ZStackApi.deleteSecurityGroup($scope.data.uuid)
        .then(function(result) {
          $scope.$emit("update:list");
        });
        $scope.data.state = "Removing";
      }

      $scope.selectRuleItem = function(item) {
        $scope.selectRuleList.length = 0;
        for (var i in $scope.data.rules) {
          if ($scope.data.rules[i].selected) {
            $scope.selectRuleList.push($scope.data.rules[i]);
          }
        }
        if ($scope.selectRuleList.length == $scope.data.rules.length) {
          $scope.selectAllRuleItems = true;
        } else {
          $scope.selectAllRuleItems = false;
        }
      }

      $scope.clickRuleItem = function(item) {
        $scope.selectRuleList.length = 0;
        for (var i in $scope.data.rules) {
          if ($scope.data.rules[i].uuid == item.uuid)
            $scope.data.rules[i].selected = true;
          else
            $scope.data.rules[i].selected = false;
        }
        $scope.selectRuleItem(item);
      }

      $scope.selectAllRules = function() {
        $scope.selectRuleList.length = 0;
        for (var i in $scope.data.rules) {
          $scope.data.rules[i].selected = $scope.selectAllRuleItems;
          if ($scope.data.rules[i].selected) {
            $scope.selectRuleList.push($scope.data.rules[i]);
          }
        }
      }

      $scope.deleteRules = function(rules) {
        var uuids = [];
        for (var i = 0; i < rules.length; i++) {
          uuids.push(rules[i].uuid);
        }
        ZStackApi.deleteSecurityGroupRule(uuids)
        .then(function(result) {
          $scope.$emit("update:list");
        })
      }

      $scope.selectNicItem = function(item) {
        $scope.selectNicList.length = 0;
        for (var i in $scope.data.nics) {
          if ($scope.data.nics[i].selected) {
            $scope.selectNicList.push($scope.data.nics[i]);
          }
        }
        if ($scope.selectNicList.length == $scope.data.nics.length) {
          $scope.selectAllNicItems = true;
        } else {
          $scope.selectAllNicItems = false;
        }
      }

      $scope.clickNicItem = function(item) {
        $scope.selectNicList.length = 0;
        for (var i in $scope.data.nics) {
          if ($scope.data.nics[i].uuid == item.uuid)
            $scope.data.nics[i].selected = true;
          else
            $scope.data.nics[i].selected = false;
        }
        $scope.selectNicItem(item);
      }

      $scope.selectAllNics = function() {
        $scope.selectNicList.length = 0;
        for (var i in $scope.data.nics) {
          $scope.data.nics[i].selected = $scope.selectAllNicItems;
          if ($scope.data.nics[i].selected) {
            $scope.selectNicList.push($scope.data.nics[i]);
          }
        }
      }

      $scope.deleteNics = function(nics) {
        var uuids = [];
        for (var i = 0; i < nics.length; i++) {
          uuids.push(nics[i].uuid);
        }
        ZStackApi.deleteVmNicFromSecurityGroup(uuids, $scope.data.uuid)
        .then(function(result) {
          $scope.$emit("update:list");
        })
      }

      $scope.$on("child-dialog:close", function(_, msg) {
        console.log(msg)
        if (!ZStackUtil.notNullnotUndefined(msg))
          return;
        switch (msg.name) {
          case "host":
            ZStackApi.migrateVm(msg.data.uuid, $scope.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });;
            break;
          case "instanceOffering":
            ZStackApi.changeInstanceOffering(msg.data.uuid, $scope.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });;
            break;
          case "dataVolume":
            ZStackApi.attachVolume(msg.data.uuid, $scope.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });
            break;
          case "currentDataOffering":
            ZStackApi.detachVolume(msg.data.uuid)
            .then(function(result) {
              console.log(result)
            }, function(reason) {
              console.log(reason)
            });;
            break;
          default:
            break;
        }

        $scope.showDialog = true;
      })
    }
  };
}])