'use strict';
angular.module('nlptabApp')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: './partials/common/navbar.html',
            scope: {
                selectedLink: '='
            },
            controller: function navbarCtrl($scope) {
                if ($scope.selectedLink) {
                    this.selectedLink = $scope.selectedLink;
                }
            }
        };
    });
