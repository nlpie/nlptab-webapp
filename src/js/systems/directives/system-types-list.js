'use strict';

angular.module('nlptabApp')
    .directive('systemTypesList', function () {
        return {
            templateUrl: 'partials/systems/system-types-list.html',
            restrict: 'E',
            controller: function ($scope, $location, Type) {
                $scope.pagination = {page: 1, itemsPerPage: 15};
                $scope.filter = '';

                var ignore = false;
                $scope.$watch('pagination.page', function (newValue, oldValue) {
                    if (!ignore) {
                        if (newValue !== oldValue) {
                            $scope.fetchTypes();
                        }
                    } else {
                        ignore = false;
                    }
                });

                $scope.$watch('filter', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.fetchTypes();
                    }
                });

                $scope.fetchTypes = function () {
                    var from = ($scope.pagination.page - 1) * $scope.pagination.itemsPerPage;
                    Type.allInSystem($scope.systemIndex, from, $scope.pagination.itemsPerPage, $scope.filter,
                        'typeName').then(function (result) {
                            $scope.pagination.totalItems = result.total;
                            $scope.types = result.types;
                        });
                };

                $scope.fetchTypes();
            }
        };
    });
