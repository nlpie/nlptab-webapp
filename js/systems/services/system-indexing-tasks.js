'use strict';

angular.module('nlptabApp')
  .service('SystemIndexingTasks',
    /**
     * SystemIndexingTasks service.
     * @param $q angular promises service
     * @param Es angular Es service
     * @param nlptabConfig nlptab config
     * @param $http angular http service
     * @param Upload angular upload service
     * @constructor
     */
    function SystemIndexingTasks($q, Es, nlptabConfig, $http, Upload) {
      /**
       * Returns the source of the document with the id.
       *
       * @param {string} id the id
       * @returns {Promise} promise object for the system index task
       */
      this.withId = function (id) {
        return Es.getSource({
          index: nlptabConfig.instanceName + 'metadata',
          type: 'SystemIndexTask',
          id: id
        });
      };

      /**
       * Runs the first part of indexing, uploading the metadata.
       * @param {string} systemName
       * @param {string} systemDescription
       * @return {string} the new system index created.
       */
      this.indexMetadata = function (systemName, systemDescription) {
        return $http.post(nlptabConfig.esPath + '/_nlptab-systemindexmeta', {
          systemName: systemName,
          systemDescription: systemDescription,
          instance: nlptabConfig.instanceName
        }).then(function (result) {
          return result.data.index;
        });
      };

      this.indexSystem = function (index, file, useXCas) {
        return Upload.http({
          url: nlptabConfig.esPath + '/_nlptab-systemindex?instance=' + nlptabConfig.instanceName + '&index=' + index + '&useXCas=' + useXCas,
          headers: {
            'Content-Type': file.type
          },
          data: file
        });
      };
    });
