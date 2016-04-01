'use strict';

angular.module('nlptabApp')
  .controller('AnalysisCtrl', function ($scope, $routeParams, $location, MatchCounts, nlptabConfig, CasProcessingIndex,
                                        $q, $filter) {
    $scope.isSecure = nlptabConfig.isSecure;

    $scope.isReady = false;

    $scope.selectTested = function (tested, then) {
      $scope.selectedTested = tested.index;
      $scope.selectedGoldStandard = undefined;
      $scope.isReady = false;
      $location.search('reference', $scope.selectedTested).replace();
      $scope.systems.map(function (systemIndex) {
        MatchCounts.countTestedAndGold(tested.index, systemIndex.index)
          .then(function (count) {
            systemIndex['goldCount'] = count;
            if (then) {
              then();
            }
          });
      });
    };

    $scope.selectGoldStandard = function (goldStandard) {
      $scope.selectedGoldStandard = goldStandard.index;
      $location.search('gold', $scope.selectedGoldStandard).replace();
      $scope.isReady = goldStandard.goldCount > 0;
    };

    CasProcessingIndex.all()
      .then(function (result) {
        return $q.all(result.casProcessingIndexes.map(function (systemIndex) {
          return MatchCounts.countTested(systemIndex.index)
            .then(function (count) {
              systemIndex['count'] = count;
              return systemIndex;
            });
        }));
      })
      .then(function (result) {
        $scope.systems = result;
        if ($routeParams.reference) {
          var reference = $filter('filter')($scope.systems, {index: $routeParams.reference}, true);
          $scope.selectTested(reference, function () {
            if ($routeParams.gold) {
              var gold = $filter('filter')($scope.systems, {index: $routeParams.gold}, true);
              $scope.selectGoldStandard(gold);
            }
          })
        }
      });
  });
