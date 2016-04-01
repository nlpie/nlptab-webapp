'use strict';

angular.module('nlptabApp')
  .directive('fsInstanceInfo',
    /**
     * fs-instance-info element directive, creates an interface for viewing the feature values and
     *
     * @returns {{templateUrl: string, restrict: string, scope: {featureStructure: string}, link: fsInstanceInfo.link}}
     */
    function () {
      return {
        templateUrl: '/partials/common/fs-instance-info.html',
        restrict: 'E',
        scope: {
          featureStructure: '='
        },
        /**
         * Linking function for the fsInstanceInfoDirective.
         *
         * @param {$rootScope.Scope} scope
         */
        link: function (scope) {
          /**
           * Scope function that returns true if the object is empty.
           *
           * @param object javascript object
           * @returns {boolean|*}
           */
          scope.isEmpty = function (object) {
            return angular.equals(object, {});
          };
        }
      };
    });
