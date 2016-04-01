'use strict';

angular.module('nlptabApp')
  .controller('TypeSelectionModalCtrl', function ($scope, $modalInstance, Type, Pagination, systemIndex, selectedType) {
    $scope.pagination = Pagination.withPageAndItemsPerPage(1, 20);

    $scope.systemIndex = systemIndex;

    $scope.types = [];

    $scope.selectType = function ($index) {
      selectedType($scope.types[$index]);
      $scope.done();
    };

    var fetchTypes = function () {
      Type.allInSystem($scope.systemIndex, $scope.pagination.getFrom(), $scope.pagination.getSize())
        .then(function (result) {
          $scope.pagination.totalItems = result.total;
          $scope.types = result.types;
        });
    };

    $scope.$watch('pagination.page', function () {
      fetchTypes();
    });

    $scope.done = function () {
      $modalInstance.dismiss('done');
    };
  });
