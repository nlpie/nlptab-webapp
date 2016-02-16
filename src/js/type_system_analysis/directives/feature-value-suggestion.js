'use strict';

angular.module('nlptabApp')
  .directive('featureValueSuggestion', function (FeatureStructure) {
    return {
      templateUrl: 'partials/type_systems_analysis/feature-value-suggestion.html',
      restrict: 'E',
      scope: {
        value: '=',
        systemIndex: '=',
        type: '=',
        feature: '='
      },
      link: function (scope) {
        scope.selected = {};
        FeatureStructure.termsAndMissingForFeature(scope.systemIndex, scope.type.typeName,
          FeatureStructure.mapToEsFeature(scope.feature), 100000)
          .then(function (result) {
            scope.values = result.values.map(function (bucket) {
              return bucket.key;
            });
          });

        scope.$watch('selected.value', function (value) {
          scope.value = value;
        });
      }
    };
  });
