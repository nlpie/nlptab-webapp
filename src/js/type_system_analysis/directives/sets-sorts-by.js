'use strict';

angular.module('nlptabApp')
    .directive('setsSortBy', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    scope.setSortBy(attr.setsSortBy);
                });

                scope.$watch('sorters', function (val) {
                    var index = val.indexOf(attr.setsSortBy);
                    if (index > -1) {
                        element.addClass('btn-info');
                        element.removeClass('btn-default');
                    } else {
                        element.addClass('btn-default');
                        element.removeClass('btn-info');
                    }
                });
            }
        };
    });
