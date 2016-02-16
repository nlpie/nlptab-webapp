'use strict';


angular.module('nlptabApp')
  .directive('unitOfAnalysisDescription', function () {
    return {
      restrict: 'E',
      scope: {
        unitOfAnalysis: '=',
        featureValueMappings: '=',
        isHypothesis: '='
      },
      templateUrl: 'partials/type_systems_analysis/unit-of-analysis-description.html',
      link: function(scope) {
        scope.mappings = scope.featureValueMappings.map(function (element) {
          if (scope.isHypothesis) {
            return element.hypothesisFeature;
          } else {
            return element.referenceFeature;
          }
        });
      }
    };
  });
