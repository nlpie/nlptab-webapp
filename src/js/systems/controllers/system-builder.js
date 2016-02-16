'use strict';

angular.module('nlptabApp')
  .controller('SystemBuilderCtrl', function ($scope, SystemIndexingTasks, $location, $modal) {
    $scope.systemName = '';
    $scope.systemDescription = '';
    $scope.useXCas = false;

    $scope.uploading = false;


    $scope.submit = function () {
      $scope.uploading = true;

      var modal = $modal.open({
        template: '<div><h3>Uploading File</h3><p><progressbar value="progress"></progressbar></p></div>'
      });

      SystemIndexingTasks.indexMetadata($scope.systemName, $scope.systemDescription)
        .then (function (index) {
          SystemIndexingTasks.indexSystem(index, $scope.file, $scope.useXCas)
            .progress(function (progress) {
              $scope.progress = progress.loaded / progress.total * 100;
            })
            .then(function (result) {
              $scope.progress = 1.0;
              modal.dismiss('done');
              $location.path('/system-task-progress/' + result.data.index);
            });
        });
    };
  });
