'use strict';

angular.module('nlptabApp')
  .directive('typeName', function () {
    return {
      template: function (element, attrs) {
        if (typeof attrs.unlinked !== 'undefined') {
          return '<span tooltip="{{name}}">{{shortenedName}}</span>';
        } else {
          return '<a ng-href="{{url}}" tooltip="{{name}}">{{shortenedName}}</a>';
        }
      },
      restrict: 'E',
      scope: {
        name: '=',
        systemIndex: '='
      },
      link: function postLink(scope) {
        scope.$watch('name', function (name) {
          if (name) {
            var splits = name.split('.');
            scope.shortenedName = splits[splits.length - 1];
            if (/\[\]$/.test(scope.shortenedName)) {
              scope.shortenedName = scope.shortenedName.replace(/\[\]$/, '');
              scope.shortenedName = 'Array of ' + scope.shortenedName;
              scope.name = name.replace(/\[\]$/, '');
            }
            if (scope.systemIndex) {
              scope.url = '#/system/' + scope.systemIndex + '?type=' + scope.name + '&info';
            }
          }
        });
      }
    };
  });
