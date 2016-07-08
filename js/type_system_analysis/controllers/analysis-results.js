'use strict';

angular.module('nlptabApp')
  .controller('AnalysisResultsCtrl', function ($q, $scope, $routeParams, $location, MatchCounts, Pagination) {
    $scope.selectedTested = $routeParams.tested;
    $scope.selectedGold = $routeParams.gold;

    $scope.pagination = Pagination.withPageAndItemsPerPage(1, 15);

    $scope.$watch('pagination.page', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $location.search('page', newValue).replace();
        $scope.fetchMatchCounts();
      }
    });

    $scope.fetchMatchCounts = function () {
      MatchCounts.withTestedAndGoldStandard($scope.selectedTested, $scope.selectedGold, $scope.pagination)
        .then(function (result) {
          $scope.matchCounts = result.matchCounts;
          $scope.pagination.totalItems = result.total;
        });
    };

    $scope.fetchMatchCounts();
  });
