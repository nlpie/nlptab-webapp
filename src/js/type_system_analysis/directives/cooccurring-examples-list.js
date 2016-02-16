'use strict';

angular.module('nlptabApp')
  .directive('cooccurringExamplesList', function () {
    return {
      templateUrl: 'partials/type_systems_analysis/cooccurring-examples-list.html',
      restrict: 'E',
      controller: function ($scope, CoOccurrenceMatches, Pagination) {
        $scope.pagination = Pagination.withPageAndItemsPerPage(1, 1);

        var map = {
          coOccurrences: 'TruePositive',
          firstOnly: 'FalsePositive',
          secondOnly: 'FalseNegative'
        };

        var fetchAnnotationLocations = function () {
          CoOccurrenceMatches.withTypeAndId(map[$scope.examplesOf], $scope.matchCounts.analysisId, $scope.pagination)
            .then(function (result) {
              $scope.pagination.totalItems = result.totalItems;
              $scope.coOccurrenceMatches = result.coOccurrenceMatches;
            });
        };

        $scope.selectExamplesOf = function (value) {
          $scope.examplesOf = value;
          fetchAnnotationLocations();
        };

        $scope.$watch('pagination.page', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            fetchAnnotationLocations();
          }
        });

        fetchAnnotationLocations();
      }
    };
  });
