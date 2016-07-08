'use strict';

angular.module('nlptabApp')
  .directive('systemName', function () {
    return {
      template: function (element, attrs) {
        if (typeof  attrs.unlinked !== 'undefined') {
          return '<span>{{systemName}}</span>';
        } else {
          return '<a ng-href="{{url}}">{{systemName}}</a>';
        }
      },
      restrict: 'E',
      scope: {
        systemIndex: '='
      },
      controller: function ($scope, CasProcessingIndex) {
        if ($scope.systemIndex) {
          $scope.url = '#/system/' + $scope.systemIndex;
          CasProcessingIndex.getSystemNameForIndex($scope.systemIndex).then(function (result) {
            $scope.systemName = result;
          });
        }
      }
    };
  });
