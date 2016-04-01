'use strict';

angular.module('nlptabApp')
  .directive('featureValues', function (FeatureStructure) {
    return {
      templateUrl: '/partials/common/feature-values.html',
      restrict: 'E',
      scope: {
        systemIndex: '=',
        type: '=',
        feature: '='
      },
      link: function postLink(scope) {
        var fetch = function () {
          FeatureStructure.termsAndMissingForFeature(scope.systemIndex, scope.type,
            FeatureStructure.mapToEsFeature(scope.feature)).then(function (result) {
              scope.values = result.values;
              scope.count = result.count;
            });
        };

        fetch();
      }
    };
  });
