'use strict';

angular.module('nlptabApp')
  .directive('booleanPrimitiveFeature', function () {
    return {
      templateUrl: 'partials/systems/boolean-primitive-feature.html',
      restrict: 'E',
      scope: {
        feature: '=',
        systemIndex: '=',
        selectedType: '=',
        values: '='
      },
      controller: function ($scope, FeatureStructure) {
        FeatureStructure.termsAndMissingForFeature($scope.systemIndex, $scope.selectedType.typeName,
          'booleanFeatures.' + $scope.feature.name.replace(/\./g, '_').replace(/:/g, ';'))
          .then(function (result) {
            $scope.bool = result;
            if ($scope.values) {
              $scope.values.values = result.values.map(function (value) {
                return value.key;
              });
            }
          });
      }
    };
  });
