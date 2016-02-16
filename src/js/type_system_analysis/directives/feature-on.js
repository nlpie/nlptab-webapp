'use strict';

angular.module('nlptabApp')
  .directive('featureOn',
    /**
     * feature-on element directive, displays a full feature name as "featureShortName on Type".
     *
     * @returns {{template: string, restrict: string, scope: {featureName: string}, link: featureOn.link}}
     */
    function () {
      return {
        template: '<span ng-if="featureName">{{featureShortName}} on <type-name name="typeName" unlinked></type-name></span>',
        restrict: 'E',
        scope: {
          featureName: '='
        },
        /**
         * Linking function for featureOn directive.
         *
         * @param {$rootScope.Scope} scope
         */
        link: function (scope) {
          scope.$watch('featureName',
            /**
             * Watches for updates to feature name.
             *
             * @param {string} featureName
             */
            function (featureName) {
              if (featureName) {
                var split = featureName.indexOf(':');
                scope.featureShortName = featureName.substring(split + 1, featureName.length);
                scope.typeName = featureName.substring(0, split);
              }
            });
        }
      };
    });
