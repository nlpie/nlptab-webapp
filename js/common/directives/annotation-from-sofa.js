'use strict';

angular.module('nlptabApp')
  .directive('annotationFromSofa', function () {
    return {
      controller: function ($scope, FeatureStructure, Sofa, nlptabConfig) {
        $scope.$watch('featureStructure._id', function (newValue) {
          if (newValue) {
            Sofa.withSofaIdentifier(nlptabConfig.instanceName + 'search', $scope.featureStructure.documentIdentifier)
              .then(function (sofa) {
                var minDistance;
                var documentLocations = $scope.featureStructure.documentLocations;
                if (!documentLocations) {
                  return;
                }
                for (var i=0; i<documentLocations.length; i++) {
                  if (!minDistance || minDistance.distance > documentLocations[i].distance) {
                    minDistance = documentLocations[i];
                  }
                }

                var sofaText = sofa.text;

                var substringStart = window.Math.max(0, minDistance.begin - 80);
                var substringEnd = window.Math.min(sofaText.length, minDistance.end + 80);

                $scope.preText = sofaText.substring(substringStart, minDistance.begin);
                if (substringStart !== 0) {
                  $scope.preText = '... ' + $scope.preText;
                }
                $scope.annotationText = sofaText.substring(minDistance.begin, minDistance.end);
                $scope.postText = sofaText.substring(minDistance.end, substringEnd);
                if (substringEnd !== sofaText.length) {
                  $scope.postText = $scope.postText + ' ...';
                }
              });
          }
        });
      },
      restrict: 'E',
      scope: {
        featureStructure: '='
      },
      templateUrl: '/partials/common/annotation-from-sofa.html'
    };
  });
