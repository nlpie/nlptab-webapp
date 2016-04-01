'use strict';

angular.module('nlptabApp')
  .controller('FeatureExamplesModalCtrl', function ($scope, $uibModalInstance, systemIndex, type, feature) {
    $scope.systemIndex = systemIndex;
    $scope.type = type;
    $scope.feature = feature;
    $scope.done = function () {
      $uibModalInstance.dismiss('done');
    };
  });
