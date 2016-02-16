'use strict';

angular.module('nlptabApp')
    .directive('spanEditor', function () {
        return {
            templateUrl: 'partials/annotation_analysis/span-editor.html',
            restrict: 'E',
            transclude: true,
            scope: {
                min: '=',
                max: '=',
                value: '='
            },
            link: function postLink(scope) {
                scope.canDecrement = function () {
                    return scope.value > scope.min;
                };
                scope.decrement = function () {
                    scope.value--;
                };
                scope.canIncrement = function () {
                    return scope.value < scope.max;
                };
                scope.increment = function () {
                    scope.value++;
                };
            }
        };
    });
