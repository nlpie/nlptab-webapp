'use strict';

angular.module('nlptabApp')
  .directive('stringPrimitiveFeature', function () {
    return {
      templateUrl: './partials/systems/string-primitive-feature.html',
      restrict: 'E',
      scope: {
        feature: '=',
        systemIndex: '=',
        selectedType: '=',
        values: '='
      },
      controller: function ($scope, FeatureStructure) {
        var fetch = function () {
          FeatureStructure.termsMissingAndCardinalityForFeature($scope.systemIndex, $scope.selectedType.typeName,
            'stringFeatures.' + $scope.feature.name.replace(/\./g, '_').replace(/:/g, ';'))
            .then(function (result) {
              $scope.string = result;
              if ($scope.values) {
                $scope.values.values = result.values.map(function (value) {
                  return value.key;
                });
              }
            });
        };

        $scope.$watch('feature', function () {
          fetch();
        });

        $scope.$watch('systemIndex', function () {
          fetch();
        });

        $scope.$watch('selectedType', function () {
          fetch();
        });
      }
    };
  });
