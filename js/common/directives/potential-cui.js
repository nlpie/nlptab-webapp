'use strict';

angular.module('nlptabApp')
  .directive('potentialCui',
    /**
     * potential-cui element directive. Links to the UMLS Metathesarus browser if a cui matches a
     *
     * @returns {{template: string, restrict: string, scope: {value: string}, controller: potentialCui.controller}}
     */
    function () {
      /**
       * Pattern for a UMLS CUI.
       *
       * @type {RegExp}
       */
      var cui = /C[0-9]{7}/;

      return {
        template: '<span ng-if="!isCui">{{value}}</span><a ng-if="isCui" href="https://uts.nlm.nih.gov/metathesaurus.html;#{{value}};0;1;CUI;2015AA;EXACT_MATCH;*;" target="_blank">{{value}}</a>',
        restrict: 'E',
        scope: {
          value: '='
        },
        /**
         * Linking function for the is-cui directive.
         *
         * @param {$rootScope.Scope} scope angular scope
         */
        link: function (scope) {
          /**
           * Scope property, true if the value is a cui, false otherwise.
           *
           * @type {boolean}
           */
          scope.isCui = cui.test(scope.value);
        }
      };
    });
