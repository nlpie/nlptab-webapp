'use strict';

angular.module('nlptabApp')
  .controller('AnalysisProgressCtrl', function ($scope, $interval, $route, $location, AnalysisTasks) {
    $scope.analysisId = $route.current.params.analysisId;

    var getAnalysisProgress = function () {
      AnalysisTasks.withId($scope.analysisId)
        .then(function (result) {
          $scope.analysisTask = result;
        });
    };

    var refresh = $interval(function() {
      getAnalysisProgress();
    }, 1000);

    var cancel = function() {
      if (angular.isDefined(refresh)) {
        $interval.cancel(refresh);
        refresh = undefined;
      }
    };

    $scope.$watch('analysisTask', function() {
      if ($scope.analysisTask && $scope.analysisTask.finished) {
        if (!$scope.analysisTask.failed) {
          $location.path('/analysis-results-explore/' + $scope.analysisId);
        }
      }
    });

    getAnalysisProgress();

    $scope.$on('$destroy', function () {
      cancel();
    });
  });
