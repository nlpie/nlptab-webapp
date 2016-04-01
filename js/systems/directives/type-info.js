'use strict';

angular.module('nlptabApp')
    .directive('typeInfo', function () {
        return {
            restrict: 'E',
            templateUrl: '../../../partials/systems/type-info.html',
            controller: function ($scope, FeatureStructure, Type) {
                FeatureStructure.countTotal($scope.systemIndex).then(function (result) {
                    $scope.totalFeatureStructures = result;
                });

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
