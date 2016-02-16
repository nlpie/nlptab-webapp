'use strict';

angular.module('nlptabApp')
  .controller('SystemTaskProgressCtrl', function ($scope, $interval, $route, $location, SystemIndexingTasks) {
    $scope.index = $route.current.params.index;

    var getProgress = function () {
      SystemIndexingTasks.withId($scope.index)
        .then(function (result) {
          $scope.systemIndexingTask = result;
        });
    };

    var refresh = $interval(function() {
      getProgress();
    }, 3000);

    var cancel = function() {
      if (angular.isDefined(refresh)) {
        $interval.cancel(refresh);
        refresh = undefined;
      }
    };

    $scope.goToSystem = function () {
      $location.path('/system/' + $scope.index);
    };

    getProgress();

    $scope.$on('$destroy', function () {
      cancel();
    });
  });
