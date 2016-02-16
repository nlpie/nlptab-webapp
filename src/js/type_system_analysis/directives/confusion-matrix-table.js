'use strict';

angular.module('nlptabApp')
  .directive('confusionMatrixTable', function () {
    return {
      templateUrl: 'partials/type_systems_analysis/confusion-matrix-table.html',
      restrict: 'E'
    };
  });
