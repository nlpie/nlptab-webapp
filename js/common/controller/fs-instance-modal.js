'use strict';

angular.module('nlptabApp')
  .controller('FsInstanceModalCtrl',
    /**
     * Controller for a feature structure instance info modal.
     *
     * @param {$rootScope.Scope} $scope angular scope injected.
     * @param {object} $uibModalInstance injected modal instance.
     * @param {FeatureStructure} FeatureStructure injected feature structure service.
     * @param {string} fsId resolved argument for the
     * @param {string} systemIndex resolved argument for the system index.
     */
    function ($scope, $uibModalInstance, FeatureStructure, fsId, systemIndex) {
      /**
       * Scope property for the system index.
       *
       * @type {string} system index
       */
      $scope.systemIndex = systemIndex;

      FeatureStructure.withId(fsId, systemIndex).then(function (result) {
        $scope.featureStructure = result;
      });

      /**
       * Scope function for dismissing the modal.
       */
      $scope.done = function () {
        $uibModalInstance.dismiss('done');
      };
    });
