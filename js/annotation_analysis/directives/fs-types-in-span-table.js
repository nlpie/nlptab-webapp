'use strict';

angular.module('nlptabApp')
  .directive('fsTypesInSpanTable', function () {
    return {
      templateUrl: '../../../partials/annotation_analysis/fs-types-in-span-table.html',
      restrict: 'E',
      controller: function ($scope, $routeParams, $location, FeatureStructure, CasProcessingIndex) {
        $scope.pagination = {
          page: 1,
          itemsPerPage: 8
        };

        $scope.fetching = false;

        var restorationPage = $routeParams.tpage;
        var restorationTypeIndex = $routeParams.tindex;

        var fetchAssociatedFsTypes = function () {
          $scope.fetching = true;
          CasProcessingIndex.all(0, 20).then(function (result) {
            var indexes = result.casProcessingIndexes.map(function (currentValue) {
              return currentValue.index;
            });
            FeatureStructure.getTypesInRange(indexes, $scope.sofaIdentifier, $scope.textSpan.begin,
              $scope.textSpan.end)
              .then(function (result) {
                $scope.pagination.totalItems = result.length;
                $scope.typeInSystems = result;
                if (restorationPage) {
                  $scope.pagination.page = restorationPage;
                  restorationPage = null;
                }
                if (restorationTypeIndex) {
                  $scope.selectTypeInSystem($scope.typeInSystems[restorationTypeIndex],
                    restorationTypeIndex);
                  restorationTypeIndex = null;
                }
                $scope.fetching = false;
              });
          });
        };

        $scope.$watch('textSpan', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            fetchAssociatedFsTypes();
          }
        }, true);

        $scope.$watch('pagination.page', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.from = ($scope.pagination.page - 1) * $scope.pagination.itemsPerPage;
            $location.search('tpage', $scope.pagination.page).replace();
            if ($scope.selectedTypeInSystem) {
              var index = $scope.typeInSystems.indexOf($scope.selectedTypeInSystem);
              if (index < $scope.from || index >= $scope.from + $scope.pagination.itemsPerPage) {
                $scope.clearSelectedTypeInSystem();
              }
            }
          }
        });

        fetchAssociatedFsTypes();
      }
    };
  });
