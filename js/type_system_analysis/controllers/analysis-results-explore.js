'use strict';

angular.module('nlptabApp')
  .controller('AnalysisResultsExploreCtrl', function ($q, $scope, $routeParams, matchCounts) {
    // Scope properties
    $scope.examplesOf = $routeParams.examplesOf || 'coOccurrences';
    $scope.matchCounts = matchCounts;
  });
