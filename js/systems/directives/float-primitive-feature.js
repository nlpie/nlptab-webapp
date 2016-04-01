'use strict';

angular.module('nlptabApp')
  .directive('floatPrimitiveFeature', function () {
    return {
      templateUrl: './partials/systems/float-primitive-feature.html',
      restrict: 'E',
      scope: {
        feature: '=',
        systemIndex: '=',
        selectedType: '=',
        values: '='
      },
      controller: function ($scope, FeatureStructure) {
        FeatureStructure.termsMissingCardinalityAndPercentilesForFeature($scope.systemIndex,
          $scope.selectedType.typeName, 'floatFeatures.' + $scope.feature.name.replace(/\./g, '_').replace(/:/g, ';'))
          .then(function (result) {
            $scope.float = result;
          });
      }
    };
  });
