'use strict';

angular.module('nlptabApp')
  .directive('examplesInSpan', function () {
    return {
      templateUrl: 'partials/annotation_analysis/examples-in-span.html',
      restrict: 'E',
      controller: function ($scope, FeatureStructure) {
        $scope.pagination = {
          page: 1,
          itemsPerPage: 1
        };

        var fetchAssociatedFeatureStructure = function () {
          if ($scope.selectedTypeInSystem) {
            FeatureStructure.withTypeInSystemAtLocation($scope.selectedTypeInSystem.type,
              $scope.selectedTypeInSystem.systemIndex, $scope.sofaIdentifier, $scope.textSpan.begin,
              $scope.textSpan.end, $scope.textSpan.begin, $scope.textSpan.end, $scope.pagination.page)
              .then(function (result) {
                $scope.pagination.totalItems = result.totalItems;

                $scope.featureStructure = result.featureStructure;

                $scope.selectAnnotationLocation(result.featureStructure.primaryLocation);
              });
          }
        };


        $scope.$watch('pagination.page', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            fetchAssociatedFeatureStructure();
          }
        });

        $scope.$watch('selectedTypeInSystem', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.pagination.page = 1;
            fetchAssociatedFeatureStructure();
          }
        });

        fetchAssociatedFeatureStructure();
      }
    };
  });
