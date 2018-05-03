'use strict';

angular.module('nlptabApp')
    .directive('typeInfo', function () {
        return {
            restrict: 'E',
            templateUrl: './partials/systems/type-info.html',
            controller: function ($scope, FeatureStructure, Type) {
                FeatureStructure.countTotal($scope.systemIndex).then(function (result) {
                    $scope.totalFeatureStructures = result;
                });

		$scope.selectedType.export = $scope.selectedType.export || false;

		$scope.saveFeature = function() {
		    $scope.updateSelectedType({ export: $scope.selectedType.export });
		};

                $scope.$watch('selectedType.typeName', function (typeName) {
                    if (typeName) {
                        FeatureStructure.countOfType($scope.systemIndex, typeName).then(function (result) {
                            $scope.countOfType = result;
                        });

                        Type.findChildren($scope.systemIndex, $scope.selectedType.typeName).then(function (children) {
                            $scope.children = children;
                        });
                    }
                });
            }
        };
    });
