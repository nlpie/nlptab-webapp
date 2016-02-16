'use strict';

angular.module('nlptabApp')
  .controller('SystemsListCtrl', function ($location, $routeParams, $scope, CasProcessingIndex, nlptabConfig, $route) {
    $scope.isSecure = nlptabConfig.isSecure;

    $scope.pagination = {from: 0, size: 10};

    $scope.deleteWarned = false;

    $scope.fetchSystems = function () {
      CasProcessingIndex.all($scope.pagination).
      then(function (result) {
        $scope.pagination.total = result.total;
        $scope.systems = result.casProcessingIndexes;
      });
    };

    $scope.selectSystem = function (systemIndex) {
      $location.path('/system/' + systemIndex);
    };

    $scope.deleteSystem = function ($event, system) {
      $event.stopPropagation();
      if ($scope.deleteWarned) {
        CasProcessingIndex.deleteSystem(system)
          .then(function () {
            $scope.fetchSystems();
          });
      } else {
        $scope.deleteWarned = true;
      }
    };

    $scope.fetchSystems();
  });
