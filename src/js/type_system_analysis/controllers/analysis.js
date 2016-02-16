'use strict';

angular.module('nlptabApp')
  .controller('AnalysisCtrl', function ($scope, $routeParams, $location, MatchCounts, nlptabConfig) {
    $scope.isSecure = nlptabConfig.isSecure;

    $scope.selectedTested = $routeParams.tested;

    $scope.selectedGoldStandard = $routeParams.gold;

    $scope.selectTested = function (tested) {
      $scope.selectedTested = tested;
      if (tested) {
        $location.search('tested', $scope.selectedTested).replace();
      }
    };

    $scope.selectGoldStandard = function (goldStandard) {
      $scope.selectedGoldStandard = goldStandard;
      if (goldStandard) {
        $location.search('gold', $scope.selectedGoldStandard).replace();
      }
    };

    $scope.$watch('selectedTested', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.fetchGoldStandards();
      }
    });

    $scope.fetchTested = function () {
      MatchCounts.allTested()
        .then(function (result) {
          $scope.allTested = result;
        });
    };

    $scope.fetchGoldStandards = function () {
      MatchCounts.allGoldStandardsForTested($scope.selectedTested)
        .then(function (result) {
          $scope.goldStandards = result;
        });
    };

    $scope.fetchTested();

    if ($scope.selectedTested) {
      $scope.fetchGoldStandards();
    }
  });
