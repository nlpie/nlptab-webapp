'use strict';

angular.module('nlptabApp')
  .service('CasProcessingIndex', function CasProcessingIndex(Es, $q, nlptabConfig, $http) {
    var systemNameCache = {};

    this.getSystemNameForIndex = function (indexName) {
      var deferred = $q.defer();
      var systemName = systemNameCache[indexName];
      if (!systemName) {
        this.withIndexName(indexName).then(function (casProcessingIndex) {
          systemName = casProcessingIndex.system;
          systemNameCache[indexName] = systemName;
          deferred.resolve(systemName);
        }, function (error) {
          deferred.reject(error);
        });
      } else {
        deferred.resolve(systemName);
      }
      return deferred.promise;
    };

    this.withIndexName = function (indexName) {
      return Es.search({
        index: nlptabConfig.instanceName + 'metadata',
        type: 'SystemIndex',
        body: {
          size: 1,
          query: {
            match: {
              index: indexName
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits && body.hits.hits && body.hits.hits.length > 0) {
          return body.hits.hits[0]._source;
        } else {
          return {};
        }
      });
    };

    this.search = function (query, size) {
      return Es.search({
        index: nlptabConfig.instanceName + 'metadata',
        type: 'SystemIndex',
        body: {
          from: 0,
          size: size,
          query: {
            multi_match: {
              query: query,
              type: 'cross_fields',
              operator: 'and',
              fields: ['system', 'description']
            }
          }
        }
      });
    };

    this.all = function () {
      return Es.search({
        index: nlptabConfig.instanceName + 'metadata',
        type: 'SystemIndex',
        body: {
          size: 30,
          query: {
            match: {
              ready: true
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits && body.hits.hits) {
          return {total: body.hits.total, casProcessingIndexes: body.hits.hits.map(function (currentValue) {
            return currentValue._source;
          })};
        } else {
          return {total: 0, casProcessingIndexes: []};
        }
      });
    };

    this.deleteSystem = function (system) {
      return $http.post(nlptabConfig.esPath + '/_nlptab-deletesystem?instance=' + nlptabConfig.instanceName + '&id=' + system);
    };
  });
