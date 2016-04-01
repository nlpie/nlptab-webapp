'use strict';

angular.module('nlptabApp')
    .directive('featureName', function () {
        return {
            template: function (element, attrs) {
                //if (typeof attrs.unlinked !== 'undefined') {
                    return '<span tooltip="{{name}}">{{shortenedName}}</span>';
                //} else {
                 //   return '<a ng-href="{{url}}" tooltip="{{name}}">{{shortenedName}}</a>';
                //}
            },
            restrict: 'E',
            scope: {
                name: '=',
                systemIndex: '='
            },
            link: function postLink(scope) {
                if (scope.name) {
                    var splits = scope.name.split(';');
                    scope.shortenedName = splits[1];
                    var type = splits[0].replace(/_/g, '.');
                    if (scope.systemIndex) {
                        scope.url = '#/system/' + scope.systemIndex + '?type=' + type + '&feature=' + scope.shortenedName;
                    }
                }
            }
        };
    });
