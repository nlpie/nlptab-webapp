'use strict';

angular.module('nlptabApp')
  .directive('intPrimitiveFeature', function () {
    return {
      templateUrl: 'partials/systems/int-primitive-feature.html',
      restrict: 'E',
      scope: {
        feature: '=',
        systemIndex: '=',
        selectedType: '=',
        values: '='
      },
      controller: function ($scope, FeatureStructure) {
        FeatureStructure.termsMissingCardinalityAndPercentilesForFeature($scope.systemIndex,
          $scope.selectedType.typeName, 'intFeatures.' + $scope.feature.name.replace(/\./g, '_').replace(/:/g, ';'))
          .then(function (result) {
            $scope.int = result;
            if ($scope.values) {
              $scope.values.values = result.values.map(function (value) {
                return value.key;
              });
            }
          });
      }
    };
  });
