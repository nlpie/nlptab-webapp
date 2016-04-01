'use strict';

angular.module('nlptabApp')
  .directive('cooccurringExamplesRow', function (nlptabConfig) {
    return {
      templateUrl: './partials/type_systems_analysis/cooccurring-examples-row.html',
      restrict: 'A',
      require: '^cooccurringExamplesList',
      controller: function ($scope, FeatureStructure) {
        $scope.selected = false;

        FeatureStructure.withId($scope.coOccurrenceMatch.firstId, $scope.coOccurrenceMatch.firstSystem)
          .then(function (result) {
            $scope.firstFs = result;
          });

        FeatureStructure.withId($scope.coOccurrenceMatch.secondId, $scope.coOccurrenceMatch.secondSystem)
          .then(function (result) {
            $scope.secondFs = result;
          });
      }
    };
  });
