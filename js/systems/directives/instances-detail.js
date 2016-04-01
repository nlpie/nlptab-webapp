'use strict';

angular.module('nlptabApp')
  .directive('instancesDetail',
    function () {
      return {
        templateUrl: '../../../partials/systems/instances-detail.html',
        restrict: 'E',
        controller: function InstancesDetailCtrl($scope, FeatureStructure, Pagination) {
          $scope.instancesPagination = Pagination.withPageAndItemsPerPage(1, 1);

          $scope.childTypes = [];

          $scope.toggleType = function ($index) {
            var childType = $scope.childTypes[$index];
            childType.isSelected = !childType.isSelected;
            $scope.instancesPagination.reset();
            loadTypeInstances();
          };

          $scope.invertTypeSelection = function () {
            $scope.childTypes = $scope.childTypes.map(function (childType) {
              childType.isSelected = !childType.isSelected;
              return childType;
            });
            $scope.instancesPagination.reset();
            loadTypeInstances();
          };

          /**
           * Fetches the child types of the selected type.
           */
          var fetchChildTypes = function () {
            $scope.instancesPagination.reset();
            if ($scope.selectedType) {
              FeatureStructure.primaryTypesFor($scope.systemIndex, $scope.selectedType.typeName)
                .then(function (childTypeNames) {
                  $scope.childTypes = childTypeNames.map(function (childTypeName) {
                    return {
                      isSelected: true,
                      name: childTypeName
                    };
                  });

                  loadTypeInstances();
                });
            }
          };

          /**
           * Fetches the instances of the selected type and its selected children.
           */
          var loadTypeInstances = function () {
            $scope.featureStructureInstance = undefined;

            var deselectedTypes = [];
            var i;
            for (i = 0; i < $scope.childTypes.length; i++) {
              var childType = $scope.childTypes[i];
              if (!childType.isSelected) {
                deselectedTypes.push(childType.name);
              }
            }

            FeatureStructure.ofTypeWithoutPrimaryTypes($scope.systemIndex, $scope.selectedType.typeName, deselectedTypes,
              $scope.instancesPagination)
              .then(function (featureStructures) {
                if (featureStructures.length > 0) {
                  $scope.featureStructureInstance = featureStructures[0];
                }
              });
          };

          $scope.$watch('selectedType',
            /**
             * Angular watch function, watches for selected type to change and fetches the new children of that type.
             */
            function () {
              fetchChildTypes();
            }
          );

          $scope.$watch('instancesPagination.page',
            /**
             * Angular watch function, watches for the page to change, loading that instance.
             */
            function () {
              loadTypeInstances();
            }
          );

        }
      };
    });
