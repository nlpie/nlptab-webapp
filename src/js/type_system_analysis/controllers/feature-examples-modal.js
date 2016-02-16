'use strict';

angular.module('nlptabApp')
  .controller('FeatureExamplesModalCtrl', function ($scope, $modalInstance, systemIndex, type, feature) {
    $scope.systemIndex = systemIndex;
    $scope.type = type;
    $scope.feature = feature;
    $scope.done = function () {
      $modalInstance.dismiss('done');
    };
  });
