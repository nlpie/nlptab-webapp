'use strict';

angular.module('nlptabApp')
  .controller('AnalysisResultsExploreCtrl', function ($q, $scope, $routeParams, matchCounts, nlptabConfig, $http) {
    // Scope properties
    $scope.examplesOf = $routeParams.examplesOf || 'coOccurrences';
    $scope.matchCounts = matchCounts;

    $scope.esServer = nlptabConfig.esServer;
    $scope.analysisId = $routeParams.matchCountsId;
    $scope.instance = nlptabConfig.instanceName;
  });
