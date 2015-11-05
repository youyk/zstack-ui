'use strict';

angular.module('zstackUI.security_group.modal.controller',
    [
      'zstackUI.services.api',
      'zstackUI.services.util'
    ])

.controller('AddSecurityGroupModalCtrl', ['$scope', '$modal', 'ZStackUtil', function ($scope, $modal, ZStackUtil) {

  ZStackUtil.initLaunchModalScope($scope, $modal, 'js/security_group/add_security_group.html', 'AddSecurityGroupModalInstanceCtrl');

}])

.controller('AddSecurityGroupModalInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.name = "";
  $scope.description = "";
  $scope.rules = [];
  $scope.selectRuleList = [];

  ZStackUtil.initModalScope($scope, $modalInstance, modalScope);

  $scope.selectRuleItem = function(item) {
    $scope.selectRuleList.length = 0;
    for (var i in $scope.rules) {
      if ($scope.rules[i].selected) {
        $scope.selectRuleList.push($scope.rules[i]);
      }
    }
    if ($scope.selectRuleList.length == $scope.rules.length) {
      $scope.selectAllRuleItems = true;
    } else {
      $scope.selectAllRuleItems = false;
    }
  }

  $scope.clickRuleItem = function(item) {
    $scope.selectRuleList.length = 0;
    for (var i in $scope.rules) {
      if ($scope.rules[i].uuid == item.uuid)
        $scope.rules[i].selected = true;
      else
        $scope.rules[i].selected = false;
    }
    $scope.selectRuleItem(item);
  }

  $scope.selectAllRules = function() {
    $scope.selectRuleList.length = 0;
    for (var i in $scope.rules) {
      $scope.rules[i].selected = $scope.selectAllRuleItems;
      if ($scope.rules[i].selected) {
        $scope.selectRuleList.push($scope.rules[i]);
      }
    }
  }

  $scope.deleteRules = function(rules) {
    for (var i = 0; i < rules.length; i++) {
      for (var j = 0; j < $scope.rules.length; j++) {
        if ($scope.rules[j] === rules[i]) {
          $scope.rules.splice(j, 1);
          break;
        }
      };
    }
  }



  $scope.action = function() {
    ZStackApi.createSecurityGroup({
      name: $scope.name,
      description: $scope.description
    })
    .then(function (result) {
      $scope.uuid = result.inventory.uuid
      if ($scope.rules.length > 0) {
        return ZStackApi.addSecurityGroupRule({
          rules: $scope.rules,
          securityGroupUuid: $scope.uuid
        })
      } else {
        return ZStackApi.dummyPromise({});
      }
    })
    .then(function (result) {
      return ZStackApi.attachSecurityGroupToL3Network({
        securityGroupUuid: $scope.uuid,
        l3NetworkUuid: ZStackApi.defaultL3Network.uuid
      })
    })
    .then(function (result) {
      modalScope.$emit("update:list");
    });
  }
}])

.controller('AddRuleModalCtrl', ['$scope', '$modal', 'ZStackUtil', function ($scope, $modal, ZStackUtil) {

  ZStackUtil.initLaunchModalScope($scope, $modal, 'js/security_group/add_rule.html', 'AddRuleInstanceCtrl');

  $scope.$on("add:rule", function(event, data) {
    $scope.rules.push(data)
  })

}])

.controller('AddRuleModalCtrl2', ['$scope', '$modal', 'ZStackApi', 'ZStackUtil', function ($scope, $modal, ZStackApi, ZStackUtil) {

  ZStackUtil.initLaunchModalScope($scope, $modal, 'js/security_group/add_rule.html', 'AddRuleInstanceCtrl');

  $scope.$on("add:rule", function(event, data) {
    ZStackApi.addSecurityGroupRule({
      rules: [data],
      securityGroupUuid: $scope.data.uuid
    })
    .then(function (result) {
      $scope.$emit("update:list");
    })
  })
}])

.controller('AddRuleInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;
  $scope.typeList = ["Ingress", "Egress"];
  $scope.type = $scope.typeList[0];
  $scope.protocolList = ["TCP", "UDP", "ICMP"];
  $scope.protocol = $scope.protocolList[0];

  ZStackUtil.initModalScope($scope, $modalInstance, modalScope);

  $scope.select = function(name, value) {
    $scope[name] = value;
  }

  $scope.ok = function() {
    modalScope.$emit("add:rule", {
      type: $scope.type,
      startPort: $scope.startPort,
      endPort: $scope.endPort,
      protocol: $scope.protocol,
      allowedCidr: $scope.allowedCidr
    });
    $modalInstance.close('ok');
  };
}])

.controller('CandidateNicsModalCtrl', ['$scope', '$modal', 'ZStackApi', 'ZStackUtil', function ($scope, $modal, ZStackApi, ZStackUtil) {

  ZStackUtil.initLaunchModalScope($scope, $modal, 'js/security_group/candidate_nics.html', 'CandidateNicsInstanceCtrl');

  $scope.$on("add:nics", function(event, nics) {
    var nicUuids = [];
    for (var i = 0; i < nics.length; i++) {
      nicUuids.push(nics[i].uuid);
    };
    ZStackApi.addVmNicToSecurityGroup(nicUuids, $scope.data.uuid)
    .then(function (result) {
      $scope.$emit("update:list");
    })
  })

}])

.controller('CandidateNicsInstanceCtrl', ['$scope', 'ZStackApi', 'ZStackUtil', '$modalInstance', 'modalScope', function ($scope, ZStackApi, ZStackUtil, $modalInstance, modalScope) {
  var self = $scope;

  ZStackUtil.initModalScope($scope, $modalInstance, modalScope);

  $scope.nics = [];
  $scope.selectNicList = [];

  $scope.selectNicItem = function(item) {
    $scope.selectNicList.length = 0;
    for (var i in $scope.nics) {
      if ($scope.nics[i].selected) {
        $scope.selectNicList.push($scope.nics[i]);
      }
    }
    if ($scope.selectNicList.length == $scope.nics.length) {
      $scope.selectAllNicItems = true;
    } else {
      $scope.selectAllNicItems = false;
    }
  }

  $scope.clickNicItem = function(item) {
    $scope.selectNicList.length = 0;
    for (var i in $scope.nics) {
      if ($scope.nics[i].uuid == item.uuid)
        $scope.nics[i].selected = true;
      else
        $scope.nics[i].selected = false;
    }
    $scope.selectNicItem(item);
  }

  $scope.selectAllNics = function() {
    $scope.selectNicList.length = 0;
    for (var i in $scope.nics) {
      $scope.nics[i].selected = $scope.selectAllNicItems;
      if ($scope.nics[i].selected) {
        $scope.selectNicList.push($scope.nics[i]);
      }
    }
  }

  ZStackApi.getCandidateVmNicForSecurityGroup(modalScope.data.uuid)
  .then(function(result) {
    $scope.nics = result.inventories;
  })

  $scope.ok = function() {
    modalScope.$emit("add:nics", $scope.selectNicList);
    $modalInstance.close('ok');
  };
}])